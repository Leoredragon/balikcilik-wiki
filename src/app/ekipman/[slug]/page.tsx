import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export default async function EkipmanDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: equip } = await supabase
    .from('equipments')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!equip) notFound();

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-md mx-auto md:max-w-4xl p-4 md:p-8 mt-4 space-y-6">
        
        {/* KAPAK FOTOĞRAFI VE BAŞLIK */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="h-48 md:h-80 bg-gray-100 relative">
            {equip.cover_image_url ? (
              <img src={equip.cover_image_url} alt={equip.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                <svg className="w-16 h-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="text-sm font-medium italic">Görsel Yakında Eklenecek</span>
              </div>
            )}
          </div>
          <div className="p-6">
            <div className="text-xs font-bold text-blue-600 uppercase mb-1">{equip.category_name}</div>
            <h1 className="text-3xl font-extrabold text-gray-900">{equip.title}</h1>
          </div>
        </section>

        {/* İÇERİK BÖLÜMLERİ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Genel Bilgi
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{equip.description || 'İçerik hazırlanıyor...'}</p>
            </section>

            <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-orange-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                Teknik Detaylar & Tavsiyeler
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{equip.technical_details || 'Boy, atar ve aksiyon bilgileri yakında eklenecek.'}</p>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg">
              <h3 className="font-bold text-lg mb-2">💡 Editör Notu</h3>
              <p className="text-blue-100 text-sm leading-relaxed">{equip.tips || 'Bu ekipmanı seçerken nelere dikkat etmeniz gerektiği burada görünecek.'}</p>
            </div>
          </aside>
        </div>

      </div>
    </main>
  );
}
