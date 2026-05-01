"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function KategoriEklePage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingCategories, setExistingCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name_tr: '',
    slug: '',
    description: '',
    parent_id: ''
  });

  // Üst kategori seçimi için mevcut kategorileri çekiyoruz
  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('id, name_tr').order('name_tr');
      if (data) setExistingCategories(data);
    }
    fetchCategories();
  }, [supabase]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const generatedSlug = name
      .toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '') 
      .trim()
      .replace(/\s+/g, '-'); 

    setFormData({ ...formData, name_tr: name, slug: generatedSlug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      name_tr: formData.name_tr,
      slug: formData.slug,
      description: formData.description,
      parent_id: formData.parent_id === '' ? null : formData.parent_id
    };

    const { error: insertError } = await supabase.from('categories').insert([payload]);

    if (insertError) {
      setError(`Hata: ${insertError.message}`);
      setLoading(false);
    } else {
      router.push('/admin/kategoriler');
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-slate-900 text-white p-4 sticky top-0 z-10 flex justify-between items-center shadow-md">
        <h1 className="font-bold text-lg tracking-tight">Yeni Kategori Ekle</h1>
        <Link href="/admin/kategoriler" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
          &larr; İptal
        </Link>
      </div>

      <div className="p-4 md:p-8 max-w-md mx-auto md:max-w-2xl mt-4">
        {error && <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-md text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Adı *</label>
              <input 
                required type="text" value={formData.name_tr} onChange={handleNameChange}
                className="w-full rounded-md border-0 py-3 px-3 text-base text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="Örn: Sazan Ailesi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL (Otomatik) *</label>
              <input 
                required type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})}
                className="w-full rounded-md border-0 py-3 px-3 text-base text-gray-500 bg-gray-50 ring-1 ring-inset ring-gray-300 outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kısa Açıklama</label>
              <textarea 
                rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full rounded-md border-0 py-3 px-3 text-base text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 outline-none resize-y" 
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="block text-sm font-bold text-gray-900 mb-1">Üst Kategori (Alt kategori ise seçin)</label>
              <p className="text-xs text-gray-500 mb-2">Örneğin "Sazan Ailesi", "Tatlı Su Balıkları" kategorisinin bir alt kategorisi olabilir.</p>
              <select 
                value={formData.parent_id} onChange={(e) => setFormData({...formData, parent_id: e.target.value})}
                className="w-full rounded-md border-0 py-3 px-3 text-base text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 outline-none bg-white"
              >
                <option value="">Hiçbiri (Ana Kategori)</option>
                {existingCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name_tr}</option>
                ))}
              </select>
            </div>

          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-4 md:static md:bg-transparent md:border-0 md:p-0 z-20">
            <button 
              type="submit" disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-4 md:py-3.5 rounded-xl md:rounded-md font-bold text-lg md:text-base shadow-lg md:shadow-sm active:scale-95 transition-all"
            >
              {loading ? 'Kaydediliyor...' : 'Kategoriyi Kaydet'}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}
