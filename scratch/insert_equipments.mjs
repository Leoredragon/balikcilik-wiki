// Bu script Supabase REST API üzerinden tüm ekipman kayıtlarını ekler
// ve fishing_methods tablosuna cover_image_url sütunu ekler

const SUPABASE_URL = 'https://riulkmskbnslkptrgxuw.supabase.co'
const ANON_KEY = 'sb_publishable__kEcy1Lme2SJluJ9H9C5PA_GrFFRkd8'

const allEquipments = [
  // OLTA MAKİNELERİ
  { title: 'Spin Makineleri', slug: 'spin-makineleri', category_name: 'Olta Makineleri', description: 'Spin avcılığında kullanılan hafif, hızlı sarım oranına sahip yatay makinelerdir.', technical_details: '500-3000 makara beden aralığı uygundur. Yüksek dişli oranı (6:1 ve üzeri) tercih edilir.', tips: 'Hafiflik ve sarım hızı ön plandadır. Kapasite olarak 150-200 metre 0.20 mm misina alan makineler idealdir.' },
  { title: 'Spin Jig Makineleri', slug: 'spin-jig-makineleri', category_name: 'Olta Makineleri', description: 'Metal jig atışlarında kullanılan, yüksek tork ve hız sunan yatay makinelerdir.', technical_details: '3000-5000 beden arası, yüksek sarım hızı (95 cm+/tur) olan modeller önerilir.', tips: 'Diş kutusu ve makara gövdesi dayanıklılığı önemlidir. Tuzlu suda kullanıyorsanız tam su geçirmez modellere yönelin.' },
  { title: 'Çıkrık Jig Makineleri', slug: 'cikrik-jig-makineleri', category_name: 'Olta Makineleri', description: 'Derin sularda dikey jigleme için kullanılan, elektrik motorlu veya manuel dik konumlu makinelerdir.', technical_details: 'En az 400 metre PE3-4 ip kapasitesi önerilir. Tork değeri yüksek olmalıdır.', tips: 'Uzun gün jigleme yapıyorsanız kolunuzu korumak için elektrikli modeller tercih edilebilir.' },
  { title: 'Elektrikli Çıkrıklar', slug: 'elektrikli-cikriklar', category_name: 'Olta Makineleri', description: 'Derin su avcılığında güçlü motorla balığı yukarı çeken profesyonel makinelerdir.', technical_details: '12V veya 24V akü sistemiyle çalışır. En az 80 kg çekme gücü tavsiye edilir.', tips: 'Tekne avcılığı ve derin dip (150m+) avcılığı için vazgeçilmezdir. Bakımı düzenli yapılmalıdır.' },
  { title: 'Trolling Çıkrıklar', slug: 'trolling-cikriklar', category_name: 'Olta Makineleri', description: 'Tekne arkasından sürütme avcılığı için tasarlanmış, yüksek kapasiteli dik makinelerdir.', technical_details: 'En az 1000 metre misina/ip kapasitesi. Fren sistemi güçlü olmalıdır (10 kg+ drag).', tips: 'Su direncine karşı dişlileri geniş makaraları olan modeller seçin.' },
  { title: 'Surf Makineleri', slug: 'surf-makineleri', category_name: 'Olta Makineleri', description: 'Sahilden uzak mesafelere ağır kurşun atmak için büyük kapasiteli yatay makinelerdir.', technical_details: '6000-10000 beden, en az 300 metre 0.30 mm misina kapasitesi.', tips: 'Sarım eşitleyici (levelwind) olmayan modeller daha temiz atış sağlar.' },
  { title: 'Bait Casting Makineler', slug: 'bait-casting-makineler', category_name: 'Olta Makineleri', description: 'Üstten sarımlı, hassas fren sistemi ve yüksek hassasiyet sunan yuvarlak veya düz profilli makinelerdir.', technical_details: 'Manyetik veya santrifüj fren tercihine göre seçilir. Baskül kapasitesi 5-100 gr arasında olmalıdır.', tips: 'İlk kez kullananlar için manyetik frenli modeller önerilir; ayarlaması daha kolaydır.' },
  { title: 'Bait Runner Makineler', slug: 'bait-runner-makineler', category_name: 'Olta Makineleri', description: 'Sazan ve karpuz balığı avcılığında kullanılan, arka frenleri serbest bırakılabilen özel makinelerdir.', technical_details: 'Çift frenli (ana fren + bait runner freni) sisteme sahiptir. 4000-8000 beden uygundur.', tips: 'Yemi tutan alarm sistemleriyle birlikte kullanılır. Büyük sazan avcılığında standart ekipmandır.' },
  { title: 'Fly Makineler', slug: 'fly-makineler', category_name: 'Olta Makineleri', description: 'Fly balıkçılığına özel, büyük çaplı, hafif ve çıkrık tarzı makinelerdir.', technical_details: 'Fly hattı numarasına göre (3-12 wt) makara seçilir. Büyük iç çap önemlidir.', tips: 'Kaliteli bir tıklama fren sistemi balık kaçırmamayı önler. Büyük balık için geniş hazneli makaralar seçin.' },

  // SUNİ YEMLER
  { title: 'Maket Yemler', slug: 'maket-yemler', category_name: 'Suni Yemler', description: 'Küçük balıkları taklit eden sert plastik veya ahşap gövdeli yüzen/batan yemledir.', technical_details: 'Boyut 5-20 cm, baskül 3-60 gr arasında seçilir. Yüzer, yarı batar ve batar modelleri vardır.', tips: 'Su altındaki derinliğe ve hedef balığa göre dalış derinliği (lip büyüklüğü) seçilmelidir.' },
  { title: 'Silikon Yemler', slug: 'silikon-yemler', category_name: 'Suni Yemler', description: 'Yumuşak dokulu, solucan, balık veya böcek şeklinde esnek suni yemledir.', technical_details: 'Jighead ile kombine edilir. 1-12 cm boyutları en yaygın kullanılanlardır.', tips: 'Renk seçiminde su berraklığı belirleyicidir: berrak suda doğal, bulanık suda parlak renkler.' },
  { title: 'Vibrasyon Yemler', slug: 'vibrasyon-yemler', category_name: 'Suni Yemler', description: 'Dikey aksiyon sırasında güçlü titreşim yayan, ağır sert gövdeli suni yemledir.', technical_details: 'Genellikle 7-25 gr. Hızlı çekişte en fazla titreşimi verir.', tips: 'Soğuk suda yavaş çekiş, sıcak suda hızlı çekiş daha etkilidir.' },
  { title: 'Jig Yemler', slug: 'jig-yemler', category_name: 'Suni Yemler', description: 'Metal gövdeli, dip ve orta sularda dikey aksiyon için tasarlanmış suni yemledir.', technical_details: '20-400 gr. Akıntı ve derinliğe göre ağırlık seçilir.', tips: 'Uzun dar jig hızlı akıntıda, kısa geniş jig yavaş akıntıda daha iyi çalışır.' },
  { title: 'Tai Rubber & Silider Jig Yemler', slug: 'tai-rubber-silider-jig-yemler', category_name: 'Suni Yemler', description: 'Dip sürükleme tekniğinde kullanılan, yumuşak etek ve kurşun kombinasyonlu yemledir.', technical_details: '40-300 gr. Derinliğe ve akıntıya göre ağırlık ayarlanır.', tips: 'Yavaş düşüşlü etek hareketi balığı büyüler. Renk seçimini mevsime göre yapın.' },
  { title: 'Angel Eye & Melek Göz Yemler', slug: 'angel-eye-melek-goz-yemler', category_name: 'Suni Yemler', description: 'Geniş göz imitasyonu ve salınımlı etek tasarımıyla predatör balıkları çeken suni yemledir.', technical_details: '10-50 gr arası modelleri yaygındır. Yavaş çekişte en iyi sonucu verir.', tips: 'Özellikle levrek, kofana ve palamut için mükemmel sonuçlar alınmaktadır.' },
  { title: 'Spin Kaşık Yemler', slug: 'spin-kasik-yemler', category_name: 'Suni Yemler', description: 'İleriye doğru çekildikçe parlayıp dönen sert metal yemledir.', technical_details: 'Ağırlık 3-25 gr. Defalarca kullanıma dayanıklı.', tips: 'Salmonid (alabalık, somon) avcılığında çok etkilidir. Mat renk bulutlu havalarda önerilir.' },
  { title: 'Döner Kaşık Yemler', slug: 'doner-kasik-yemler', category_name: 'Suni Yemler', description: 'Kendi ekseni etrafında dönen yapraklı metal yemledir.', technical_details: '0-20 gr arası. Çeşitli su derinlikleri için kullanılır.', tips: 'En yavaş çekişte bile titreşim üretmesi sayesinde soğuk su avcılığında güçlüdür.' },
  { title: 'Kalamar Zokaları', slug: 'kalamar-zokalari', category_name: 'Suni Yemler', description: 'Kalamar ve mürekkep balığı için özel üretilmiş çengelli suni yemledir.', technical_details: 'Boyut 1.5-5.0 (Japon standardı). Alt kısımda özel çengel sistemi bulunur.', tips: 'Gece avcılığı için fosforlu/aydınlık modeller çok etkilidir.' },
  { title: 'Fly Yemleri', slug: 'fly-yemleri', category_name: 'Suni Yemler', description: 'Fly balıkçılığına özel, tüy, ipek ve yapay malzemeden el yapımı yemledir.', technical_details: 'Farklı sürükleme derinliklerine göre (dry fly, nymph, streamer) kategorilenir.', tips: 'Su üzerindeki böcek faaliyetlerini gözlemleyin; o böceği taklit eden fly seçin.' },

  // İP VE MİSİNALAR
  { title: 'Örgü İpler', slug: 'orgu-ipler', category_name: 'İp ve Misinalar', description: 'Çoklu lif örgüsünden oluşan, düşük uzama ve yüksek mukavemet sunan ana hatlardır.', technical_details: 'PE0.4-PE6 arası. 4 veya 8 örgülü seçenekleri mevcuttur. 8 örgü daha düzgün yüzey sağlar.', tips: '8 örgülü ipler kılavuzlarda daha az sürtünme oluşturur. Uzak atış için 8 örgü tercih edin.' },
  { title: 'Misinalar', slug: 'misinalar', category_name: 'İp ve Misinalar', description: 'Monofilament yapıda, hafif uzama özelliği olan geleneksel ana hatlardır.', technical_details: '0.10-0.60 mm. Nylon veya fluorocarbon bazlı olabilir.', tips: 'Esnekliği sayesinde kancalamayı kolaylaştırır. Bütçe dostu yeni başlayanlar için idealdir.' },
  { title: 'Shock Leader', slug: 'shock-leader', category_name: 'İp ve Misinalar', description: 'Ana iple balık arasına bağlanan, aşındırma ve ani çekişlere dayanıklı kalın kılavuz hattır.', technical_details: 'Genellikle 1.0-2.0 mm veya 40-100 lb. 5-10 metre uzunluk yeterlidir.', tips: 'Surf ve big game avcılığında zorunludur. Her sezon değiştirilmesi önerilir.' },
  { title: 'Assist İpler', slug: 'assist-ipler', category_name: 'İp ve Misinalar', description: 'Jig iğnelerini jige bağlamak için kullanılan yüksek dayanımlı kısa ipler.', technical_details: 'Dyneema veya kevlar bazlı. 50-200 lb arası mukavemet.', tips: 'Asla karbonlu çelik tel kullanmayın; esnekliği olmayan teller balık vururken kırılır.' },
  { title: 'Çelik Teller', slug: 'celik-teller', category_name: 'İp ve Misinalar', description: 'Dişli predatör balıklara (levrek, uskumru, palamut) karşı kullanılan kesme korumalı liderlardır.', technical_details: '4-14 kg. Mono veya çok telli çelik seçenekleri mevcuttur.', tips: 'Tek telli çelik daha az görünür ama kırılgandır. Çok telli daha dayanıklıdır.' },

  // OLTA İĞNELERİ
  { title: 'Yemli Olta İğneleri', slug: 'yemli-olta-igneleri', category_name: 'Olta İğneleri', description: 'Doğal yem (solucan, ekmek, mısır) ile kullanım için tasarlanmış standart iğnelerdir.', technical_details: 'No. 6-2/0 arası. Paslanmaz çelik tercih edilmeli.', tips: 'İğne boyutunu yeme ve hedef balığa göre seçin. Küçük iğne küçük balık demek değil; yanlış boyut kaçırır.' },
  { title: 'Maket İğneleri', slug: 'maket-igneleri', category_name: 'Olta İğneleri', description: 'Sert ve yumuşak maket yemlere monte edilen, genellikle tek veya üçlü kancalı iğnelerdir.', technical_details: 'Üçlü (treble) veya tekli. No. 6-2/0 standart aralık.', tips: 'Maket yemi değiştirirken iğne de gözden geçirin; körelen iğne balık kaçırır.' },
  { title: 'Asist Jig İğneleri', slug: 'asist-jig-igneleri', category_name: 'Olta İğneleri', description: 'Jig yemine bağlanan, kısa assist ip üzerinde gelen özel iğnelerdir.', technical_details: 'Çift veya tek kancalı seçenekleri mevcuttur. Japon standartlarında üretilir.', tips: 'Öne ve arka asist kullanımı balığın saldırı açısına göre ayarlanmalıdır.' },
  { title: 'Offset İğneler', slug: 'offset-igneler', category_name: 'Olta İğneleri', description: 'Silikon yemler için tasarlanmış, kanca ucu gövdeye gömülü Texas/Carolina rig iğnelerdir.', technical_details: '1/0-5/0 beden arası. Eğimli ağız (offset) ile yemi sabit tutar.', tips: 'İğne ucunu silikon yemin gövdesine gömerek kancasız (weedless) kullanım sağlayın.' },
  { title: 'Jighead ve Zokalar', slug: 'jighead-ve-zokalar', category_name: 'Olta İğneleri', description: 'Kurşun başlıklı ve iğneli, silikon yemlerle birlikte kullanılan kombine aksesuar.', technical_details: '1-30 gr. İğne beden numarası silikon yem boyutuna göre belirlenir.', tips: 'Düz kancalı jighead yumuşak silikon yemlere, round head dalış için önerilir.' },

  // OLTA APARATLARI
  { title: 'Klips ve Fırdöndüler', slug: 'klips-ve-firdondular', category_name: 'Olta Aparatları', description: 'Yem değişimini hızlandıran klips ve lider/hat dönüşünü önleyen fırdöndü aksesuarlarıdır.', technical_details: 'Çeşitli kg kırılma noktaları. Snap klips, barrel swivel, crane swivel varyantları.', tips: 'Kırılma noktası, ana hattınızın en zayıf bölgesini geçmemeli. Aksi halde aparatlara güvenemezsiniz.' },
  { title: 'Kurşunlar', slug: 'kurşunlar', category_name: 'Olta Aparatları', description: 'Yemi dibe veya istenilen derinliğe taşımak için kullanılan ağırlıklardır.', technical_details: 'Kaymaz, diski, pençeli, salyangoz vb. formlar mevcuttur. 5-300 gr arası.', tips: 'Akıntılı yerlerde pençeli veya diski kurşun; düz dipte kaymaz kurşun kullanın.' },
  { title: 'Şamandıralar', slug: 'samandiralar', category_name: 'Olta Aparatları', description: 'Yemin istenilen derinlikte kalmasını sağlayan ve balık vuruşunu gösteren yüzdürme aparatıdır.', technical_details: 'Sabit, kayan ve balık şamandırası varyantları. 1-30 gr taşıma kapasitesi.', tips: 'Kayan şamandıra derin sularda, sabit şamandıra sığ sularda kullanılır.' },
  { title: 'Stoper ve Boncuklar', slug: 'stoper-ve-boncuklar', category_name: 'Olta Aparatları', description: 'Şamandıra ve aparatların hatta kaymasını önleyen, balığı şamandıraya doğru yönlendiren aparatlardır.', technical_details: 'İp stoper, lastik stoper ve sert plastik boncuklar en yaygın formlar.', tips: 'Stoper konumunu değiştirerek yemin derinliğini anında ayarlayabilirsiniz.' },
  { title: 'Yem Delici İğneler', slug: 'yem-delici-igneler', category_name: 'Olta Aparatları', description: 'Zeytinyağlı yemden Boiliye kadar sert yemleri iğneye geçirmek için kullanılan ince iğnedir.', technical_details: 'Plastik veya metal ince çubuk formu. Farklı uzunluklar mevcuttur.', tips: 'Boili ve mısır gibi sert yemleri iğneye delici olmadan geçirmek hem zordur hem de iğne noktasını köreltir.' },
  { title: 'Alarm, Zil ve Fosforlar', slug: 'alarm-zil-ve-fosforlar', category_name: 'Olta Aparatları', description: 'Balık vuruşunu sesli ışıklı olarak haber veren elektronik ve mekanik aparatlardır.', technical_details: 'Elektronik alarm (pil gerekli) veya mekanik zil. Fosfor çubuk gece balıkçılığı için.', tips: 'Gece sazan avcılığında hem alarm hem fosfor kullanmak kesinlikle tavsiye edilir.' },
  { title: 'Yem İpleri', slug: 'yem-ipleri', category_name: 'Olta Aparatları', description: 'Boili ve doğal yemleri kancaya bağlamak ve sabitleştirmek için kullanılan ince ipler.', technical_details: 'PVA eriyen veya normal polyester bazlı. 10-20 lb kırılma noktası.', tips: 'PVA ipi suda eriyerek yemi serbest bırakır; sazan avcılığında çok pratiktir.' },
  { title: 'Silikon Yem Aparatları', slug: 'silikon-yem-aparatlari', category_name: 'Olta Aparatları', description: 'Silikon yemleri offset, drop shot veya Carolina rig sistemine bağlamak için kullanılan kılavuz aparatlar.', technical_details: 'Jighead, drop shot ağırlık, Texas rig kurşun vb. kombinasyonlar.', tips: 'Drop shot için 1-5 gr ağırlık ve 30-50 cm lider kullanımı standart bir başlangıç noktasıdır.' },
]

