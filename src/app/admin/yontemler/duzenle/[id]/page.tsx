"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const inputCls = "w-full p-3 text-base bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500";

export default function YontemDuzenlePage() {
  const router = useRouter();
  const { id: methodId } = useParams();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<any>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('fishing_methods').select('*').eq('id', methodId).single()
      .then(({ data }) => { if (data) setFormData(data); setLoading(false); });
  }, [methodId, supabase]);

  const f = (key: string) => formData[key] || '';
  const set = (key: string, val: any) => setFormData((p: any) => ({ ...p, [key]: val }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    let finalImageUrl = formData.cover_image_url;
    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const fileName = `method-${formData.slug}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('fish-images').upload(fileName, imageFile, { upsert: true });
      if (upErr) { setError('Fotoğraf yüklenemedi: ' + upErr.message); setSaving(false); return; }
      const { data: pub } = supabase.storage.from('fish-images').getPublicUrl(fileName);
      finalImageUrl = pub.publicUrl;
    }

    const { error: updateError } = await supabase.from('fishing_methods').update({
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      suitable_fish: formData.suitable_fish,
      target_fishes: formData.suitable_fish,
      best_season: formData.best_season,
      gear_requirements: formData.gear_requirements,
      step_by_step: formData.step_by_step,
      common_mistakes: formData.common_mistakes,
      cover_image_url: finalImageUrl,
      is_published: formData.is_published
    }).eq('id', methodId);

    if (updateError) { setError(updateError.message); setSaving(false); return; }
    router.push('/admin/yontemler');
    router.refresh();
  };

  if (loading) return <div className="p-8 text-center">Yükleniyor...</div>;

  const Section = ({ title, children }: any) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <h2 className="font-bold text-gray-900 border-b pb-2">{title}</h2>
      {children}
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-slate-900 text-white p-4 sticky top-0 z-10 flex justify-between items-center shadow-md">
        <h1 className="font-bold text-lg">Yöntemi Düzenle</h1>
        <Link href="/admin/yontemler" className="text-sm text-slate-300">← İptal</Link>
      </div>

      {error && <div className="m-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">{error}</div>}

      <form onSubmit={handleSave} className="p-4 max-w-2xl mx-auto space-y-5 mt-4">

        {/* KAPAK FOTOĞRAFI */}
        <Section title="Kapak Fotoğrafı">
          {(imagePreview || formData.cover_image_url)
            ? <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200"><img src={imagePreview || formData.cover_image_url} className="w-full h-full object-cover" /></div>
            : <div className="w-full h-28 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">Görsel Yok</div>
          }
          <input type="file" accept="image/*" onChange={handleImageChange}
            className="w-full text-base text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700" />
        </Section>

        {/* KİMLİK */}
        <Section title="① Temel Bilgiler">
          <input required className={inputCls} value={f('title')} onChange={e => set('title', e.target.value)} placeholder="Yöntem Adı (Örn: Spin Balıkçılığı)" />
          <input required className={`${inputCls} text-gray-500`} value={f('slug')} onChange={e => set('slug', e.target.value)} placeholder="URL slug (örn: spin-balikcilik)" />
        </Section>

        {/* GENEL ANLATIM */}
        <Section title="② Genel Anlatım ve Teknikler">
          <textarea rows={6} className={inputCls} value={f('content')} onChange={e => set('content', e.target.value)} placeholder="Bu yöntemin nasıl yapıldığını, temel tekniklerini ve prensiplerini anlat..." />
        </Section>

        {/* HANGİ BALIKLAR */}
        <Section title="③ Hangi Balıklar İçin Uygun?">
          <textarea rows={3} className={inputCls} value={f('suitable_fish')} onChange={e => set('suitable_fish', e.target.value)} placeholder="Levrek, Sazan, Sudak... hangi türler için idealdir?" />
        </Section>

        {/* MEVSİM */}
        <Section title="④ Hangi Mevsim / Ay / Saat?">
          <textarea rows={3} className={inputCls} value={f('best_season')} onChange={e => set('best_season', e.target.value)} placeholder="İlkbahar ve Sonbahar en verimli dönemlerdir. Sabah erken saatlerde ve akşam üstü..." />
        </Section>

        {/* EKİPMAN */}
        <Section title="⑤ Hangi Ekipman Gerekli?">
          <textarea rows={4} className={inputCls} value={f('gear_requirements')} onChange={e => set('gear_requirements', e.target.value)} placeholder="Kamış: 2.7m orta aksiyon spin kamış, Makine: 2500 beden, İp: PE0.6 örgü..." />
        </Section>

        {/* ADIM ADIM */}
        <Section title="⑥ Adım Adım Uygulama">
          <textarea rows={6} className={inputCls} value={f('step_by_step')} onChange={e => set('step_by_step', e.target.value)} placeholder="1. Yemi takın...\n2. Atışı yapın...\n3. Çekişe başlayın..." />
        </Section>

        {/* HATALAR */}
        <Section title="⑦ Yapılan Hatalar ve Çözümleri">
          <textarea rows={4} className={inputCls} value={f('common_mistakes')} onChange={e => set('common_mistakes', e.target.value)} placeholder="Hata: Çok hızlı çekmek → Çözüm: Yavaş ve düzenli çekim yapın..." />
        </Section>

        {/* YAYIN */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={formData.is_published || false} onChange={e => set('is_published', e.target.checked)} className="w-6 h-6 accent-blue-600 rounded" />
            <span className="text-base font-medium text-gray-900">Siteye Yayınla</span>
          </label>
        </div>

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
