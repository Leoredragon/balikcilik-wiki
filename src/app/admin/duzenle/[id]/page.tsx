"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

export default function DuzenlePage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const fishId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
  // State'ler
  const [fishData, setFishData] = useState<any>(null);
  const [yieldData, setYieldData] = useState<any[]>([]);
  const [banData, setBanData] = useState<any[]>([]);

  // Fotoğraf State'leri
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: cats } = await supabase.from('categories').select('*');
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
          const template = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, yield_score: 0, notes: '' }));
          setYieldData(template);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [fishId, supabase]);

  // Fotoğraf seçildiğinde önizleme oluşturur
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // --- AV YASAĞI FONKSİYONLARI ---
  const addBan = () => setBanData([...banData, { start_month: 1, end_month: 1, ban_type: 'full', region: '', description: '' }]);
  const removeBan = (index: number) => setBanData(banData.filter((_, i) => i !== index));
  const updateBan = (index: number, field: string, value: any) => {
    const newBans = [...banData];
    newBans[index][field] = value;
    setBanData(newBans);
  };

  // --- KAYDETME FONKSİYONU ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let finalImageUrl = fishData.cover_image_url;

    // 1. Eğer yeni fotoğraf seçildiyse Supabase Storage'a yükle
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${fishData.slug}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('fish-images')
        .upload(fileName, imageFile, { upsert: true });

      if (uploadError) {
        alert("Fotoğraf yüklenirken hata oluştu!");
        setSaving(false);
        return;
      }

      // Yüklenen fotoğrafın açık URL'ini al
      const { data: publicUrlData } = supabase.storage.from('fish-images').getPublicUrl(fileName);
      finalImageUrl = publicUrlData.publicUrl;
    }

    // 2. Balık tablosunu güncelle (yeni resim linki ile)
    await supabase.from('fish').update({
      name_tr: fishData.name_tr,
      name_latin: fishData.name_latin,
      category_id: fishData.category_id,
      water_type: fishData.water_type,
      min_size_cm: fishData.min_size_cm,
      description: fishData.description,
      fishing_tips: fishData.fishing_tips,
      bait_info: fishData.bait_info,
      cover_image_url: finalImageUrl, // YENİ RESİM URL'Sİ BURAYA
      is_published: fishData.is_published
    }).eq('id', fishId);

    // 3. Verim verilerini güncelle
    const yieldsToSave = yieldData.map(y => ({ fish_id: fishId, month: y.month, yield_score: parseInt(y.yield_score), notes: y.notes }));
    await supabase.from('monthly_yield').upsert(yieldsToSave, { onConflict: 'fish_id,month' });

    // 4. Av yasaklarını güncelle
    await supabase.from('ban_periods').delete().eq('fish_id', fishId);
    if (banData.length > 0) {
      const bansToSave = banData.map(b => ({ fish_id: fishId, start_month: b.start_month, end_month: b.end_month, ban_type: b.ban_type, region: b.region, description: b.description }));
      await supabase.from('ban_periods').insert(bansToSave);
    }

    router.push('/admin');
    router.refresh();
  };

  if (loading) return <div className="p-8 text-center font-medium">Yükleniyor...</div>;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-slate-900 text-white p-4 sticky top-0 z-10 flex justify-between items-center shadow-md">
        <h1 className="font-bold text-lg">Balık Düzenle</h1>
        <Link href="/admin" className="text-sm text-slate-300">İptal</Link>
      </div>

      <form onSubmit={handleSave} className="p-4 max-w-2xl mx-auto space-y-6 mt-4">
        
        {/* FOTOĞRAF YÜKLEME KARTI (YENİ EKLENDİ) */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-900 border-b pb-2">Kapak Fotoğrafı</h2>
          
          <div className="flex flex-col items-center gap-4">
            {/* Önizleme Alanı */}
            {(imagePreview || fishData.cover_image_url) ? (
              <div className="w-full h-48 relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                <img 
                  src={imagePreview || fishData.cover_image_url} 
                  alt="Önizleme" 
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                Görsel Yok
              </div>
            )}
            
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 outline-none"
            />
          </div>
        </div>

        {/* TEMEL BİLGİLER KARTI */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-900 border-b pb-2">Genel Bilgiler</h2>
          <input className="w-full p-3 bg-gray-50 border rounded-md" value={fishData.name_tr} onChange={e => setFishData({...fishData, name_tr: e.target.value})} placeholder="Balık Adı" />
          <input className="w-full p-3 bg-gray-50 border rounded-md italic" value={fishData.name_latin || ''} onChange={e => setFishData({...fishData, name_latin: e.target.value})} placeholder="Latince Adı" />
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Kategori</label>
            <select 
              className="w-full p-3 bg-gray-50 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              value={fishData.category_id || ''} 
              onChange={e => setFishData({...fishData, category_id: e.target.value})}
            >
              <option value="">Kategori Seçin</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.parent_id ? `↳ ${cat.name_tr}` : cat.name_tr.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          
          <textarea rows={4} className="w-full p-3 bg-gray-50 border rounded-md" value={fishData.description || ''} onChange={e => setFishData({...fishData, description: e.target.value})} placeholder="Açıklama (Ansiklopedi bilgisi)" />
        </div>

        {/* 12 AYLIK VERİM KARTI */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="font-bold text-gray-900 border-b pb-2 mb-4">12 Aylık Av Verimi (%0-100)</h2>
          <div className="space-y-3">
            {yieldData.map((y, index) => (
              <div key={y.month} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                <span className="w-10 font-bold text-blue-600 text-sm">{MONTHS[index]}</span>
                <input type="range" min="0" max="100" value={y.yield_score} onChange={e => { const newData = [...yieldData]; newData[index].yield_score = e.target.value; setYieldData(newData); }} className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                <span className="w-8 text-right font-mono text-sm text-gray-600">%{y.yield_score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AV YASAKLARI KARTI */}
        <div className="bg-white p-5 rounded-xl border border-red-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="font-bold text-red-700">Av Yasakları</h2>
            <button type="button" onClick={addBan} className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded-full border border-red-200 font-bold">+ Yeni Yasak Ekle</button>
          </div>
          <div className="space-y-4">
            {banData.map((ban, index) => (
              <div key={index} className="p-4 bg-red-50/50 rounded-lg border border-red-100 relative space-y-3">
                <button type="button" onClick={() => removeBan(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-600">Sil</button>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-[10px] font-bold text-red-800 uppercase">Başlangıç</label><select value={ban.start_month} onChange={e => updateBan(index, 'start_month', parseInt(e.target.value))} className="w-full p-2 text-sm border rounded outline-none">{MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}</select></div>
                  <div><label className="text-[10px] font-bold text-red-800 uppercase">Bitiş</label><select value={ban.end_month} onChange={e => updateBan(index, 'end_month', parseInt(e.target.value))} className="w-full p-2 text-sm border rounded outline-none">{MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}</select></div>
                </div>
                <input placeholder="Bölge (Örn: Tüm Türkiye)" className="w-full p-2 text-sm border rounded outline-none" value={ban.region || ''} onChange={e => updateBan(index, 'region', e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        {/* KAYDET BUTONU */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-4 md:static md:bg-transparent md:border-0 md:p-0 z-20">
          <button type="submit" disabled={saving} className="flex-1 bg-blue-600 text-white py-4 md:py-3.5 rounded-xl md:rounded-md font-bold text-lg md:text-base shadow-lg transition-transform active:scale-95 disabled:opacity-70">
            {saving ? 'Görsel Yükleniyor & Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>

      </form>
    </main>
  );
}
