"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EquipmenDuzenlePage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const equipId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [equipData, setEquipData] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: equip } = await supabase.from('equipments').select('*').eq('id', equipId).single();
      if (equip) {
        setEquipData(equip);
      }
      setLoading(false);
    }
    fetchData();
  }, [equipId, supabase]);

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

    let finalImageUrl = equipData.cover_image_url;

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `equip-${equipData.slug}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('fish-images') // Aynı bucket'ı kullanıyoruz
        .upload(fileName, imageFile, { upsert: true });

      if (uploadError) {
        alert("Fotoğraf yüklenirken hata oluştu!");
        setSaving(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage.from('fish-images').getPublicUrl(fileName);
      finalImageUrl = publicUrlData.publicUrl;
    }

    await supabase.from('equipments').update({
      title: equipData.title,
      category_name: equipData.category_name,
      description: equipData.description,
      technical_details: equipData.technical_details,
      tips: equipData.tips,
      cover_image_url: finalImageUrl,
      is_published: equipData.is_published
    }).eq('id', equipId);

    router.push('/admin/ekipmanlar');
    router.refresh();
  };

  if (loading) return <div className="p-8 text-center font-medium">Yükleniyor...</div>;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-slate-900 text-white p-4 sticky top-0 z-10 flex justify-between items-center shadow-md">
        <h1 className="font-bold text-lg">Ekipman Düzenle</h1>
        <Link href="/admin/ekipmanlar" className="text-sm text-slate-300">İptal</Link>
      </div>

      <form onSubmit={handleSave} className="p-4 max-w-2xl mx-auto space-y-6 mt-4">
        
        {/* FOTOĞRAF KARTI */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-900 border-b pb-2">Ürün Görseli</h2>
          <div className="flex flex-col items-center gap-4">
            {(imagePreview || equipData.cover_image_url) ? (
              <div className="w-full h-48 relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                <img src={imagePreview || equipData.cover_image_url} alt="Önizleme" className="object-cover w-full h-full" />
              </div>
            ) : (
              <div className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">Görsel Yok</div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 outline-none" />
          </div>
        </div>

        {/* TEMEL BİLGİLER */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-900 border-b pb-2">Genel Bilgiler</h2>
          <input className="w-full p-3 bg-gray-50 border rounded-md" value={equipData.title} onChange={e => setEquipData({...equipData, title: e.target.value})} placeholder="Ekipman Adı" />
          <input className="w-full p-3 bg-gray-50 border rounded-md" value={equipData.category_name || ''} onChange={e => setEquipData({...equipData, category_name: e.target.value})} placeholder="Kategori (Örn: Olta Kamışları)" />
          <textarea rows={4} className="w-full p-3 bg-gray-50 border rounded-md" value={equipData.description || ''} onChange={e => setEquipData({...equipData, description: e.target.value})} placeholder="Genel Açıklama" />
        </div>

        {/* TEKNİK DETAYLAR */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-900 border-b pb-2">Teknik Detaylar & Tavsiyeler</h2>
          <textarea rows={4} className="w-full p-3 bg-gray-50 border rounded-md" value={equipData.technical_details || ''} onChange={e => setEquipData({...equipData, technical_details: e.target.value})} placeholder="Teknik özellikler, atar, boy vb." />
          <textarea rows={3} className="w-full p-3 bg-gray-50 border rounded-md" value={equipData.tips || ''} onChange={e => setEquipData({...equipData, tips: e.target.value})} placeholder="Editör notu / Kısa tavsiye" />
        </div>

        {/* YAYIN DURUMU */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <span className="font-bold text-gray-700">Yayında mı?</span>
          <input type="checkbox" checked={equipData.is_published} onChange={e => setEquipData({...equipData, is_published: e.target.checked})} className="w-6 h-6 accent-blue-600" />
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-4 md:static md:bg-transparent md:border-0 md:p-0 z-20">
          <button type="submit" disabled={saving} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg">
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>

      </form>
    </main>
  );
}
