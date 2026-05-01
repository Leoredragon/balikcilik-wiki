import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export default async function YontemDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: method } = await supabase
    .from('fishing_methods')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!method || !method.is_published) notFound();

  const InfoCard = ({ icon, title, content, colorClass = 'border-gray-200 bg-white' }: any) =>
    content ? (
      <section className={`p-5 rounded-2xl border shadow-sm ${colorClass}`}>
        <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-base">
          <span>{icon}</span>{title}
        </h2>
        <div className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap">{content}</div>
      </section>
    ) : null;

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-md mx-auto md:max-w-4xl p-4 md:p-8 mt-4 space-y-5">

        {/* KAPAK + BAŞLIK */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {method.cover_image_url && (
            <div className="h-48 md:h-64 overflow-hidden">
              <img src={method.cover_image_url} alt={method.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-5 md:p-6">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Balıkçılık Rehberi</div>
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">{method.title}</h1>
          </div>
        </section>

        {/* 6 ALAN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-5">
            <InfoCard icon="📖" title="Genel Anlatım ve Teknikler" content={method.content} />
            <InfoCard icon="👣" title="Adım Adım Uygulama" content={method.step_by_step} colorClass="border-blue-100 bg-blue-50/40" />
            <InfoCard icon="⚠️" title="Yapılan Hatalar ve Çözümleri" content={method.common_mistakes} colorClass="border-amber-100 bg-amber-50/40" />
          </div>

          <aside className="space-y-5">
            {method.target_fishes || method.suitable_fish ? (
              <div className="bg-green-50 p-5 rounded-2xl border border-green-100 shadow-sm">
                <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2 text-base">
                  🐟 Uygun Balık Türleri
                </h3>
                <div className="text-green-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {method.suitable_fish || method.target_fishes}
                </div>
              </div>
            ) : null}

            {method.best_season ? (
              <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 shadow-sm">
                <h3 className="font-bold text-orange-900 mb-3 text-base">🌤️ En İyi Mevsim / Ay / Saat</h3>
                <div className="text-orange-800 text-sm leading-relaxed whitespace-pre-wrap">{method.best_season}</div>
              </div>
            ) : null}

            {method.gear_requirements ? (
              <div className="bg-blue-600 p-5 rounded-2xl text-white shadow-lg">
                <h3 className="font-bold text-base mb-2">🎣 Gerekli Ekipman</h3>
                <div className="text-blue-100 text-sm leading-relaxed whitespace-pre-wrap">{method.gear_requirements}</div>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  );
}
