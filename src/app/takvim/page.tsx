import Link from 'next/link';

const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

const FRESH_CALENDAR = [
  { fish: 'Sazan', months: [0,0,1,2,3,2,1,1,2,3,2,0], color: '#f59e0b' },
  { fish: 'Yayın', months: [0,0,0,1,3,3,3,2,2,1,0,0], color: '#ef4444' },
  { fish: 'Sudak', months: [1,1,2,3,2,1,1,1,2,3,2,1], color: '#8b5cf6' },
  { fish: 'Turna', months: [0,0,1,2,2,1,1,2,3,3,2,1], color: '#06b6d4' },
  { fish: 'Alabalık', months: [1,2,3,3,2,1,0,0,1,2,3,2], color: '#10b981' },
  { fish: 'Kızılgöz', months: [0,0,1,2,3,3,2,2,3,2,1,0], color: '#f97316' },
];

const SALT_CALENDAR = [
  { fish: 'Levrek', months: [2,2,3,3,2,2,1,1,2,3,3,2], color: '#3b82f6' },
  { fish: 'Lüfer', months: [0,0,0,0,1,1,1,2,3,3,2,1], color: '#6366f1' },
  { fish: 'Palamut', months: [0,0,0,0,0,0,1,2,3,3,1,0], color: '#ef4444' },
  { fish: 'Çipura', months: [1,1,2,2,2,1,1,1,2,3,3,2], color: '#f59e0b' },
  { fish: 'İstavrit', months: [1,1,2,2,3,3,3,3,3,2,2,1], color: '#10b981' },
  { fish: 'Hamsi', months: [2,1,0,0,0,0,0,0,0,1,3,3], color: '#06b6d4' },
];

const COLORS = ['bg-gray-100', 'bg-blue-100', 'bg-blue-300', 'bg-blue-600'];
const LABELS = ['Pasif', 'Düşük', 'Orta', 'Yüksek'];

const CalendarTable = ({ data }: { data: typeof FRESH_CALENDAR }) => (
  <div className="overflow-x-auto -mx-4 md:mx-0">
    <table className="min-w-full text-xs">
      <thead>
        <tr>
          <th className="text-left p-2 pl-4 md:pl-2 font-bold text-gray-700 bg-gray-50 sticky left-0 z-10 min-w-24">Balık</th>
          {MONTHS.map(m => <th key={m} className="p-2 font-bold text-gray-500 bg-gray-50 text-center min-w-10">{m}</th>)}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {data.map(row => (
          <tr key={row.fish} className="hover:bg-gray-50/50">
            <td className="p-2 pl-4 md:pl-2 font-bold text-gray-800 sticky left-0 bg-white border-r border-gray-100">{row.fish}</td>
            {row.months.map((level, i) => (
              <td key={i} className="p-1 text-center">
                <div className={`mx-auto w-7 h-5 rounded ${COLORS[level]} transition-all`}
                  title={`${row.fish} - ${MONTHS[i]}: ${LABELS[level]}`} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function TakvimPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-md mx-auto md:max-w-5xl p-4 md:p-8 mt-4 space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Mevsimsel Av Takvimi</h1>
          <p className="text-gray-500 text-sm mt-1">Hangi ay hangi balık nerelerde aktiftir?</p>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {COLORS.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className={`w-6 h-4 rounded ${c} border border-gray-200 inline-block`} />
                <span className="font-medium text-gray-600">{LABELS[i]}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Tatlı Su */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-2 bg-cyan-50/50">
            <span className="text-xl">🏞️</span>
            <h2 className="font-bold text-gray-900">Tatlı Su Balıkları</h2>
          </div>
          <div className="p-4">
            <CalendarTable data={FRESH_CALENDAR} />
          </div>
        </div>

        {/* Tuzlu Su */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-2 bg-blue-50/50">
            <span className="text-xl">🌊</span>
            <h2 className="font-bold text-gray-900">Tuzlu Su Balıkları</h2>
          </div>
          <div className="p-4">
            <CalendarTable data={SALT_CALENDAR} />
          </div>
        </div>

        {/* Önemli Dönemler */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">📌 Önemli Av Dönemleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <h3 className="font-bold text-red-800 mb-2">⛔ Genel Av Yasakları</h3>
              <ul className="text-red-700 space-y-1 text-xs">
                <li>• Tatlı su: Nisan–Haziran (üreme dönemi)</li>
                <li>• Hamsi: Nisan–Ekim</li>
                <li>• Orfoz & Granyöz: Tüm yıl boyunca yasak</li>
                <li>• Kalkan: Bölgeye göre değişir</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <h3 className="font-bold text-green-800 mb-2">✅ En İyi Sezonlar</h3>
              <ul className="text-green-700 space-y-1 text-xs">
                <li>• Lüfer Göçü: Ekim–Kasım (Karadeniz→Ege)</li>
                <li>• Palamut Sezonu: Ağustos–Ekim</li>
                <li>• Hamsi Sezonu: Kasım–Mart</li>
                <li>• Alabalık: Nisan–Eylül (dere ve göller)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