async function insertEquipments() {
  // Supabase anon key ile insert yapacağız
  const headers = {
    'Content-Type': 'application/json',
    'apikey': ANON_KEY,
    'Authorization': `Bearer ${ANON_KEY}`,
    'Prefer': 'return=minimal'
  }

  console.log(`Toplam ${allEquipments.length} ekipman ekleniyor...`)
  
  // Her birini ayrı ayrı dene (upsert - zaten varsa güncelle)
  let successCount = 0
  let errorCount = 0

  for (const equip of allEquipments) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/equipments`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'resolution=ignore-duplicates,return=minimal' },
      body: JSON.stringify(equip)
    })

    if (res.ok || res.status === 201) {
      successCount++
      console.log(`✅ Eklendi: ${equip.title}`)
    } else {
      const err = await res.text()
      if (err.includes('duplicate') || err.includes('unique')) {
        console.log(`⏭️  Atlandı (zaten var): ${equip.title}`)
        successCount++
      } else {
        errorCount++
        console.log(`❌ Hata (${equip.title}): ${err}`)
      }
    }
  }

  console.log(`\n✅ Başarılı: ${successCount} / ${allEquipments.length}`)
  if (errorCount > 0) console.log(`❌ Hata: ${errorCount}`)
}

insertEquipments().catch(console.error)
