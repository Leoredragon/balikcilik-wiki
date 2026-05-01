import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

export default async function BalikDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Balık ve bağlı olduğu kategori bilgisi
  const { data: fish } = await supabase
    .from('fish')
    .select('*, categories(name_tr)')
    .eq('slug', slug)
    .single();

  if (!fish) notFound();

  // 12 Aylık Verim verileri
  const { data: yields } = await supabase
    .from('monthly_yield')
    .select('*')
    .eq('fish_id', fish.id)
    .order('month');

  // Av Yasakları
  const { data: bans } = await supabase
    .from('ban_periods')
    .select('*')
    .eq('fish_id', fish.id);

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-md mx-auto md:max-w-4xl p-4 md:p-8 mt-4 space-y-6">
        
        {/* KAPAK FOTOĞRAFI VE BAŞLIK */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="h-56 md:h-96 bg-gray-100 relative">
            {fish.cover_image_url ? (
              <img src={fish.cover_image_url} alt={fish.name_tr} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                <svg className="w-16 h-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="text-sm font-medium italic">Görsel Yakında Eklenecek</span>
              </div>
            )}
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-xs font-bold text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded">
                {fish.categories?.name_tr || 'Kategori Yok'}
              </span>
              <span className="text-xs font-bold text-gray-600 uppercase bg-gray-100 px-2 py-1 rounded">
                {fish.water_type === 'fresh' ? 'Tatlı Su' : fish.water_type === 'salt' ? 'Tuzlu Su' : 'Acı Su'}
              </span>
              {fish.min_size_cm && (
                <span className="text-xs font-bold text-orange-600 uppercase bg-orange-50 px-2 py-1 rounded">
                  Min. {fish.min_size_cm} cm
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">{fish.name_tr}</h1>
            {fish.name_latin && <p className="text-gray-500 italic mt-1">{fish.name_latin}</p>}
          </div>
        </section>

        {/* 12 AYLIK VERİM GRAFİĞİ */}
        {yields && yields.length > 0 && (
          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              12 Aylık Av Verimi Grafiği
            </h2>
            <div className="flex items-end justify-between h-40 gap-1 md:gap-2">
              {MONTHS.map((m, i) => {
                const y = yields?.find((y: any) => y.month === i + 1)?.yield_score || 0;
                return (
                  <div key={m} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-gray-50 rounded-t-md relative flex items-end h-full overflow-hidden border border-gray-100">
                      <div 
                        className={`w-full rounded-t-md transition-all duration-500 ${y > 75 ? 'bg-green-500' : y > 40 ? 'bg-blue-400' : y > 0 ? 'bg-gray-300' : 'bg-gray-100'}`} 
                        style={{ height: `${Math.max(y, 2)}%` }}
                      ></div>
                      {/* Hover çıkan yüzde değeri */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold text-white text-[10px] drop-shadow-md">
                        %{y}
                      </div>
                    </div>
                    <span className="text-[10px] md:text-xs font-bold text-gray-500">{m}</span>
                  </div>
                );
              })}
            </div>
            {/* Grafik Açıklaması */}
            <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-500 inline-block"></span> Yüksek (%75+)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-400 inline-block"></span> Orta (%40+)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-gray-300 inline-block"></span> Düşük</span>
            </div>
          </section>
        )}

        {/* GENEL BİLGİLER VE YASAKLAR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {fish.description && (
              <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Ansiklopedik Bilgi</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{fish.description}</p>
              </section>
            )}

            {fish.bait_info && (
              <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                  Yem Bilgisi
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{fish.bait_info}</p>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            {bans && bans.length > 0 && (
              <div className="bg-red-50 p-5 rounded-2xl border border-red-100 shadow-sm">
                <h3 className="font-bold text-red-800 text-lg mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  Av Yasakları
                </h3>
                <ul className="space-y-3">
                  {bans.map((ban: any, i: number) => (
                    <li key={i} className="text-sm text-red-700 bg-white p-3 rounded-lg border border-red-100">
                      <strong>{MONTHS[ban.start_month - 1]} – {MONTHS[ban.end_month - 1]}</strong> arası
                      <span className="text-xs text-red-500 block mt-0.5">{ban.region || 'Tüm Bölgeler'}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {fish.fishing_tips && (
              <div className="bg-blue-600 p-5 rounded-2xl text-white shadow-lg">
                <h3 className="font-bold text-lg mb-2">💡 Avlanma İpuçları</h3>
                <p className="text-blue-100 text-sm leading-relaxed">{fish.fishing_tips}</p>
              </div>
            )}

            {!fish.fishing_tips && (!bans || bans.length === 0) && (
              <div className="bg-blue-600 p-5 rounded-2xl text-white shadow-lg">
                <h3 className="font-bold text-lg mb-2">💡 Avlanma İpuçları</h3>
                <p className="text-blue-100 text-sm leading-relaxed">Bu balığı avlamak için ipuçları admin tarafından eklenecektir.</p>
              </div>
            )}
          </aside>
        </div>

      </div>
    </main>
  );
}