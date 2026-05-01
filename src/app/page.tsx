import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import SearchAutocomplete from '@/components/SearchAutocomplete';

export const revalidate = 60;

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Ana Kategorileri Çek (parent_id'si null olanlar)
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name_tr, slug, description')
    .is('parent_id', null)
    .order('name_tr');

  // 2. Son Eklenen Balıkları Çek (Öne Çıkanlar için)
  const { data: fishes } = await supabase
    .from('fish')
    .select('id, slug, name_tr, name_latin, water_type, cover_image_url, categories(name_tr)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(6);

  // 3. Balıkçılık Yöntemlerini Çek
  const { data: methods } = await supabase
    .from('fishing_methods')
    .select('id, slug, title, content')
    .eq('is_published', true)
    .order('title');

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO BÖLÜMÜ (Karşılama Ekranı) */}
      <section className="bg-slate-900 text-white py-12 md:py-20 px-4">
        <div className="max-w-md mx-auto md:max-w-5xl text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Türkiye'nin Balıkçılık Ansiklopedisi
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mb-8">
            Tatlı ve tuzlu su balıkları, avlanma teknikleri, yasal limitler ve verim grafikleri ile donatılmış kapsamlı rehberiniz.
          </p>
          <SearchAutocomplete />
        </div>
      </section>

      <div className="max-w-md mx-auto md:max-w-5xl px-4 py-12 space-y-16">
        
        {/* KATEGORİLER BÖLÜMÜ */}
        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <h2 className="text-2xl font-bold text-gray-900">Kategoriler</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories?.map(cat => (
              <Link href={`/kategori/${cat.slug}`} key={cat.id}>
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer h-full">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{cat.name_tr}</h3>
                  {cat.description && <p className="text-sm text-gray-500 line-clamp-2">{cat.description}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* BALIKÇILIK ÇEŞİTLERİ (DİSİPLİNLER) */}
        {methods && methods.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <h2 className="text-2xl font-bold text-gray-900">Balıkçılık Çeşitleri</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {methods.map(method => (
                <Link href={`/yontem/${method.slug}`} key={method.id}>
                  <div className="bg-blue-50 hover:bg-blue-100 p-5 rounded-lg border border-blue-100 transition-colors h-full flex flex-col justify-center items-center text-center">
                    <h3 className="font-bold text-blue-900">{method.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ÖNE ÇIKAN BALIKLAR */}
        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h2 className="text-2xl font-bold text-gray-900">Son Eklenen Türler</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {fishes?.map((fish: any) => (
              <Link href={`/balik/${fish.slug}`} key={fish.id}>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full flex flex-col overflow-hidden group">
                  
                  {/* FOTOĞRAF ALANI */}
                  <div className="h-48 bg-gray-50 relative border-b border-gray-100 overflow-hidden">
                    {fish.cover_image_url ? (
                      <img 
                        src={fish.cover_image_url} 
                        alt={fish.name_tr} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                  </div>

                  {/* METİN ALANI */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1.5">
                      {fish.categories?.name_tr || 'Genel'}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">{fish.name_tr}</h3>
                    <p className="text-sm text-gray-500 italic mb-4">{fish.name_latin}</p>
                    
                    <div className="flex gap-2 mt-auto pt-4 border-t border-gray-50">
                      <span className="bg-gray-100 text-gray-600 text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wide">
                        {fish.water_type === 'fresh' ? 'Tatlı Su' : fish.water_type === 'salt' ? 'Tuzlu Su' : 'Tatlı & Tuzlu Su'}
                      </span>
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}