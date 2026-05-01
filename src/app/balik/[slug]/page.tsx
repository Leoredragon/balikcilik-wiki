import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

const SectionCard = ({ icon, title, color = 'blue', children }: any) => (
  <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <div className={`px-5 py-4 border-b border-gray-100 flex items-center gap-2 bg-${color}-50/50`}>
      <span className="text-xl">{icon}</span>
      <h2 className="text-base font-bold text-gray-900">{title}</h2>
    </div>
    <div className="p-5">{children}</div>
  </section>
);

export default async function BalikDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: fish } = await supabase
    .from('fish')
    .select('*, categories(id, name_tr, slug)')
    .eq('slug', slug)
    .single();

  if (!fish) notFound();

  const { data: yields } = await supabase
    .from('monthly_yield').select('*').eq('fish_id', fish.id).order('month');

  const { data: bans } = await supabase
    .from('ban_periods').select('*').eq('fish_id', fish.id);

  const hasYield = yields?.some((y: any) => y.yield_score > 0);

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-md mx-auto md:max-w-4xl p-4 md:p-8 mt-4 space-y-5">

        {/* KAPAK + BAŞLIK */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="h-56 md:h-80 bg-gradient-to-br from-blue-50 to-gray-100 relative">
            {fish.cover_image_url
              ? <img src={fish.cover_image_url} alt={fish.name_tr} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                  <svg className="w-16 h-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-sm italic text-gray-400">Görsel Yakında Eklenecek</span>
                </div>
            }
          </div>
          <div className="p-5 md:p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {fish.categories && (
                <Link href={`/kategori/${fish.categories.slug}`}>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full hover:bg-blue-100 transition-colors cursor-pointer">{fish.categories.name_tr}</span>
                </Link>
              )}
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${fish.water_type === 'fresh' ? 'bg-cyan-50 text-cyan-700' : fish.water_type === 'salt' ? 'bg-blue-50 text-blue-700' : 'bg-teal-50 text-teal-700'}`}>
                {fish.water_type === 'fresh' ? '🏞️ Tatlı Su' : fish.water_type === 'salt' ? '🌊 Tuzlu Su' : '🌊🏞️ Her İkisi'}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">{fish.name_tr}</h1>
            {fish.name_latin && <p className="text-gray-400 italic mt-1 text-sm">{fish.name_latin}</p>}

            {/* HIZLI BİLGİ ŞERİDİ */}
            {(fish.min_size_cm || fish.max_size_cm || fish.avg_weight_kg) && (
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
                {fish.min_size_cm > 0 && (
                  <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg text-xs font-bold">
                    📏 Yasal Min: {fish.min_size_cm} cm
                  </div>
                )}
                {fish.max_size_cm && (
                  <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold">
                    📐 Maks. Boy: {fish.max_size_cm} cm
                  </div>
                )}
                {fish.avg_weight_kg && (
                  <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold">
                    ⚖️ Ort. Ağırlık: {fish.avg_weight_kg} kg
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* 12 AYLIK GRAFİK */}
        {hasYield && (
          <section className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-base font-bold mb-5 flex items-center gap-2 text-gray-900">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              12 Aylık Av Verimi
            </h2>
            <div className="flex gap-1 md:gap-1.5">
              {MONTHS.map((m, i) => {
                const y = yields?.find((yy: any) => yy.month === i + 1)?.yield_score || 0;
                const px = Math.max(Math.round(y * 1.2), y > 0 ? 3 : 0);
                const col = y >= 75 ? 'bg-green-500' : y >= 40 ? 'bg-blue-400' : y > 0 ? 'bg-slate-300' : 'bg-gray-100';
                return (
                  <div key={m} className="flex-1 flex flex-col items-center gap-1.5 group cursor-default">
                    <div className="w-full flex items-end rounded-sm bg-gray-50 border border-gray-100" style={{ height: '100px' }}>
                      <div className={`w-full rounded-t-sm ${col} transition-all duration-700 relative`} style={{ height: `${px}px` }}>
                        {y > 0 && <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] font-bold rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">%{y}</div>}
                      </div>
                    </div>
                    <span className="text-[9px] md:text-[10px] font-bold text-gray-500">{m}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-50 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-500 inline-block" /> Yüksek (%75+)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-400 inline-block" /> Orta (%40+)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-slate-300 inline-block" /> Düşük</span>
            </div>
          </section>
        )}

        {/* ANA İÇERİK + YAN PANEL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-5">
            {fish.habitat && (
              <SectionCard icon="🗺️" title="Habitat (Nerede Yaşar?)">
                <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap">{fish.habitat}</p>
              </SectionCard>
            )}
            {fish.description && (
              <SectionCard icon="📖" title="Genel Bilgiler (Beslenme, Üreme, Davranış)">
                <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap">{fish.description}</p>
              </SectionCard>
            )}
            {fish.fishing_tactics && (
              <SectionCard icon="🎣" title="Avlanma Taktikleri (Mevsim, Saat, Teknik)">
                <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap">{fish.fishing_tactics}</p>
              </SectionCard>
            )}
            {fish.recommended_baits && (
              <SectionCard icon="🪱" title="Önerilen Yemler (Doğal & Yapay)">
                <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap">{fish.recommended_baits}</p>
                {fish.bait_info && <p className="text-gray-600 text-sm mt-2 pt-2 border-t border-gray-100 whitespace-pre-wrap">{fish.bait_info}</p>}
              </SectionCard>
            )}
            {fish.meat_quality && (
              <SectionCard icon="🍽️" title="Et Kalitesi & Pişirme Önerisi">
                <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap">{fish.meat_quality}</p>
              </SectionCard>
            )}
          </div>

          <aside className="space-y-5">
            {bans && bans.length > 0 && (
              <div className="bg-red-50 p-5 rounded-2xl border border-red-100 shadow-sm">
                <h3 className="font-bold text-red-800 text-base mb-3 flex items-center gap-2">
                  ⛔ Av Yasakları
                </h3>
                <ul className="space-y-2">
                  {bans.map((ban: any, i: number) => (
                    <li key={i} className="text-sm text-red-700 bg-white p-3 rounded-lg border border-red-100">
                      <strong className="block">{MONTHS[ban.start_month - 1]} – {MONTHS[ban.end_month - 1]}</strong>
                      <span className="text-xs text-red-500">{ban.region || 'Tüm Bölgeler'}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {fish.fishing_tips && (
              <div className="bg-blue-600 p-5 rounded-2xl text-white shadow-lg">
                <h3 className="font-bold text-base mb-2">💡 Avlanma İpuçları</h3>
                <p className="text-blue-100 text-sm leading-relaxed">{fish.fishing_tips}</p>
              </div>
            )}

            {fish.categories && (
              <Link href={`/kategori/${fish.categories.slug}`}>
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Familya</p>
                  <p className="font-bold text-gray-900 group-hover:text-blue-600">{fish.categories.name_tr}</p>
                  <p className="text-xs text-blue-500 mt-1">Tüm türleri gör →</p>
                </div>
              </Link>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}