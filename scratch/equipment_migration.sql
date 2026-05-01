-- ==========================================
-- AVLAK WIKI — TAM VERİTABANI GÜNCELLEMESİ
-- Supabase Dashboard > SQL Editor'de çalıştır
-- ==========================================

-- 1. fishing_methods tablosuna fotoğraf alanı ekle
ALTER TABLE fishing_methods ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- 2. Mevcut tüm ekipman kayıtlarını sil ve yeniden ekle (temiz slate)
-- (Sadece yeni kategorileri eklemek istiyorsanız bu satırı kaldırın)

-- 3. YENİ EKİPMAN KAYITLARI

-- OLTA MAKİNELERİ
INSERT INTO equipments (title, slug, category_name, description, technical_details, tips, is_published) VALUES
('Spin Makineleri', 'spin-makineleri', 'Olta Makineleri', 'Spin avcılığında kullanılan hafif, hızlı sarım oranına sahip yatay makinelerdir.', '500-3000 makara beden aralığı uygundur. Yüksek dişli oranı (6:1 ve üzeri) tercih edilir.', 'Hafiflik ve sarım hızı ön plandadır. Kapasite olarak 150-200 metre 0.20 mm misina alan makineler idealdir.', true),
('Spin Jig Makineleri', 'spin-jig-makineleri', 'Olta Makineleri', 'Metal jig atışlarında kullanılan, yüksek tork ve hız sunan yatay makinelerdir.', '3000-5000 beden arası, yüksek sarım hızı (95 cm+/tur) olan modeller önerilir.', 'Diş kutusu ve makara gövdesi dayanıklılığı önemlidir. Tuzlu suda kullanıyorsanız tam su geçirmez modellere yönelin.', true),
('Çıkrık Jig Makineleri', 'cikrik-jig-makineleri', 'Olta Makineleri', 'Derin sularda dikey jigleme için kullanılan, elektrik motorlu veya manuel dik konumlu makinelerdir.', 'En az 400 metre PE3-4 ip kapasitesi önerilir. Tork değeri yüksek olmalıdır.', 'Uzun gün jigleme yapıyorsanız kolunuzu korumak için elektrikli modeller tercih edilebilir.', true),
('Elektrikli Çıkrıklar', 'elektrikli-cikriklar', 'Olta Makineleri', 'Derin su avcılığında güçlü motorla balığı yukarı çeken profesyonel makinelerdir.', '12V veya 24V akü sistemiyle çalışır. En az 80 kg çekme gücü tavsiye edilir.', 'Tekne avcılığı ve derin dip (150m+) avcılığı için vazgeçilmezdir. Bakımı düzenli yapılmalıdır.', true),
('Trolling Çıkrıklar', 'trolling-cikriklar', 'Olta Makineleri', 'Tekne arkasından sürütme avcılığı için tasarlanmış, yüksek kapasiteli dik makinelerdir.', 'En az 1000 metre misina/ip kapasitesi. Fren sistemi güçlü olmalıdır (10 kg+ drag).', 'Su direncine karşı dişlileri geniş makaraları olan modeller seçin.', true),
('Surf Makineleri', 'surf-makineleri', 'Olta Makineleri', 'Sahilden uzak mesafelere ağır kurşun atmak için büyük kapasiteli yatay makinelerdir.', '6000-10000 beden, en az 300 metre 0.30 mm misina kapasitesi.', 'Sarım eşitleyici (levelwind) olmayan modeller daha temiz atış sağlar.', true),
('Bait Casting Makineler', 'bait-casting-makineler', 'Olta Makineleri', 'Üstten sarımlı, hassas fren sistemi ve yüksek hassasiyet sunan yuvarlak veya düz profilli makinelerdir.', 'Manyetik veya santrifüj fren tercihine göre seçilir. Baskül kapasitesi 5-100 gr arasında olmalıdır.', 'İlk kez kullananlar için manyetik frenli modeller önerilir; ayarlaması daha kolaydır.', true),
('Bait Runner Makineler', 'bait-runner-makineler', 'Olta Makineleri', 'Sazan ve karpuz balığı avcılığında kullanılan, arka frenleri serbest bırakılabilen özel makinelerdir.', 'Çift frenli (ana fren + bait runner freni) sisteme sahiptir. 4000-8000 beden uygundur.', 'Yemi tutan alarm sistemleriyle birlikte kullanılır. Büyük sazan avcılığında standart ekipmandır.', true),
('Fly Makineler', 'fly-makineler', 'Olta Makineleri', 'Fly balıkçılığına özel, büyük çaplı, hafif ve çıkrık tarzı makinelerdir.', 'Fly hattı numarasına göre (3-12 wt) makara seçilir. Büyük iç çap önemlidir.', 'Kaliteli bir tıklama fren sistemi balık kaçırmamayı önler. Büyük balık için geniş hazneli makaralar seçin.', true)
ON CONFLICT (slug) DO NOTHING;

