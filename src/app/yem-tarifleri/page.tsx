export default function YemTarifPage() {
  const recipes = [
    {
      title: 'Klasik Sazan Boilisi',
      icon: '🥚',
      difficulty: 'Orta',
      ingredients: '6 yumurta, 500g base mix (mısır unu + kepek + soya), 50ml balık esansı, 50g amino asit',
      steps: '1. Tüm kuru malzemeleri karıştırın. 2. Yumurta ve esansı ekleyip yoğurun. 3. Küçük toplar haline getirin. 4. 3 dakika kaynar suda haşlayın. 5. Kurutucuda veya fırında kuruyun.',
      tip: 'Balıkçılıktan 24 saat önce hazırlayıp buzdolabında bekletmek esterleşmeyi arttırır.',
      color: 'border-amber-200 bg-amber-50/40'
    },
    {
      title: 'Ekmek Hamuru Yemi',
      icon: '🍞',
      difficulty: 'Kolay',
      ingredients: 'Bayat ekmek, süt, sarımsak tozu, vanilya (opsiyonel)',
      steps: '1. Ekmeği sütla ıslatın. 2. İyice yoğurup sıkın. 3. Sarımsak tozu ekleyin. 4. İğneye geçecek kıvama getirin.',
      tip: 'Akarsu sazan avcılığında mısır granülü ile karıştırın. Çok etkilidir.',
      color: 'border-yellow-200 bg-yellow-50/40'
    },
    {
      title: 'Çipura & Levrek için Doğal Yem Hazırlığı',
      icon: '🦐',
      difficulty: 'Kolay',
      ingredients: 'Canlı veya dondurulmuş karides, midye eti, balık filetosu (ufak)',
      steps: '1. Karideslerı kabuktan çıkarın. 2. İğneye takarken kanca görünmesin. 3. Midyeyi iplikle iğneye bağlayın. 4. Taze tutmak için buzlu kutuda saklayın.',
      tip: 'Taze yem yapay yeme göre %40 daha fazla balık yakalar. Günlük alışveriş yapın.',
      color: 'border-blue-200 bg-blue-50/40'
    },
    {
      title: 'PVA Torba Karışımı (Sazan)',
      icon: '🌽',
      difficulty: 'Orta',
      ingredients: 'Mısır granülü, hemp tohumu, pellet, kısa bölünmüş boili',
      steps: '1. Tüm malzemeleri kuru olarak karıştırın. 2. PVA torbaya doldurun. 3. Ana iğneyi torbanın içinden geçirin. 4. Torbanın ağzını bağlayın. 5. Suya atın — PVA erir, yemler serbestleşir.',
      tip: 'PVA su ile temas etmede erimeye başlar. Islak el ile dokunmayın!',
      color: 'border-green-200 bg-green-50/40'
    },
    {
      title: 'Ev Yapımı Groundbait',
      icon: '🌾',
      difficulty: 'Kolay',
      ingredients: '500g kepek, 200g mısır unu, 100g kuş yemi, 50g balkabağı tohumu, sarımsak, vanilya',
      steps: '1. Tüm kuru malzemeleri karıştırın. 2. Az su ekleyerek topak topak kıvama getirin. 3. Orta boy toplar yaparak suya atın. 4. Toplar dibinde dağılarak besit oluşturur.',
      tip: 'Akarsuda daha sıkı yoğurun (akıntıya dayanmalı). Durgun suda gevşek olabilir.',
      color: 'border-teal-200 bg-teal-50/40'
    },
    {
      title: 'Yem Saklama & Tazeleme',
      icon: '❄️',
      difficulty: 'Bilgi',
      ingredients: '',
      steps: '',
      tip: 'Doğal yemler (karides, solucan): Buzdolabında maksimum 3 gün. Vakumlu poşet kullanın. Boili: Buzdolabında 2 hafta, buzlukta 6 ay. Açık havada nemli ortamda tutun. Silikon yemler: Nemden uzak, serin ortamda saklanmalı. UV ışıktan koruyun.',
      color: 'border-slate-200 bg-slate-50'
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-md mx-auto md:max-w-4xl p-4 md:p-8 mt-4 space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">🧪 Yem Tarifleri & Hazırlık</h1>
          <p className="text-gray-500 text-sm mt-1">Ev yapımı doğal ve yapay yemler için adım adım tarifler</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recipes.map(r => (
            <div key={r.title} className={`bg-white rounded-2xl border ${r.color} shadow-sm overflow-hidden`}>
              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{r.icon}</span>
                  <div>
                    <h2 className="font-bold text-gray-900 text-base">{r.title}</h2>
                    {r.difficulty !== 'Bilgi' && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.difficulty === 'Kolay' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {r.difficulty}
                      </span>
                    )}
                  </div>
                </div>

                {r.ingredients && (
                  <div className="mb-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Malzemeler</p>
                    <p className="text-sm text-gray-700">{r.ingredients}</p>
                  </div>
                )}

                {r.steps && (
                  <div className="mb-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Hazırlık</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{r.steps}</p>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mt-2">
                  <p className="text-xs text-blue-700 leading-relaxed">💡 {r.tip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
