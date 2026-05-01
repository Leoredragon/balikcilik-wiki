import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export default async function YontemDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: method, error } = await supabase
    .from('fishing_methods')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !method || !method.is_published) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-md mx-auto md:max-w-4xl p-4 md:p-8 mt-4 space-y-8">
        
        {/* BAŞLIK */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center md:text-left">
          <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">Rehber / Disiplin</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{method.title}</h1>
        </section>

        {/* GENEL ANLATIM */}
        {method.content && (
          <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Nasıl Yapılır?</h2>
            <div className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
              {method.content}
            </div>
          </section>
        )}

        {/* EKİPMANLAR & BALIKLAR (Yan Yana Kartlar) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {method.gear_requirements && (
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🎣</span>
                <h3 className="font-bold text-blue-900">Tavsiye Edilen Ekipman</h3>
              </div>
              <div className="text-blue-800 text-sm leading-relaxed whitespace-pre-wrap">
                {method.gear_requirements}
              </div>
            </div>
          )}

          {method.target_fishes && (
            <div className="bg-green-50 p-6 rounded-lg border border-green-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🐟</span>
                <h3 className="font-bold text-green-900">Hedeflenen Balıklar</h3>
              </div>
              <div className="text-green-800 text-sm leading-relaxed whitespace-pre-wrap">
                {method.target_fishes}
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