-- SUNİ YEMLER
INSERT INTO equipments (title, slug, category_name, description, technical_details, tips, is_published) VALUES
('Maket Yemler', 'maket-yemler', 'Suni Yemler', 'Küçük balıkları taklit eden sert plastik veya ahşap gövdeli yüzen/batan yemledir.', 'Boyut 5-20 cm, baskül 3-60 gr arasında seçilir. Yüzer, yarı batar ve batar modelleri vardır.', 'Su altındaki derinliğe ve hedef balığa göre dalış derinliği (lip büyüklüğü) seçilmelidir.', true),
('Silikon Yemler', 'silikon-yemler', 'Suni Yemler', 'Yumuşak dokulu, solucan, balık veya böcek şeklinde esnek suni yemledir.', 'Jighead ile kombine edilir. 1-12 cm boyutları en yaygın kullanılanlardır.', 'Renk seçiminde su berraklığı belirleyicidir: berrak suda doğal, bulanık suda parlak renkler.', true),
('Vibrasyon Yemler', 'vibrasyon-yemler', 'Suni Yemler', 'Dikey aksiyon sırasında güçlü titreşim yayan, ağır sert gövdeli suni yemledir.', 'Genellikle 7-25 gr. Hızlı çekişte en fazla titreşimi verir.', 'Soğuk suda yavaş çekiş, sıcak suda hızlı çekiş daha etkilidir.', true),
('Jig Yemler', 'jig-yemler', 'Suni Yemler', 'Metal gövdeli, dip ve orta sularda dikey aksiyon için tasarlanmış suni yemledir.', '20-400 gr. Akıntı ve derinliğe göre ağırlık seçilir.', 'Uzun dar jig hızlı akıntıda, kısa geniş jig yavaş akıntıda daha iyi çalışır.', true),
('Tai Rubber & Silider Jig Yemler', 'tai-rubber-silider-jig-yemler', 'Suni Yemler', 'Dip sürükleme tekniğinde kullanılan, yumuşak etek ve kurşun kombinasyonlu yemledir.', '40-300 gr. Derinliğe ve akıntıya göre ağırlık ayarlanır.', 'Yavaş düşüşlü etek hareketi balığı büyüler. Renk seçimini mevsime göre yapın.', true),
('Angel Eye & Melek Göz Yemler', 'angel-eye-melek-goz-yemler', 'Suni Yemler', 'Geniş göz imitasyonu ve salınımlı etek tasarımıyla predatör balıkları çeken suni yemledir.', '10-50 gr arası modelleri yaygındır. Yavaş çekişte en iyi sonucu verir.', 'Özellikle levrek, kofana ve palamut için mükemmel sonuçlar alınmaktadır.', true),
('Spin Kaşık Yemler', 'spin-kasik-yemler', 'Suni Yemler', 'İleriye doğru çekildikçe parlayıp dönen sert metal yemledir.', 'Ağırlık 3-25 gr. Defalarca kullanıma dayanıklı.', 'Salmonid (alabalık, somon) avcılığında çok etkilidir. Mat renk bulutlu havalarda önerilir.', true),
('Döner Kaşık Yemler', 'doner-kasik-yemler', 'Suni Yemler', 'Kendi ekseni etrafında dönen yapraklı metal yemledir.', '0-20 gr arası. Çeşitli su derinlikleri için kullanılır.', 'En yavaş çekişte bile titreşim üretmesi sayesinde soğuk su avcılığında güçlüdür.', true),
('Kalamar Zokaları', 'kalamar-zokalari', 'Suni Yemler', 'Kalamar ve mürekkep balığı için özel üretilmiş çengelli suni yemledir.', 'Boyut 1.5-5.0 (Japon standardı). Alt kısımda özel çengel sistemi bulunur.', 'Gece avcılığı için fosforlu/aydınlık modeller çok etkilidir.', true),
('Fly Yemleri', 'fly-yemleri', 'Suni Yemler', 'Fly balıkçılığına özel, tüy, ipek ve yapay malzemeden el yapımı yemledir.', 'Farklı sürükleme derinliklerine göre (dry fly, nymph, streamer) kategorilenir.', 'Su üzerindeki böcek faaliyetlerini gözlemleyin; o böceği taklit eden fly seçin.', true)
ON CONFLICT (slug) DO NOTHING;

