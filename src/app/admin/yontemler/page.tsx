import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';

export default async function YontemlerDashboard() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/admin/login');

  // Balıkçılık yöntemlerini çekiyoruz
  const { data: methods } = await supabase
    .from('fishing_methods')
    .select('id, title, is_published, slug')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <AdminNavbar />

      <div className="p-4 md:p-8 max-w-md mx-auto md:max-w-4xl mt-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Balıkçılık Çeşitleri</h2>
          <Link 
            href="/admin/yontemler/ekle" 
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-md font-medium text-sm shadow-sm transition-colors"
          >
            + Yeni Yöntem Ekle
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-100 overflow-hidden">
          {methods?.map(method => (
            <div key={method.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <h3 className="font-bold text-gray-900 text-base">{method.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">/{method.slug}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded font-bold ${
                  method.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {method.is_published ? 'Yayında' : 'Taslak'}
                </span>
                <Link href={`/admin/yontemler/duzenle/${method.id}`} className="text-blue-600 text-sm font-medium px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md">
                  Düzenle
                </Link>
              </div>
            </div>
          ))}

          {(!methods || methods.length === 0) && (
            <div className="p-8 text-center text-gray-500 text-sm">
              Henüz balıkçılık yöntemi eklenmemiş. "Yeni Yöntem Ekle" butonu ile başlayabilirsiniz.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
