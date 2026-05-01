"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';

export default function EquipmentsDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [equipments, setEquipments] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        router.push('/admin/login');
        return;
      }

      const { data } = await supabase
        .from('equipments')
        .select('id, title, is_published, slug, category_name')
        .order('created_at', { ascending: false });
      
      setEquipments(data || []);
      setLoading(false);
    }
    fetchData();
  }, [supabase, router]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" isimli ekipmanı silmek istediğinize emin misiniz?`)) return;

    const { error } = await supabase.from('equipments').delete().eq('id', id);
    
    if (error) {
      alert("Silme işlemi sırasında bir hata oluştu!");
    } else {
      setEquipments(equipments.filter(e => e.id !== id));
    }
  };

  if (loading) return <div className="p-8 text-center font-medium">Yükleniyor...</div>;

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <AdminNavbar />

      <div className="p-4 md:p-8 max-w-md mx-auto md:max-w-4xl mt-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Ekipman Listesi</h2>
          {/* Gelecekte ekleme sayfası yapılabilir, şimdilik manuel eklenmiş olabilir */}
          <div className="text-xs text-gray-500 italic">Yeni ekipman ekleme yakında...</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-100 overflow-hidden">
          {equipments.map(equip => (
            <div key={equip.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <h3 className="font-bold text-gray-900 text-base">{equip.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">/{equip.category_name} - /{equip.slug}</p>
              </div>
              
              <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4">
                <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded font-bold ${
                  equip.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {equip.is_published ? 'Yayında' : 'Taslak'}
                </span>
                
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/admin/ekipmanlar/duzenle/${equip.id}`} 
                    className="text-blue-600 text-sm font-medium px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    Düzenle
                  </Link>
                  <button 
                    onClick={() => handleDelete(equip.id, equip.title)}
                    className="text-red-600 text-sm font-medium px-4 py-2 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}

          {equipments.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
              Henüz ekipman eklenmemiş.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