-- İP VE MİSİNALAR
INSERT INTO equipments (title, slug, category_name, description, technical_details, tips, is_published) VALUES
('Örgü İpler', 'orgu-ipler', 'İp ve Misinalar', 'Çoklu lif örgüsünden oluşan, düşük uzama ve yüksek mukavemet sunan ana hatlardır.', 'PE0.4-PE6 arası. 4 veya 8 örgülü seçenekleri mevcuttur. 8 örgü daha düzgün yüzey sağlar.', '8 örgülü ipler kılavuzlarda daha az sürtünme oluşturur. Uzak atış için 8 örgü tercih edin.', true),
('Misinalar', 'misinalar', 'İp ve Misinalar', 'Monofilament yapıda, hafif uzama özelliği olan geleneksel ana hatlardır.', '0.10-0.60 mm. Nylon veya fluorocarbon bazlı olabilir.', 'Esnekliği sayesinde kancalamayı kolaylaştırır. Bütçe dostu yeni başlayanlar için idealdir.', true),
('Shock Leader', 'shock-leader', 'İp ve Misinalar', 'Ana iple balık arasına bağlanan, aşındırma ve ani çekişlere dayanıklı kalın kılavuz hattır.', 'Genellikle 1.0-2.0 mm veya 40-100 lb. 5-10 metre uzunluk yeterlidir.', 'Surf ve big game avcılığında zorunludur. Her sezon değiştirilmesi önerilir.', true),
('Assist İpler', 'assist-ipler', 'İp ve Misinalar', 'Jig iğnelerini jige bağlamak için kullanılan yüksek dayanımlı kısa ipler.', 'Dyneema veya kevlar bazlı. 50-200 lb arası mukavemet.', 'Asla karbonlu çelik tel kullanmayın; esnekliği olmayan teller balık vururken kırılır.', true),
('Çelik Teller', 'celik-teller', 'İp ve Misinalar', 'Dişli predatör balıklara (levrek, uskumru, palamut) karşı kullanılan kesme korumalı liderlerdir.', '4-14 kg. Mono veya çok telli çelik seçenekleri mevcuttur.', 'Tek telli çelik daha az görünür ama kırılgandır. Çok telli daha dayanıklıdır.', true)
ON CONFLICT (slug) DO NOTHING;

-- OLTA İĞNELERİ
INSERT INTO equipments (title, slug, category_name, description, technical_details, tips, is_published) VALUES
('Yemli Olta İğneleri', 'yemli-olta-igneleri', 'Olta İğneleri', 'Doğal yem (solucan, ekmek, mısır) ile kullanım için tasarlanmış standart iğnelerdir.', 'No. 6-2/0 arası. Paslanmaz çelik tercih edilmeli.', 'İğne boyutunu yeme ve hedef balığa göre seçin. Küçük iğne küçük balık demek değil; yanlış boyut kaçırır.', true),
('Maket İğneleri', 'maket-igneleri', 'Olta İğneleri', 'Sert ve yumuşak maket yemlere monte edilen, genellikle tek veya üçlü kancalı iğnelerdir.', 'Üçlü (treble) veya tekli. No. 6-2/0 standart aralık.', 'Maket yemi değiştirirken iğne de gözden geçirin; körelen iğne balık kaçırır.', true),
('Asist Jig İğneleri', 'asist-jig-igneleri', 'Olta İğneleri', 'Jig yemine bağlanan, kısa assist ip üzerinde gelen özel iğnelerdir.', 'Çift veya tek kancalı seçenekleri mevcuttur. Japon standartlarında üretilir.', 'Öne ve arka asist kullanımı balığın saldırı açısına göre ayarlanmalıdır.', true),
('Offset İğneler', 'offset-igneler', 'Olta İğneleri', 'Silikon yemler için tasarlanmış, kanca ucu gövdeye gömülü Texas/Carolina rig iğnelerdir.', '1/0-5/0 beden arası. Eğimli ağız (offset) ile yemi sabit tutar.', 'İğne ucunu silikon yemin gövdesine gömerek kancasız (weedless) kullanım sağlayın.', true),
('Jighead ve Zokalar', 'jighead-ve-zokalar', 'Olta İğneleri', 'Kurşun başlıklı ve iğneli, silikon yemlerle birlikte kullanılan kombine aksesuar.', '1-30 gr. İğne beden numarası silikon yem boyutuna göre belirlenir.', 'Düz kancalı jighead yumuşak silikon yemlere, round head dalış için önerilir.', true)
ON CONFLICT (slug) DO NOTHING;

