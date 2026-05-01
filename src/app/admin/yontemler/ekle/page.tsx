"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function YontemEklePage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    gear_requirements: '',
    target_fishes: '',
    is_published: false
  });

  // URL (Slug) otomatik oluşturucu
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const generatedSlug = title
      .toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '') 
      .trim()
      .replace(/\s+/g, '-'); 

    setFormData({ ...formData, title: title, slug: generatedSlug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: insertError } = await supabase.from('fishing_methods').insert([{
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      gear_requirements: formData.gear_requirements,
      target_fishes: formData.target_fishes,
      is_published: formData.is_published
    }]);

    if (insertError) {
      console.error(insertError);
      setError(`Kayıt sırasında bir hata oluştu: ${insertError.message}`);
      setLoading(false);
    } else {
      router.push('/admin/yontemler');
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-slate-900 text-white p-4 sticky top-0 z-10 flex justify-between items-center shadow-md">
        <h1 className="font-bold text-lg tracking-tight">Yeni Yöntem Ekle</h1>
        <Link href="/admin/yontemler" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
          &larr; İptal
        </Link>
      </div>

      <div className="p-4 md:p-8 max-w-md mx-auto md:max-w-2xl mt-4">
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-md text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* TEMEL BİLGİLER */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Disiplin Bilgileri</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yöntem Adı *</label>
              <input 
                required type="text" value={formData.title} onChange={handleTitleChange}
                className="w-full rounded-md border-0 py-3 px-3 text-base text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="Örn: Spin Balıkçılığı"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL (Otomatik) *</label>
              <input 
                required type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})}
                className="w-full rounded-md border-0 py-3 px-3 text-base text-gray-500 bg-gray-50 ring-1 ring-inset ring-gray-300 outline-none" 
              />
            </div>
          </div>

          {/* İÇERİK VE REHBER DETAYLARI */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Rehber İçeriği</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genel Anlatım ve Teknikler</label>
              <textarea 
                rows={5} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full rounded-md border-0 py-3 px-3 text-base text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 outline-none resize-y" 
                placeholder="Bu avcılık türü nasıl yapılır? İncelikleri nelerdir?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ekipman Tavsiyeleri (Kamış, Makine, İp)</label>
              <textarea 
                rows={3} value={formData.gear_requirements} onChange={(e) => setFormData({...formData, gear_requirements: e.target.value})}
                className="w-full rounded-md border-0 py-3 px-3 text-base text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 outline-none resize-y" 
                placeholder="Örn: 240cm 10-30g atarlı kamış, 3000'lik makine..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hedeflenen Balıklar</label>
              <textarea 
                rows={2} value={formData.target_fishes} onChange={(e) => setFormData({...formData, target_fishes: e.target.value})}
                className="w-full rounded-md border-0 py-3 px-3 text-base text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 outline-none resize-y" 
                placeholder="Örn: Levrek, Lüfer, Turna..."
              />
            </div>
          </div>

          {/* YAYIN DURUMU VE KAYDET */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.is_published}
                onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                className="w-6 h-6 text-blue-600 rounded border-gray-300 focus:ring-blue-600"
              />
              <span className="text-base font-medium text-gray-900">Siteye Yayınla</span>
            </label>

            <button 
              type="submit" disabled={loading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-md font-bold text-base shadow-sm transition-colors disabled:opacity-70"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}
