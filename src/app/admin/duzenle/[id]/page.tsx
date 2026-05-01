"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

const Field = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full p-3 text-base bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

export default function DuzenlePage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const fishId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [fishData, setFishData] = useState<any>(null);
  const [yieldData, setYieldData] = useState<any[]>([]);
  const [banData, setBanData] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: cats } = await supabase.from('categories').select('*').order('name_tr');
      setCategories(cats || []);

      const { data: fish } = await supabase.from('fish').select('*').eq('id', fishId).single();
      const { data: yields } = await supabase.from('monthly_yield').select('*').eq('fish_id', fishId).order('month');
      const { data: bans } = await supabase.from('ban_periods').select('*').eq('fish_id', fishId);

      if (fish) {
        setFishData(fish);
        setBanData(bans || []);
        if (yields && yields.length === 12) {
          setYieldData(yields);
        } else {
          setYieldData(Array.from({ length: 12 }, (_, i) => ({ month: i + 1, yield_score: 0, notes: '' })));
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [fishId, supabase]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addBan = () => setBanData([...banData, { start_month: 1, end_month: 1, ban_type: 'full', region: '', description: '' }]);
  const removeBan = (i: number) => setBanData(banData.filter((_, idx) => idx !== i));
  const updateBan = (i: number, field: string, value: any) => {
    const nb = [...banData]; nb[i][field] = value; setBanData(nb);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let finalImageUrl = fishData.cover_image_url;
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${fishData.slug}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('fish-images').upload(fileName, imageFile, { upsert: true });
      if (!uploadError) {
        const { data: pub } = supabase.storage.from('fish-images').getPublicUrl(fileName);
        finalImageUrl = pub.publicUrl;
      }
    }

    await supabase.from('fish').update({
      name_tr: fishData.name_tr,
      name_latin: fishData.name_latin,
      category_id: fishData.category_id,
      water_type: fishData.water_type,
      min_size_cm: fishData.min_size_cm ? parseInt(fishData.min_size_cm) : null,
      max_size_cm: fishData.max_size_cm ? parseInt(fishData.max_size_cm) : null,
      avg_weight_kg: fishData.avg_weight_kg ? parseFloat(fishData.avg_weight_kg) : null,
      habitat: fishData.habitat,
      description: fishData.description,
      fishing_tactics: fishData.fishing_tactics,
      recommended_baits: fishData.recommended_baits,
      fishing_tips: fishData.fishing_tips,
      bait_info: fishData.bait_info,
      meat_quality: fishData.meat_quality,
      cover_image_url: finalImageUrl,
      is_published: fishData.is_published
    }).eq('id', fishId);

    const yieldsToSave = yieldData.map(y => ({ fish_id: fishId, month: y.month, yield_score: parseInt(y.yield_score) || 0, notes: y.notes || '' }));
    await supabase.from('monthly_yield').upsert(yieldsToSave, { onConflict: 'fish_id,month' });

    await supabase.from('ban_periods').delete().eq('fish_id', fishId);
    if (banData.length > 0) {
      await supabase.from('ban_periods').insert(banData.map(b => ({ fish_id: fishId, start_month: b.start_month, end_month: b.end_month, ban_type: b.ban_type, region: b.region, description: b.description })));
    }

    router.push('/admin');
    router.refresh();
  };

  if (loading) return <div className="p-8 text-center font-medium">Yükleniyor...</div>;

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-slate-900 text-white p-4 sticky top-0 z-10 flex justify-between items-center shadow-md">
        <h1 className="font-bold text-lg">Balık Düzenle</h1>
        <Link href="/admin" className="text-sm text-slate-300">← İptal</Link>
      </div>

      <form onSubmit={handleSave} className="p-4 max-w-2xl mx-auto space-y-5 mt-4">

        {/* KAPAK FOTOĞRAFI */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-900 border-b pb-2">Kapak Fotoğrafı</h2>
          {(imagePreview || fishData.cover_image_url) ? (
            <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
              <img src={imagePreview || fishData.cover_image_url} alt="Önizleme" className="object-cover w-full h-full" />
            </div>
          ) : (
            <div className="w-full h-28 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">Görsel Yok</div>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange}
            className="w-full text-base text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>

        {/* TEMEL KİMLİK BİLGİLERİ */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-900 border-b pb-2">① Kimlik Bilgileri</h2>
          <Field label="Türkçe Adı *">
            <input className={inputCls} value={fishData.name_tr || ''} onChange={e => setFishData({...fishData, name_tr: e.target.value})} placeholder="Örn: Sazan" />
          </Field>
          <Field label="Latince Adı">
            <input className={`${inputCls} italic`} value={fishData.name_latin || ''} onChange={e => setFishData({...fishData, name_latin: e.target.value})} placeholder="Örn: Cyprinus carpio" />
          </Field>
          <Field label="Familya / Kategori">
            <select className={inputCls} value={fishData.category_id || ''} onChange={e => setFishData({...fishData, category_id: e.target.value})}>
              <option value="">Kategori Seçin</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.parent_id ? `  ↳ ${cat.name_tr}` : cat.name_tr.toUpperCase()}</option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Su Tipi">
              <select className={inputCls} value={fishData.water_type || 'fresh'} onChange={e => setFishData({...fishData, water_type: e.target.value})}>
                <option value="fresh">Tatlı Su</option>
                <option value="salt">Tuzlu Su</option>
                <option value="both">Her İkisi</option>
              </select>
            </Field>
          </div>
        </div>

        {/* BOYUT VE HABITAT */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-900 border-b pb-2">② Boyut & Habitat Bilgileri</h2>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Yasal Boy Limiti (cm)">
              <input type="number" className={inputCls} value={fishData.min_size_cm || ''} onChange={e => setFishData({...fishData, min_size_cm: e.target.value})} placeholder="25" />
            </Field>
            <Field label="Maks. Boy (cm)">
              <input type="number" className={inputCls} value={fishData.max_size_cm || ''} onChange={e => setFishData({...fishData, max_size_cm: e.target.value})} placeholder="120" />
            </Field>
            <Field label="Ort. Ağırlık (kg)">
              <input type="number" step="0.1" className={inputCls} value={fishData.avg_weight_kg || ''} onChange={e => setFishData({...fishData, avg_weight_kg: e.target.value})} placeholder="2.5" />
            </Field>
          </div>
          <Field label="Habitat (Nerede Yaşar?)">
            <textarea rows={2} className={inputCls} value={fishData.habitat || ''} onChange={e => setFishData({...fishData, habitat: e.target.value})} placeholder="Örn: Akdeniz ve Ege kıyıları, kayalık ve kumlu dipler, 5-50m derinlik" />
          </Field>
        </div>

        {/* GENEL BİLGİLER */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-900 border-b pb-2">③ Genel Bilgiler (Beslenme, Üreme, Davranış)</h2>
          <textarea rows={5} className={inputCls} value={fishData.description || ''} onChange={e => setFishData({...fishData, description: e.target.value})} placeholder="Balığın genel özellikleri, beslenme alışkanlıkları, üreme dönemi, davranış biçimi..." />
        </div>

        {/* AVLANMA TAKTİKLERİ */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-900 border-b pb-2">④ Avlanma Taktikleri (Mevsim, Saat, Teknik)</h2>
          <textarea rows={4} className={inputCls} value={fishData.fishing_tactics || ''} onChange={e => setFishData({...fishData, fishing_tactics: e.target.value})} placeholder="Hangi mevsimde, günün hangi saatinde, hangi teknikle avlanılır..." />
        </div>

        {/* ÖNERİLEN YEMLER */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-900 border-b pb-2">⑤ Önerilen Yemler (Doğal & Yapay)</h2>
          <textarea rows={3} className={inputCls} value={fishData.recommended_baits || ''} onChange={e => setFishData({...fishData, recommended_baits: e.target.value})} placeholder="Doğal yemler: solucan, karides... Yapay: silikon, jig, maket..." />
          <Field label="Ek Yem / Besit Bilgisi">
            <textarea rows={2} className={inputCls} value={fishData.bait_info || ''} onChange={e => setFishData({...fishData, bait_info: e.target.value})} placeholder="Ek yem hazırlama notları..." />
          </Field>
        </div>

        {/* ET KALİTESİ */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-900 border-b pb-2">⑥ Et Kalitesi & Pişirme Önerisi</h2>
          <textarea rows={3} className={inputCls} value={fishData.meat_quality || ''} onChange={e => setFishData({...fishData, meat_quality: e.target.value})} placeholder="Et kalitesi, yağ oranı, pişirme yöntemleri, tat tanımı..." />
          <Field label="Avlanma İpuçları (Kısa özet)">
            <textarea rows={2} className={inputCls} value={fishData.fishing_tips || ''} onChange={e => setFishData({...fishData, fishing_tips: e.target.value})} placeholder="Kısa ipucu özeti (detay sayfasında kutu olarak görünür)" />
          </Field>
        </div>

        {/* 12 AYLIK VERİM */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="font-bold text-gray-900 border-b pb-2 mb-4">⑦ 12 Aylık Av Verimi (%0-100)</h2>
          <div className="space-y-2">
            {yieldData.map((y, index) => (
              <div key={y.month} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                <span className="w-8 font-bold text-blue-600 text-sm">{MONTHS[index]}</span>
                <input type="range" min="0" max="100" value={y.yield_score}
                  onChange={e => { const nd = [...yieldData]; nd[index].yield_score = e.target.value; setYieldData(nd); }}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                <span className="w-10 text-right font-mono text-sm text-gray-600 font-bold">%{y.yield_score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AV YASAKLARI */}
        <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-red-100 pb-2">
            <h2 className="font-bold text-red-700">⑧ Av Yasakları</h2>
            <button type="button" onClick={addBan} className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded-full border border-red-200 font-bold">+ Yasak Ekle</button>
          </div>
          {banData.map((ban, index) => (
            <div key={index} className="p-3 bg-red-50/50 rounded-lg border border-red-100 relative space-y-3">
              <button type="button" onClick={() => removeBan(index)} className="absolute top-2 right-2 text-xs text-red-400 hover:text-red-600 font-bold">Kaldır</button>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-red-800 uppercase block mb-1">Başlangıç</label>
                  <select value={ban.start_month} onChange={e => updateBan(index, 'start_month', parseInt(e.target.value))} className="w-full p-2 text-sm border rounded outline-none">
                    {MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-red-800 uppercase block mb-1">Bitiş</label>
                  <select value={ban.end_month} onChange={e => updateBan(index, 'end_month', parseInt(e.target.value))} className="w-full p-2 text-sm border rounded outline-none">
                    {MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                  </select>
                </div>
              </div>
              <input className="w-full p-2 text-sm border rounded outline-none" placeholder="Bölge (Örn: Tüm Türkiye)" value={ban.region || ''} onChange={e => updateBan(index, 'region', e.target.value)} />
            </div>
          ))}
        </div>

        {/* YAYIN DURUMU */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={fishData.is_published || false} onChange={e => setFishData({...fishData, is_published: e.target.checked})}
              className="w-6 h-6 accent-blue-600 rounded" />
            <span className="text-base font-medium text-gray-900">Siteye Yayınla (Herkes Görebilir)</span>
          </label>
        </div>

        {/* KAYDET */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-4 md:static md:bg-transparent md:border-0 md:p-0 z-20">
          <button type="submit" disabled={saving}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-4 md:py-3.5 rounded-xl md:rounded-lg font-bold text-lg md:text-base shadow-lg active:scale-95 transition-all disabled:opacity-70">
            {saving ? 'Kaydediliyor...' : '✓ Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </main>
  );
}
