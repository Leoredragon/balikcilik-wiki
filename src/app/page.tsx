import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import SearchAutocomplete from '@/components/SearchAutocomplete';

export const revalidate = 60;

// Mevcut ay için aktif balıklar (mevsimsel verim)
const CURRENT_MONTH = new Date().getMonth() + 1; // 1-12

const SEASON_NAME = () => {
  const m = CURRENT_MONTH;
  if ([12, 1, 2].includes(m)) return 'Kış';
  if ([3, 4, 5].includes(m)) return 'İlkbahar';
  if ([6, 7, 8].includes(m)) return 'Yaz';
  return 'Sonbahar';
};

const QUICK_LINKS = [
  { label: 'Av Takvimi', href: '/takvim', desc: 'Aylık verim tablosu' },
  { label: 'Avlak Noktaları', href: '/avlak', desc: 'Türkiye haritası' },
  { label: 'Yasal Düzenlemeler', href: '/yasal', desc: 'Boy limitleri & yasaklar' },
  { label: 'Hava Durumu', href: '/hava', desc: 'Anlık koşullar' },
  { label: 'Yem Tarifleri', href: '/yem-tarifleri', desc: 'Doğal & yapay yemler' },
  { label: 'Başlangıç Rehberi', href: '/baslangic', desc: 'İlk ava çıkmadan önce' },
];

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Mevsimsel öne çıkanlar — bu ayki verimi yüksek balıklar
  const { data: seasonalYields } = await supabase
    .from('monthly_yield')
    .select('fish_id, yield_score')
    .eq('month', CURRENT_MONTH)
    .gte('yield_score', 60)
    .order('yield_score', { ascending: false })
    .limit(8);

  const seasonalFishIds = seasonalYields?.map(y => y.fish_id) || [];

  const { data: seasonalFish } = seasonalFishIds.length > 0
    ? await supabase
        .from('fish')
        .select('id, slug, name_tr, name_latin, water_type, cover_image_url, categories(name_tr)')
        .eq('is_published', true)
        .in('id', seasonalFishIds)
    : { data: [] };

  // Mevsimsel verim skorlarını birleştir
  const fishWithScore = (seasonalFish || []).map(f => ({
    ...f,
    score: seasonalYields?.find(y => y.fish_id === f.id)?.yield_score || 0,
  })).sort((a, b) => b.score - a.score);

  // Son eklenen türler (mevsimsel yoksa burası gösterilir)
  const { data: recentFish } = await supabase
    .from('fish')
    .select('id, slug, name_tr, name_latin, water_type, cover_image_url, categories(name_tr)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(6);

  // Kategoriler
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name_tr, slug')
    .is('parent_id', null)
    .order('name_tr')
    .limit(8);

  // Yöntemler
  const { data: methods } = await supabase
    .from('fishing_methods')
    .select('id, slug, title')
    .eq('is_published', true)
    .order('title')
    .limit(6);

  const displayFish = fishWithScore.length > 0 ? fishWithScore : (recentFish || []).map(f => ({ ...f, score: 0 }));
  const isSeasonalDisplay = fishWithScore.length > 0;

  return (
    <main className="min-h-screen bg-[#f8f9fb]">

      {/* HERO */}
      <section className="relative bg-[#0d1b2a] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1b2a] via-[#1a2f45] to-[#0d1b2a] opacity-100" />
        {/* Dekoratif dalgalar */}
        <div className="absolute bottom-0 left-0 right-0 h-12 md:h-16">
          <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M0 32C240 0 480 64 720 32C960 0 1200 64 1440 32V64H0V32Z" fill="#f8f9fb" />
          </svg>
        </div>

        <div className="relative max-w-md mx-auto md:max-w-5xl px-5 py-14 md:py-20 pb-20 md:pb-24">
          {/* Logo + Marka */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
            </div>
            <span className="font-playfair text-xl md:text-2xl font-bold tracking-wide text-white/90">Avlak</span>
          </div>

          <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-3 text-white">
            Türkiye'nin<br className="md:hidden" /> Balıkçılık<br className="md:hidden" /> Ansiklopedisi
          </h1>
          <p className="text-blue-200/80 text-sm md:text-base max-w-xl mb-8 leading-relaxed">
            Tatlı ve tuzlu su balık türleri, avlanma teknikleri, mevsimsel rehberler ve yasal düzenlemeler tek platformda.
          </p>

          <div className="max-w-lg">
            <SearchAutocomplete />
          </div>
        </div>
      </section>

      <div className="max-w-md mx-auto md:max-w-5xl px-4 py-8 md:py-12 space-y-12">

        {/* HIZLI ERİŞİM */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {QUICK_LINKS.map(l => (
              <Link key={l.href} href={l.href}>
                <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{l.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{l.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* MEVSİMSEL ÖNE ÇIKANLAR */}
        <section>
          <div className="flex items-baseline gap-3 mb-5">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-gray-900">
              {isSeasonalDisplay ? `${SEASON_NAME()} Sezonu` : 'Son Eklenen Türler'}
            </h2>
            {isSeasonalDisplay && (
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                Yüksek Verim
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {displayFish.slice(0, 6).map((fish: any) => (
              <Link href={`/balik/${fish.slug}`} key={fish.id}>
                <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all overflow-hidden group cursor-pointer">
                  <div className="h-36 md:h-44 bg-gray-50 relative overflow-hidden">
                    {fish.cover_image_url ? (
                      <img src={fish.cover_image_url} alt={fish.name_tr}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
                        <svg className="w-8 h-8 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" />
                        </svg>
                      </div>
                    )}
                    {fish.score >= 75 && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        Pik
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">
                      {(fish.categories as any)?.name_tr || '—'}
                    </p>
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">{fish.name_tr}</h3>
                    {fish.name_latin && (
                      <p className="text-[10px] text-gray-400 italic mt-0.5 line-clamp-1">{fish.name_latin}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-5">
            <Link href="/kategori/tum-baliklar">
              <span className="inline-block text-sm font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 rounded-full px-5 py-2.5 transition-all hover:bg-blue-50">
                Tum Balik Turlerini Goster
              </span>
            </Link>
          </div>
        </section>

        {/* BALIKÇILIK YÖNTEMLERİ */}
        {methods && methods.length > 0 && (
          <section>
            <div className="flex items-baseline gap-3 mb-5">
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-gray-900">Avlanma Yöntemleri</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {methods.map(m => (
                <Link href={`/yontem/${m.slug}`} key={m.id}>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all group">
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{m.title}</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">Teknik rehber</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* KATEGORİLER / FAMİLYALAR */}
        {categories && categories.length > 0 && (
          <section>
            <div className="flex items-baseline gap-3 mb-5">
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-gray-900">Balik Familyalari</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <Link key={cat.id} href={`/kategori/${cat.slug}`}>
                  <span className="inline-block bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-full hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all">
                    {cat.name_tr}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* HIZLI BİLGİ KARTLARI */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
          <Link href="/yasal">
            <div className="bg-[#0d1b2a] text-white rounded-2xl p-6 hover:shadow-xl transition-all">
              <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">Guncel Bilgi</p>
              <h3 className="font-playfair text-xl font-bold mb-1">Yasal Boy Limitleri</h3>
              <p className="text-gray-400 text-sm">Tum turlerin av limitleri ve yasaklari</p>
              <p className="text-blue-400 text-xs mt-4 font-semibold">Incele</p>
            </div>
          </Link>
          <Link href="/takvim">
            <div className="bg-blue-600 text-white rounded-2xl p-6 hover:shadow-xl transition-all">
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2">Mevsimsel Rehber</p>
              <h3 className="font-playfair text-xl font-bold mb-1">Av Takvimi</h3>
              <p className="text-blue-100 text-sm">Hangi ay hangi balik aktiftir?</p>
              <p className="text-blue-300 text-xs mt-4 font-semibold">Takvimi Goster</p>
            </div>
          </Link>
          <Link href="/baslangic">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-blue-200 transition-all">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Yeni Baslayanlar</p>
              <h3 className="font-playfair text-xl font-bold text-gray-900 mb-1">Baslangic Rehberi</h3>
              <p className="text-gray-500 text-sm">Ilk ekipmandan ilk ava</p>
              <p className="text-blue-600 text-xs mt-4 font-semibold">Okumaya Basla</p>
            </div>
          </Link>
        </section>

      </div>
    </main>
  );
}