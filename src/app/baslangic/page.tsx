import Link from 'next/link';

const STARTER_KITS = [
  {
    budget: '500-1000 ₺',
    label: 'Ekonomik Başlangıç',
    color: 'bg-green-50 border-green-200',
    items: [
      '2.7m orta sertlik tel kılavuzlu kamış (Olta seti olarak satılır)',
      '2000-3000 beden makine',
      '0.20 mm 100m misina',
      'Karışık iğne seti (No.4-10)',
      '10-30g kurşun seti',
      'Ekmek ve mısır yemi (başlangıç için yeterli)',
    ]
  },
  {
    budget: '2000-4000 ₺',
    label: 'Orta Seviye Paket',
    color: 'bg-blue-50 border-blue-200',
    items: [
      '3m medium action spin kamış',
      'Japonya yapımı 3000 beden makine',
      'PE0.6 örgü ip + 0.25mm şok leader',
      'Silikon yem seti (5-10 parça)',
      'Jighead seti (3-10g)',
      'Fırdöndü ve klips seti',
    ]
  },
];

const EASY_FISH = [
  { name: 'Kızılgöz', icon: '🐟', tip: 'Ekmek kırıntısı veya mısırla göl kenarında kolayca yakalanır.', difficulty: '⭐' },
  { name: 'Çapak', icon: '🐠', tip: 'Durgun sularda solucanla, şamandıra kullanarak avlanır.', difficulty: '⭐' },
  { name: 'İstavrit', icon: '🐡', tip: 'Tuzlu suda kıyıdan küçük jigle veya ufak yemlerle çok kolay.', difficulty: '⭐' },
  { name: 'Sazan', icon: '🐟', tip: 'Sabır gerektirir ama tekniği basittir. Mısır veya ekmek yeterlidir.', difficulty: '⭐⭐' },
  { name: 'Kofana/Lüfer', icon: '🐠', tip: 'Göç dönemlerinde (Ekim-Kasım) kıyıdan çok kolay avlanır.', difficulty: '⭐⭐' },
];

const MISTAKES = [
  { mistake: 'Çok büyük iğne kullanmak', fix: 'Hedef balığa göre iğne boyutu seçin. Küçük balık = küçük iğne.' },
  { mistake: 'Misinanın hep gerilmesi', fix: 'Balık tuttuğunda fren ayarlı makine ipi serbest bırakmalı.' },
  { mistake: 'Gürültülü olmak', fix: 'Su çevresinde ses balıkları kaçırır. Sakin olun.' },
  { mistake: 'Gölge düşürmek', fix: 'Kendi gölgenizin suya düşmemesine dikkat edin. Balıklar kaçar.' },
  { mistake: 'Yanlış yer seçimi', fix: 'Su bitkisi kenarı, dalların altı, su girişleri idealdir.' },
  { mistake: 'Çok erken iğne çekmek', fix: 'Balık ısırdıktan sonra 2-3 saniye bekleyip sonra çekin.' },
];

export default function BaslangicPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-md mx-auto md:max-w-4xl p-4 md:p-8 mt-4 space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Başlangıç Rehberi</h1>
          <p className="text-gray-500 text-sm mt-1">Yeni balıkçılar için sıfırdan balıkçılık rehberi</p>
        </div>

        {/* İLK ADIMLAR */}
        <div className="bg-blue-600 rounded-2xl p-5 text-white shadow-xl">
          <h2 className="font-bold text-xl mb-4">🚀 İlk Ava Çıkmadan Önce</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { step: '1', text: 'e-Devlet\'ten amatör balıkçılık ruhsatı alın', icon: '📄' },
              { step: '2', text: 'Gideceğiniz bölgenin av yasaklarını kontrol edin', icon: '⚖️' },
              { step: '3', text: 'Hava durumunu ve rüzgar hızını kontrol edin', icon: '🌤️' },
              { step: '4', text: 'En az iki kişiyle gidin (güvenlik)', icon: '👥' },
            ].map(s => (
              <div key={s.step} className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                <span className="text-2xl">{s.icon}</span>
                <p className="text-blue-100 text-sm leading-snug">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* BAŞLANGIÇ EKİPMAN PAKETLERİ */}
        <div className="space-y-5">
          <h2 className="font-bold text-xl text-gray-900">💰 Ekipman Seçimi (Bütçeye Göre)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {STARTER_KITS.map(kit => (
              <div key={kit.budget} className={`bg-white rounded-2xl border ${kit.color} shadow-sm p-5`}>
                <div className="mb-3">
                  <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{kit.label}</span>
                  <p className="font-bold text-lg text-gray-900 mt-1">{kit.budget}</p>
                </div>
                <ul className="space-y-1.5">
                  {kit.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* EN KOLAY BALIKLAR */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-green-50/50 flex items-center gap-2">
            <span className="text-xl">🐟</span>
            <h2 className="font-bold text-gray-900">Yeni Başlayanlar İçin En Kolay Balıklar</h2>
          </div>
          <div className="p-5 space-y-3">
            {EASY_FISH.map(f => (
              <div key={f.name} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-2xl">{f.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-gray-900 text-sm">{f.name}</p>
                    <span className="text-xs">{f.difficulty}</span>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed">{f.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* YAYGIN HATALAR */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-amber-50/50 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <h2 className="font-bold text-gray-900">Yaygın Hatalar & Çözümleri</h2>
          </div>
          <div className="p-5 space-y-3">
            {MISTAKES.map(m => (
              <div key={m.mistake} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs font-bold text-red-600 mb-1">❌ Hata: {m.mistake}</p>
                <p className="text-xs text-green-700">✅ Çözüm: {m.fix}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DAHA FAZLA İÇERİK */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg">
          <h3 className="font-bold text-lg mb-3">📚 Daha Fazla Öğrenmek İçin</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Ekipman Rehberi', href: '/ekipman' },
              { label: 'Yöntemler', href: '/yontem/spin-balikcilik' },
              { label: 'Av Takvimi', href: '/takvim' },
              { label: 'Yem Tarifleri', href: '/yem-tarifleri' },
            ].map(l => (
              <a key={l.label} href={l.href} className="bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-3 py-2 text-sm font-medium text-center">
                {l.label} →
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
