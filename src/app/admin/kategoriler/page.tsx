import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';

export default async function KategorilerDashboard() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/admin/login');

  // Kategorileri (varsa bağlı olduğu üst kategoriyle birlikte) çekiyoruz
  const { data: categories } = await supabase
    .from('categories')
    .select('*, parent:parent_id(name_tr)')
    .order('name_tr', { ascending: true });

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <AdminNavbar />

      <div className="p-4 md:p-8 max-w-md mx-auto md:max-w-4xl mt-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Kategori Yönetimi</h2>
          <Link 
            href="/admin/kategoriler/ekle" 
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-md font-medium text-sm shadow-sm transition-colors"
          >
            + Yeni Kategori
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-100 overflow-hidden">
          {categories?.map(cat => (
            <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  {cat.name_tr}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">/{cat.slug}</p>
              </div>
              
              <div className="flex items-center gap-3">
                {cat.parent && (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded font-bold bg-gray-100 text-gray-600 hidden md:inline-block">
                    Üst: {cat.parent.name_tr}
                  </span>
                )}
                {/* Şimdilik düzenle butonunu pasif yapıyoruz, eklemeyi test edeceğiz */}
                <span className="text-gray-400 text-sm font-medium px-4 py-2 bg-gray-50 rounded-md">
                  Ayarlar
                </span>
              </div>
            </div>
          ))}

          {(!categories || categories.length === 0) && (
            <div className="p-8 text-center text-gray-500 text-sm">
              Henüz kategori eklenmemiş.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
