"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function YontemDuzenlePage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const methodId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<any>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMethod() {
      const { data } = await supabase.from('fishing_methods').select('*').eq('id', methodId).single();
      if (data) setFormData(data);
      setLoading(false);
    }
    fetchMethod();
  }, [methodId, supabase]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    let finalImageUrl = formData.cover_image_url;

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `method-${formData.slug}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('fish-images').upload(fileName, imageFile, { upsert: true });
      if (uploadError) {
        setError('Fotoğraf yüklenirken hata oluştu: ' + uploadError.message);
        setSaving(false);
        return;
      }
      const { data: publicUrlData } = supabase.storage.from('fish-images').getPublicUrl(fileName);
      finalImageUrl = publicUrlData.publicUrl;
    }

    const { error: updateError } = await supabase.from('fishing_methods').update({
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      gear_requirements: formData.gear_requirements,
      target_fishes: formData.target_fishes,
      cover_image_url: finalImageUrl,
      is_published: formData.is_published
    }).eq('id', methodId);

    if (updateError) {
      setError(`Güncelleme başarısız: ${updateError.message}`);
      setSaving(false);
    } else {
      router.push('/admin/yontemler');
      router.refresh();
    }
  };

  if (loading) return <div className="p-8 text-center font-medium text-gray-600 mt-20">Veriler yükleniyor...</div>;

  return (
    <main className="min-h-screen bg-gray-50 pb-24 md:pb-12">
      <div className="bg-slate-900 text-white p-4 sticky top-0 z-10 flex justify-between items-center shadow-md">
        <h1 className="font-bold text-lg tracking-tight">Yöntemi Düzenle</h1>
        <Link href="/admin/yontemler" className="text-sm font-medium text-slate-300 hover:text-white">← İptal</Link>
      </div>

      <div className="p-4 md:p-8 max-w-md mx-auto md:max-w-2xl mt-4">
        {error && <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-100">{error}</div>}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* KAPAK FOTOĞRAFI */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-900 border-b pb-2">Kapak Fotoğrafı</h2>
            <div className="flex flex-col items-center gap-4">
              {(imagePreview || formData.cover_image_url) ? (
                <div className="w-full h-48 relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                  <img src={imagePreview || formData.cover_image_url} alt="Önizleme" className="object-cover w-full h-full" />
                </div>
              ) : (
                <div className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 gap-2">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-sm">Görsel Yok</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-base text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
          </div>

          {/* TEMEL BİLGİLER */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-900 border-b pb-2">Disiplin Bilgileri</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yöntem Adı *</label>
              <input required type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 text-base border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL (Slug) *</label>
              <input required type="text" value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})}
                className="w-full p-3 text-base border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500" />
            </div>
          </div>

          {/* İÇERİK */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-900 border-b pb-2">Rehber İçeriği</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genel Anlatım ve Teknikler</label>
              <textarea rows={6} value={formData.content || ''} onChange={e => setFormData({...formData, content: e.target.value})}
                className="w-full p-3 text-base border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ekipman Tavsiyeleri</label>
              <textarea rows={4} value={formData.gear_requirements || ''} onChange={e => setFormData({...formData, gear_requirements: e.target.value})}
                className="w-full p-3 text-base border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hedeflenen Balıklar</label>
              <textarea rows={2} value={formData.target_fishes || ''} onChange={e => setFormData({...formData, target_fishes: e.target.value})}
                className="w-full p-3 text-base border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
            </div>
          </div>

          {/* YAYIN DURUMU */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={formData.is_published || false} onChange={e => setFormData({...formData, is_published: e.target.checked})}
                className="w-6 h-6 text-blue-600 rounded border-gray-300 accent-blue-600" />
              <span className="text-base font-medium text-gray-900">Siteye Yayınla (Herkes Görebilir)</span>
            </label>
          </div>

          {/* KAYDET BUTONU - Mobilde sabit, masaüstünde normal */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex gap-4 md:static md:bg-transparent md:border-0 md:p-0 z-20">
            <button type="submit" disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-4 md:py-3.5 rounded-xl md:rounded-lg font-bold text-lg md:text-base shadow-lg active:scale-95 transition-all disabled:opacity-70">
              {saving ? 'Görsel Yükleniyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