-- OLTA APARATLARI
INSERT INTO equipments (title, slug, category_name, description, technical_details, tips, is_published) VALUES
('Klips ve Fırdöndüler', 'klips-ve-firdondular', 'Olta Aparatları', 'Yem değişimini hızlandıran klips ve lider/hat dönüşünü önleyen fırdöndü aksesuarlarıdır.', 'Çeşitli kg kırılma noktaları. Snap klips, barrel swivel, crane swivel varyantları.', 'Kırılma noktası, ana hattınızın en zayıf bölgesini geçmemeli. Aksi halde aparatlara güvenemezsiniz.', true),
('Kurşunlar', 'kurşunlar', 'Olta Aparatları', 'Yemi dibe veya istenilen derinliğe taşımak için kullanılan ağırlıklardır.', 'Kaymaz, diski, pençeli, salyangoz vb. formlar mevcuttur. 5-300 gr arası.', 'Akıntılı yerlerde pençeli veya diski kurşun; düz dipte kaymaz kurşun kullanın.', true),
('Şamandıralar', 'samandiralar', 'Olta Aparatları', 'Yemin istenilen derinlikte kalmasını sağlayan ve balık vuruşunu gösteren yüzdürme aparatıdır.', 'Sabit, kayan ve balık şamandırası varyantları. 1-30 gr taşıma kapasitesi.', 'Kayan şamandıra derin sularda, sabit şamandıra sığ sularda kullanılır.', true),
('Stoper ve Boncuklar', 'stoper-ve-boncuklar', 'Olta Aparatları', 'Şamandıra ve aparatların hatta kaymasını önleyen, balığı şamandıraya doğru yönlendiren aparatlardır.', 'İp stoper, lastik stoper ve sert plastik boncuklar en yaygın formlar.', 'Stoper konumunu değiştirerek yemin derinliğini anında ayarlayabilirsiniz.', true),
('Yem Delici İğneler', 'yem-delici-igneler', 'Olta Aparatları', 'Zeytinyağlı yemden Boiliye kadar sert yemleri iğneye geçirmek için kullanılan ince iğnedir.', 'Plastik veya metal ince çubuk formu. Farklı uzunluklar mevcuttur.', 'Boili ve mısır gibi sert yemleri iğneye delici olmadan geçirmek hem zordur hem de iğne noktasını köreltir.', true),
('Alarm, Zil ve Fosforlar', 'alarm-zil-ve-fosforlar', 'Olta Aparatları', 'Balık vuruşunu sesli ışıklı olarak haber veren elektronik ve mekanik aparatlardır.', 'Elektronik alarm (pil gerekli) veya mekanik zil. Fosfor çubuk gece balıkçılığı için.', 'Gece sazan avcılığında hem alarm hem fosfor kullanmak kesinlikle tavsiye edilir.', true),
('Yem İpleri', 'yem-ipleri', 'Olta Aparatları', 'Boili ve doğal yemleri kancaya bağlamak ve sabitleştirmek için kullanılan ince ipler.', 'PVA eriyen veya normal polyester bazlı. 10-20 lb kırılma noktası.', 'PVA ipi suda eriyerek yemi serbest bırakır; sazan avcılığında çok pratiktir.', true),
('Silikon Yem Aparatları', 'silikon-yem-aparatlari', 'Olta Aparatları', 'Silikon yemleri offset, drop shot veya Carolina rig sistemine bağlamak için kullanılan kılavuz aparatlar.', 'Jighead, drop shot ağırlık, Texas rig kurşun vb. kombinasyonlar.', 'Drop shot için 1-5 gr ağırlık ve 30-50 cm lider kullanımı standart bir başlangıç noktasıdır.', true)
ON CONFLICT (slug) DO NOTHING;

-- ==========================================
-- İZİNLER (Zaten ayarlıysa tekrar çalıştırabilirsin)
-- ==========================================
ALTER TABLE equipments ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='equipments' AND policyname='public_read_equip') THEN
    CREATE POLICY "public_read_equip" ON equipments FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='equipments' AND policyname='auth_write_equip') THEN
    CREATE POLICY "auth_write_equip" ON equipments FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END $$;
