import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function KategoriDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Kategoriyi Bul
  const { data: category, error: catError } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (catError || !category) notFound();

  // 2. Alt kategorileri var mı kontrol et (Örn: Tatlı Su tıklandıysa altındakileri de bulmalıyiz)
  const { data: subCats } = await supabase.from('categories').select('id').eq('parent_id', category.id);
  const targetCategoryIds = [category.id, ...(subCats?.map(c => c.id) || [])];

  // 3. Bu kategorilere ait balıkları çek
  const { data: fishes } = await supabase
    .from('fish')
    .select('id, slug, name_tr, name_latin, water_type, cover_image_url, categories(name_tr)')
    .in('category_id', targetCategoryIds)
    .eq('is_published', true)
    .order('name_tr');

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-md mx-auto md:max-w-4xl p-4 md:p-8 mt-4 space-y-8">
        
        {/* Kategori Başlığı */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center md:text-left">
          <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">Kategori</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name_tr}</h1>
          {category.description && (
            <p className="text-gray-500 text-sm">{category.description}</p>
          )}
        </section>

        {/* Balıklar Listesi */}
        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-2">
            <h2 className="text-xl font-bold text-gray-900">Bu Kategorideki Türler ({fishes?.length || 0})</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{fish.name_tr}</h3>
                    <p className="text-sm text-gray-500 italic mb-4">{fish.name_latin}</p>
                    
                    <div className="mt-auto pt-4 border-t border-gray-50">
                      <span className="bg-gray-100 text-gray-600 text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wide">
                        {fish.water_type === 'fresh' ? 'Tatlı Su' : fish.water_type === 'salt' ? 'Tuzlu Su' : 'Acı Su'}
                      </span>
                    </div>
                  </div>

                </div>
              </Link>
            ))}

            {(!fishes || fishes.length === 0) && (
              <div className="col-span-full p-8 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
                Bu kategoriye henüz balık eklenmemiş.
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
