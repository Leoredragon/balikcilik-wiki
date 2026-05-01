"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [fishes, setFishes] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      // Güvenlik: Oturum kontrolü
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        router.push('/admin/login');
        return;
      }

      // Veritabanındaki balıkları çekiyoruz
      const { data } = await supabase
        .from('fish')
        .select('id, name_tr, is_published, slug')
        .order('created_at', { ascending: false });
      
      setFishes(data || []);
      setLoading(false);
    }
    fetchData();
  }, [supabase, router]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" isimli balığı silmek istediğinize emin misiniz?`)) return;

    const { error } = await supabase.from('fish').delete().eq('id', id);
    
    if (error) {
      alert("Silme işlemi sırasında bir hata oluştu!");
    } else {
      setFishes(fishes.filter(f => f.id !== id));
    }
  };

  if (loading) return <div className="p-8 text-center font-medium">Yükleniyor...</div>;

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <AdminNavbar />

      <div className="p-4 md:p-8 max-w-md mx-auto md:max-w-4xl mt-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Balık Listesi</h2>
          <Link 
            href="/admin/ekle" 
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-md font-medium text-sm text-center shadow-sm transition-colors"
          >
            + Yeni Balık Ekle
          </Link>
        </div>

        {/* Balıklar Listesi */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-100 overflow-hidden">
          {fishes.map(fish => (
            <div key={fish.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <h3 className="font-bold text-gray-900 text-base">{fish.name_tr}</h3>
                <p className="text-xs text-gray-400 mt-0.5">/{fish.slug}</p>
              </div>
              
              <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4">
                <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded font-bold ${
                  fish.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {fish.is_published ? 'Yayında' : 'Taslak'}
                </span>
                
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/admin/duzenle/${fish.id}`} 
                    className="text-blue-600 text-sm font-medium px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    Düzenle
                  </Link>
                  <button 
                    onClick={() => handleDelete(fish.id, fish.name_tr)}
                    className="text-red-600 text-sm font-medium px-4 py-2 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}

          {fishes.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
              Henüz balık eklenmemiş. Yukarıdaki butonu kullanarak ilk balığı ekleyebilirsiniz.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
