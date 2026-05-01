export default function YasalPage() {
  const SIZE_LIMITS = [
    { fish: 'Levrek', size: '25-30 cm', note: 'Bölgeye göre değişir' },
    { fish: 'Çipura', size: '20-22 cm', note: '' },
    { fish: 'Lüfer', size: '25 cm', note: '' },
    { fish: 'Palamut', size: '25 cm', note: '' },
    { fish: 'Kefal', size: '20 cm', note: '' },
    { fish: 'Dil Balığı', size: '18 cm', note: '' },
    { fish: 'Kalkan', size: '45 cm', note: 'Karadeniz' },
    { fish: 'Sazan', size: '30 cm', note: '' },
    { fish: 'Sudak', size: '30 cm', note: '' },
    { fish: 'Yayın', size: '50 cm', note: '' },
    { fish: 'Turna', size: '30 cm', note: '' },
    { fish: 'Alabalık', size: '20 cm', note: '' },
    { fish: 'Tekir', size: '13 cm', note: '' },
    { fish: 'Barbun', size: '13 cm', note: '' },
    { fish: 'İstavrit', size: '13 cm', note: '' },
    { fish: 'Hamsi', size: '9 cm', note: '' },
  ];

  const PROTECTED = [
    { name: 'Orfoz (Epinephelus marginatus)', status: '🔴 Tamamen Yasak', detail: 'Yakalanması ve satışı yasaktır.' },
    { name: 'Granyöz (Epinephelus aeneus)', status: '🔴 Tamamen Yasak', detail: 'Yakalanması ve satışı yasaktır.' },
    { name: 'İstakoz (Homarus gammarus)', status: '🔴 Tamamen Yasak', detail: 'Ticari ve amatör avcılık yasaktır.' },
    { name: 'Kılıç Balığı (Xiphias gladius)', status: '🟡 Kota Var', detail: 'Yalnızca profesyonel balıkçılara kota ile izin verilir.' },
    { name: 'Orkinos (Thunnus thynnus)', status: '🟡 Kota Var', detail: 'Uluslararası kota sistemiyle yönetilir.' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-md mx-auto md:max-w-4xl p-4 md:p-8 mt-4 space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Yasal Düzenlemeler & Etik</h1>
          <p className="text-gray-500 text-sm mt-1">Güncel av yasal çerçevesi ve etik balıkçılık rehberi</p>
        </div>

        {/* BOY LİMİTLERİ */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-orange-50/50 flex items-center gap-2">
            <span className="text-xl">📏</span>
            <h2 className="font-bold text-gray-900">Yasal Boy Limitleri</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-bold text-gray-700">Balık Türü</th>
                  <th className="text-center p-3 font-bold text-gray-700">Min. Boy</th>
                  <th className="text-left p-3 font-bold text-gray-700">Not</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {SIZE_LIMITS.map(r => (
                  <tr key={r.fish} className="hover:bg-gray-50/50">
                    <td className="p-3 font-medium text-gray-900">{r.fish}</td>
                    <td className="p-3 text-center font-bold text-orange-600">{r.size}</td>
                    <td className="p-3 text-gray-500 text-xs">{r.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AV YASAKLARI */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-red-50/50 flex items-center gap-2">
            <span className="text-xl">⛔</span>
            <h2 className="font-bold text-gray-900">Av Yasakları & Üreme Dönemleri</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <h3 className="font-bold text-red-800 mb-2">Tatlı Su Yasakları</h3>
                <p className="text-red-700 text-sm">Genel av yasağı: <strong>Nisan – Haziran</strong></p>
                <p className="text-red-600 text-xs mt-1">Balıkların üreme dönemi nedeniyle tüm iç sularda avcılık yasaktır.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h3 className="font-bold text-blue-800 mb-2">Tuzlu Su Yasakları</h3>
                <p className="text-blue-700 text-sm">Hamsi: <strong>Nisan – Ekim</strong></p>
                <p className="text-blue-600 text-xs mt-1">Kalkan (Karadeniz): Bölgesel yasaklar uygulanır. Detaylar için il müdürlüklerine danışın.</p>
              </div>
            </div>
          </div>
        </div>

        {/* KORUMA ALTINDAKI TÜRLER */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-rose-50/50 flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <h2 className="font-bold text-gray-900">Nesli Tehlikedeki & Korunan Türler</h2>
          </div>
          <div className="p-5 space-y-3">
            {PROTECTED.map(p => (
              <div key={p.name} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{p.detail}</p>
                </div>
                <span className="text-xs font-bold whitespace-nowrap">{p.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RUHSAT & YAKALA BIRAK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">📄 Ruhsat & İzin</h2>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold">→</span>Amatör balıkçılık ruhsatı e-Devlet üzerinden alınır</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold">→</span>Yıllık ücret semboliktir, çevrimiçi ödeme yapılır</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold">→</span>Bazı özel göller için belediye izni aranır</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold">→</span>Milli Park alanlarında ek izin gereklidir</li>
            </ul>
          </div>
          <div className="bg-green-600 rounded-2xl p-5 text-white shadow-lg">
            <h2 className="font-bold mb-3 flex items-center gap-2">🐟 Yakala-Bırak Rehberi</h2>
            <ul className="text-green-100 text-sm space-y-2">
              <li>• Balığı olabildiğince kısa süre sudan çıkarın</li>
              <li>• Islak el kullanın, kuru elle dokunmayın</li>
              <li>• İğneyi penset ile dikkatlice çıkarın</li>
              <li>• Solungaçlardan tutmayın, vücudunu destekleyin</li>
              <li>• Suya bırakmadan önce toparlanmasını bekleyin</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
