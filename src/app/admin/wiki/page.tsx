import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';

const WIKI_SECTIONS = [
  { section: 'avlak', title: 'Avlak Noktaları', icon: '🗺️', href: '/admin/wiki/avlak' },
  { section: 'takvim', title: 'Av Takvimi', icon: '📅', href: '/admin/wiki/takvim', note: 'Statik sayfa' },
  { section: 'yasal', title: 'Yasal Düzenlemeler', icon: '⚖️', href: '/admin/wiki/yasal', note: 'Statik sayfa' },
  { section: 'yem-tarifleri', title: 'Yem Tarifleri', icon: '🧪', href: '/admin/wiki/yem-tarifleri', note: 'Statik sayfa' },
  { section: 'hava', title: 'Hava & Su Durumu', icon: '🌤️', href: '/admin/wiki/hava', note: 'Statik sayfa' },
  { section: 'baslangic', title: 'Başlangıç Rehberi', icon: '🎣', href: '/admin/wiki/baslangic', note: 'Statik sayfa' },
];

export default function AdminWikiPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 mt-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Wiki Bölümleri</h2>
          <p className="text-gray-500 text-sm mt-1">Tüm içerik bölümlerini buradan yönetin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WIKI_SECTIONS.map(section => (
            <Link key={section.section} href={section.href}>
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{section.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{section.title}</p>
                      {section.note && <p className="text-xs text-gray-400">{section.note}</p>}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <h3 className="font-bold text-blue-800 mb-2">💡 Bilgi</h3>
          <p className="text-blue-700 text-sm">Takvim, Yasal, Yem Tarifleri, Hava Durumu ve Başlangıç Rehberi bölümleri statik içerikli sayfalardır. Sadece Avlak Noktaları veritabanından beslenir ve buradan eklenip düzenlenebilir.</p>
        </div>
      </div>
    </main>
  );
}
