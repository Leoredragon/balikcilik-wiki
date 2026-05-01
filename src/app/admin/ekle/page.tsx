"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EklePage() {
  const router = useRouter();
  const supabase = createClient();

  // Kategorileri veritabanından çekip burada tutacağız
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form verilerini tutacağımız state (başlangıç değerleri boş)
  const [formData, setFormData] = useState({
    name_tr: '',
    name_latin: '',
    slug: '',
    category_id: '',
    water_type: 'fresh',
    min_size_cm: '',
    max_size_cm: '',
    avg_weight_kg: '',
    description: '',
    fishing_tips: '',
    bait_info: '',
    is_published: false
  });

  // Sayfa yüklendiğinde kategorileri çek
  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('id, name_tr').order('name_tr');
      if (data) setCategories(data);
    }
    fetchCategories();
  }, [supabase]);

  // Form gönderildiğinde çalışacak fonksiyon
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Rakam alanlarını number formatına, boşsa null'a çeviriyoruz
    const payload = {
      ...formData,
      min_size_cm: formData.min_size_cm ? parseFloat(formData.min_size_cm) : null,
      max_size_cm: formData.max_size_cm ? parseFloat(formData.max_size_cm) : null,
      avg_weight_kg: formData.avg_weight_kg ? parseFloat(formData.avg_weight_kg) : null,
      // Eğer kategori seçilmediyse null gönder
      category_id: formData.category_id === '' ? null : formData.category_id
    };

    const { error: insertError } = await supabase.from('fish').insert([payload]);

    if (insertError) {
      console.error(insertError);
      setError(`Kayıt sırasında bir hata oluştu: ${insertError.message}`);
      setLoading(false);
    } else {
      // Başarılı olursa admin paneline geri dön ve sayfayı yenile
      router.push('/admin');
      router.refresh();
    }
  };

  // URL (Slug) otomatik oluşturucu (Türkçe karakterleri ve boşlukları dönüştürür)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const generatedSlug = name
      .toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '') // Özel karakterleri sil
      .trim()
      .replace(/\s+/g, '-'); // Boşlukları tire yap

    setFormData({ ...formData, name_tr: name, slug: generatedSlug });
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* Üst Bar */}
      <div className="bg-slate-900 text-white p-4 sticky top-0 z-10 flex justify-between items-center shadow-md">
        <h1 className="font-bold text-lg tracking-tight">Yeni Balık Ekle</h1>
        <Link href="/admin" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
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
          
          {/* 1. KART: Temel Bilgiler */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Temel Bilgiler</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Balık Adı (Türkçe) *</label>
              <input 
                required type="text" value={formData.name_tr} onChange={handleNameChange}
                className="w-full rounded-md border-0 py-3 px-3 text-base text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="Örn: Levrek"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL (Otomatik oluşur) *</label>
              <input 
                required type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})}
                className="w-full rounded-md border-0 py-3 px-3 text-base text-gray-500 bg-gray-50 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latince Adı</label>
              <input 
                type="text" value={formData.name_latin} onChange={(e) => setFormData({...formData, name_latin: e.target.value})}
                className="w-full rounded-md border-0 py-3 px-3 text-base text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 outline-none italic" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select 
                value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                className="w-full rounded-md border-0 py-3 px-3 text-base text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 outline-none bg-white"
              >
                <option value="">Kategori Seçin...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name_tr}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Su Tipi</label>
              <select 
                value={formData.water_type} onChange={(e) => setFormData({...formData, water_type: e.target.value})}
                className="w-full rounded-md border-0 py-3 px-3 text-base text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 outline-none bg-white"
              >
                <option value="fresh">Tatlı Su</option>
                <option value="salt">Tuzlu Su</option>
                <option value="both">Hem Tatlı Hem Tuzlu Su</option>
              </select>
            </div>
          </div>

          {/* 2. KART: Ölçüler */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Ölçü ve Limitler</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Boy (cm)</label>
                <input 
                  type="number" step="0.1" value={formData.min_size_cm} onChange={(e) => setFormData({...formData, min_size_cm: e.target.value})}
                  className="w-full rounded-md border-0 py-3 px-3 text-base text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Boy (cm)</label>
                <input 
                  type="number" step="0.1" value={formData.max_size_cm} onChange={(e) => setFormData({...formData, max_size_cm: e.target.value})}
                  className="w-full rounded-md border-0 py-3 px-3 text-base text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" 
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ort. Ağırlık (kg)</label>
                <input 
                  type="number" step="0.1" value={formData.avg_weight_kg} onChange={(e) => setFormData({...formData, avg_weight_kg: e.target.value})}
                  className="w-full rounded-md border-0 py-3 px-3 text-base text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" 
                />
              </div>
            </div>
          </div>

          {/* 3. KART: İçerik */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2">İçerik ve Detaylar</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genel Açıklama</label>
              <textarea 
                rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full rounded-md border-0 py-3 px-3 text-base text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 outline-none resize-y" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Avlanma Taktikleri</label>
              <textarea 
                rows={3} value={formData.fishing_tips} onChange={(e) => setFormData({...formData, fishing_tips: e.target.value})}
                className="w-full rounded-md border-0 py-3 px-3 text-base text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 outline-none resize-y" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yem Bilgisi</label>
              <textarea 
                rows={2} value={formData.bait_info} onChange={(e) => setFormData({...formData, bait_info: e.target.value})}
                className="w-full rounded-md border-0 py-3 px-3 text-base text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 outline-none resize-y" 
              />
            </div>
          </div>

          {/* 4. KART: Yayın Durumu ve Kaydet */}
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
