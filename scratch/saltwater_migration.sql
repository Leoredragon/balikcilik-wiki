-- ============================================================
-- AVLAK WİKİ — KAPSAMLI GÜNCELLEME
-- Supabase Dashboard > SQL Editor > New Query > Çalıştır
-- ============================================================

-- 1. TASLAK BALIKLARI YAYINLA
UPDATE fish SET is_published = true WHERE is_published = false;

-- 2. MÜKERRERLERİ TEMİZLE
-- "Yayın Balığı" ve "Yayın" aynı → slug'ı farklı olanı sil
DELETE FROM fish WHERE slug = 'yayin-baligi';
-- "Eğrez (Mırmır)" → tatlısu Eğrez ile karışmasın, koru
-- "Karaburun" mükerrer → birini sil
DELETE FROM fish WHERE slug = 'karaburun-baligi';
-- "Kocaağız (Kesici)" → koru, Kocaağız farklı
-- "Kefal" (both) ve "Tatlısu Kefali" → ikisini koru (farklı)

-- 3. TUZLU SU KATEGORİLERİ EKLE
INSERT INTO categories (name_tr, slug, description) VALUES
('Çipuragiller', 'cipuragiller', 'Sparidae familyası. Çipura, karagöz, mercan, sinarit ve benzeri dip balıkları.'),
('Lüfergiller', 'lufergiller', 'Pomatomidae familyası. Lüfer, çinekop ve kofana bu familyadan sayılır.'),
('Uskumrugiller', 'uskumrugiller', 'Scombridae familyası. Palamut, torik, orkinos, uskumru ve kolyoz bu gruptadır.'),
('İstavritgiller', 'istavritgiller', 'Carangidae familyası. İstavrit, sarıkuyruk istavrit ve akya bu gruba girer.'),
('Tekirgiller', 'tekirgiller', 'Mullidae familyası. Tekir ve barbun bu gruptadır.'),
('Yassı Balıklar', 'yassi-baliklar', 'Pleuronectiformes. Dil balığı, kalkan ve pis balığı bu gruptadır.'),
('Köpek Balıkları', 'kopek-baliklari', 'Selachimorpha. Türkiye sularındaki köpek balığı türleri.'),
('Vatozlar', 'vatozlar', 'Batoidea. Türkiye sularındaki vatoz türleri.'),
('Hamsigiller', 'hamsigiller', 'Küçük pelajik balıklar. Hamsi, sardalya ve çaça bu gruptadır.'),
('Kabuklular ve Yumuşakçalar', 'kabuklular-yumusakcalar', 'Karides, kalamar, ahtapot, midye gibi deniz canlıları.'),
('Diğer Tuzlu Su', 'diger-tuzlu-su', 'Zargana, kaya balığı, kefal, kılıç balığı ve diğerleri.')
ON CONFLICT (slug) DO NOTHING;

-- 4. TUZLU SU BALIK EKLEMELERİ

-- Levrekgiller (slug: levrekgiller - zaten mevcut)
-- "Deniz Levregi" → slug'ını düzelt
UPDATE fish SET
  name_tr = 'Levrek', slug = 'levrek',
  name_latin = 'Dicentrarchus labrax',
  description = 'Türkiye''nin en değerli tuzlu su balıklarından. Predatör yapısıyla sportif balıkçılıkta büyük ilgi görür. Akdeniz, Ege ve Karadeniz kıyılarında yaygındır.',
  min_size_cm = 25,
  category_id = (SELECT id FROM categories WHERE slug = 'levrekgiller'),
  is_published = true
WHERE slug IN ('levrek', 'deniz-levregi');

-- Çipuragiller
INSERT INTO fish (name_tr, name_latin, slug, water_type, category_id, description, min_size_cm, is_published) VALUES
('Çipura', 'Sparus aurata', 'cipura', 'salt', (SELECT id FROM categories WHERE slug = 'cipuragiller'), 'Sparidae familyasının en tanınan üyesi. Altın renkli baş bandıyla kolayca tanınır. Akdeniz ve Ege kıyılarında yaygındır. Hem çiftlik hem doğal popülasyonu mevcuttur.', 20, true),
('Karagöz', 'Diplodus vulgaris', 'karagoz', 'salt', (SELECT id FROM categories WHERE slug = 'cipuragiller'), 'Kaya ve kumtaşı diplerinde yaşayan, karidesle beslenmeyi tercih eden orta boy tuzlu su balığı.', 18, true),
('Sargoz', 'Diplodus sargus', 'sargoz', 'salt', (SELECT id FROM categories WHERE slug = 'cipuragiller'), 'Kayalık diplerden beslenen, yerel adıyla "kır balığı" da denilen Sparidae üyesi.', 20, true),
('İsparoz', 'Diplodus annularis', 'isparoz', 'salt', (SELECT id FROM categories WHERE slug = 'cipuragiller'), 'Kuyruk dibindeki siyah halkayla tanınan küçük-orta boy Sparidae balığı. Akdeniz ve Ege''de çok yaygındır.', 15, true),
('Mercan', 'Pagellus erythrinus', 'mercan', 'salt', (SELECT id FROM categories WHERE slug = 'cipuragiller'), 'Kırmızımsı pembe rengiyle dikkat çeken Sparidae balığı. Özellikle Ege kıyılarında popüler.', 15, true),
('Sinarit', 'Dentex dentex', 'sinarit', 'salt', (SELECT id FROM categories WHERE slug = 'cipuragiller'), 'Sparidae familyasının iri predatör üyesi. 10 kg''ı aşabilen güçlü yapısıyla sportif balıkçıların gözdesi.', 30, true),
('Kırma Mercan', 'Pagellus bogaraveo', 'kirma-mercan', 'salt', (SELECT id FROM categories WHERE slug = 'cipuragiller'), 'Kırmızı Mercan olarak da bilinen, Mercan''a kıyasla daha iri ve derin sularda yaşayan Sparidae türü.', 18, true),
('Minekop', 'Lithognathus mormyrus', 'minekop', 'salt', (SELECT id FROM categories WHERE slug = 'cipuragiller'), 'Kumlu ve çamurlu diplerde yaşayan gümüşi zemin üzerinde koyu çizgili Sparidae balığı. Mırmır olarak da bilinir.', 15, true)
ON CONFLICT (slug) DO UPDATE SET is_published = true;

-- Lüfergiller
INSERT INTO fish (name_tr, name_latin, slug, water_type, category_id, description, min_size_cm, is_published) VALUES
('Lüfer', 'Pomatomus saltatrix', 'lufer', 'salt', (SELECT id FROM categories WHERE slug = 'lufergiller'), 'Türk balıkçılığının simgesi haline gelmiş predatör balık. İstanbul Boğazı göçleriyle ünlüdür. Boy ve yaşına göre çinekop, sarı kanat, lüfer, kofana olarak anılır.', 25, true),
('Çinekop', 'Pomatomus saltatrix (yavru)', 'cinekop', 'salt', (SELECT id FROM categories WHERE slug = 'lufergiller'), 'Lüferin 20 cm altındaki yavrusu. İlkbahar aylarında kıyılara yakın avlanır. Küçük boyuna rağmen çok lezzetlidir.', 0, true),
('Kofana', 'Pomatomus saltatrix (büyük)', 'kofana', 'salt', (SELECT id FROM categories WHERE slug = 'lufergiller'), 'Lüferin 50 cm üzerindeki büyük bireyi. Ekim-Kasım aylarında Karadeniz göçünde avlanır. Eti yağlı ve lezzetlidir.', 0, true)
ON CONFLICT (slug) DO UPDATE SET is_published = true;

-- Uskumrugiller
INSERT INTO fish (name_tr, name_latin, slug, water_type, category_id, description, min_size_cm, is_published) VALUES
('Palamut', 'Sarda sarda', 'palamut', 'salt', (SELECT id FROM categories WHERE slug = 'uskumrugiller'), 'Scombridae familyasından hızlı yüzücü bir predatör. Ağustos-Ekim arası yoğun göç döneminde avlanır. Spor balıkçıların en sevdiği tuzlu su türlerinden biridir.', 25, true),
('Torik', 'Thunnus thynnus (küçük)', 'torik', 'salt', (SELECT id FROM categories WHERE slug = 'uskumrugiller'), 'Orkinos''un 10 kg altındaki genç bireyinin Türkçe adı. Hızlı ve güçlü yapısıyla sportif balıkçılıkta çok popüler.', 30, true),
('Orkinos', 'Thunnus thynnus', 'orkinos', 'salt', (SELECT id FROM categories WHERE slug = 'uskumrugiller'), 'Dünyanın en büyük yüzgeçli balıklarından. 700 kg''a ulaşabilen devler. Türkiye sularında sınırlı miktarda ve kota ile avlanır.', 100, true),
('Uskumru', 'Scomber scombrus', 'uskumru', 'salt', (SELECT id FROM categories WHERE slug = 'uskumrugiller'), 'Kış aylarında göç eden pelajik balık. Yoğun göç dönemlerinde kıyıdan rahatlıkla avlanabilir. Omega-3 açısından çok zengindir.', 20, true),
('Kolyoz', 'Scomber japonicus', 'kolyoz', 'salt', (SELECT id FROM categories WHERE slug = 'uskumrugiller'), 'Uskumruya benzer fakat göbeği benekli olan türü. Akdeniz ve Ege''de yaygın, genellikle küçük yemlere düşer.', 18, true)
ON CONFLICT (slug) DO UPDATE SET is_published = true;

-- İstavritgiller
INSERT INTO fish (name_tr, name_latin, slug, water_type, category_id, description, min_size_cm, is_published) VALUES
('İstavrit', 'Trachurus trachurus', 'istavrit', 'salt', (SELECT id FROM categories WHERE slug = 'istavritgiller'), 'Türk sofralarının vazgeçilmezi. Büyük sürüler halinde göç eden pelajik balık. Hem yem hem hedef balık olarak kullanılır.', 13, true),
('Sarıkuyruk İstavrit', 'Trachurus mediterraneus', 'sarikuyruk-istavrit', 'salt', (SELECT id FROM categories WHERE slug = 'istavritgiller'), 'Normal istavritten biraz daha küçük ve sarımsı kuyruklu türü. Akdeniz''de daha yaygındır.', 12, true),
('Akya', 'Lichia amia', 'akya', 'salt', (SELECT id FROM categories WHERE slug = 'istavritgiller'), 'Carangidae familyasının iri predatör üyesi. 2 metreye ulaşabilen güçlü balık. Spin ve jig avcılığında harika mücadele sunar.', 40, true)
ON CONFLICT (slug) DO UPDATE SET is_published = true;

-- Tekirgiller
INSERT INTO fish (name_tr, name_latin, slug, water_type, category_id, description, min_size_cm, is_published) VALUES
('Tekir', 'Mullus barbatus', 'tekir', 'salt', (SELECT id FROM categories WHERE slug = 'tekirgiller'), 'Çamurlu ve kumlu diplerde bıyıklarıyla yiyecek arayan lezzetli Mullidae balığı. Özellikle Karadeniz''de çok yaygındır.', 13, true),
('Barbun', 'Mullus surmuletus', 'barbun', 'salt', (SELECT id FROM categories WHERE slug = 'tekirgiller'), 'Tekire benzer ancak kayalık ve algli dipleri tercih eden türü. Ege ve Akdeniz''de daha yaygındır. Gastronomi açısından çok değerli.', 13, true)
ON CONFLICT (slug) DO UPDATE SET is_published = true;

-- Kefalgiller (mevcut "kefalgiller" slug var)
INSERT INTO fish (name_tr, name_latin, slug, water_type, category_id, description, min_size_cm, is_published) VALUES
('Kefal', 'Mugil cephalus', 'kefal-tuzlu', 'salt', (SELECT id FROM categories WHERE slug = 'kefalgiller'), 'Tuzlu, tatlı ve acı sularda yaşayabilen euryhalin tür. Kıyı ve lagünlerde büyük sürüler halinde yaşar.', 20, true),
('Altınbaş Kefal', 'Chelon auratus', 'altinbas-kefal', 'salt', (SELECT id FROM categories WHERE slug = 'kefalgiller'), 'Baş kısmında altın leke bulunan Mugilidae türü. Kıyı ve haliçlerde yaygındır.', 18, true),
('Kalın Dudaklı Kefal', 'Chelon labrosus', 'kalin-dudakli-kefal', 'salt', (SELECT id FROM categories WHERE slug = 'kefalgiller'), 'Belirgin şişkin üst dudağıyla tanınan kefal türü. Temiz sularda ot ile beslenir.', 18, true)
ON CONFLICT (slug) DO UPDATE SET is_published = true;

-- Yassı Balıklar
INSERT INTO fish (name_tr, name_latin, slug, water_type, category_id, description, min_size_cm, is_published) VALUES
('Dil Balığı', 'Solea solea', 'dil-baligi', 'salt', (SELECT id FROM categories WHERE slug = 'yassi-baliklar'), 'Yassı ve uzun dil şeklindeki gövdesiyle tanınan dip balığı. Kum ve çamurlu yerlerde kamufle olarak yaşar. Gastronomide çok değerlidir.', 18, true),
('Kalkan', 'Scophthalmus maximus', 'kalkan', 'salt', (SELECT id FROM categories WHERE slug = 'yassi-baliklar'), 'Karadeniz''in en değerli balığı. 1 metreyi aşabilen büyük yassı balık. Sıkı yasal koruma altındadır. Boy limiti ve av yasağı uygulanır.', 45, true),
('Pis Balığı', 'Platichthys flesus', 'pis-baligi', 'salt', (SELECT id FROM categories WHERE slug = 'yassi-baliklar'), 'Hem tatlı hem tuzlu sulara uyum sağlayabilen yassı balık. Karadeniz nehir ağızlarında yaygındır.', 20, true)
ON CONFLICT (slug) DO UPDATE SET is_published = true;

-- Hamsigiller
INSERT INTO fish (name_tr, name_latin, slug, water_type, category_id, description, min_size_cm, is_published) VALUES
('Hamsi', 'Engraulis encrasicolus', 'hamsi', 'salt', (SELECT id FROM categories WHERE slug = 'hamsigiller'), 'Karadeniz''in simgesi. Kasım-Mart arası yoğun göç eden küçük pelajik balık. Türk mutfağının vazgeçilmezi ve Karadeniz ekonomisinin temeli.', 9, true),
('Sardalya', 'Sardina pilchardus', 'sardalya', 'salt', (SELECT id FROM categories WHERE slug = 'hamsigiller'), 'Akdeniz ve Ege''nin en yaygın küçük pelajik balığı. Izgara ve marinat olarak tüketilir. Yağlı ve besleyicidir.', 11, true),
('Çaça', 'Sprattus sprattus', 'caca', 'salt', (SELECT id FROM categories WHERE slug = 'hamsigiller'), 'Karadeniz''de yaygın küçük pelajik balık. Hamsiye benzer fakat daha küçük. Konserve ve tuzlama ile değerlendirilir.', 7, true)
ON CONFLICT (slug) DO UPDATE SET is_published = true;

-- Diğer Tuzlu Su
INSERT INTO fish (name_tr, name_latin, slug, water_type, category_id, description, min_size_cm, is_published) VALUES
('Zargana', 'Belone belone', 'zargana', 'salt', (SELECT id FROM categories WHERE slug = 'diger-tuzlu-su'), 'Yüzey balığı. Uzun ince gövdesi ve gagaya benzeyen uzun çene yapısıyla tanınır. Karadeniz''e kıyı yakınında olta ile avlanır.', 25, true),
('Eşkina', 'Sciaena umbra', 'eskina', 'salt', (SELECT id FROM categories WHERE slug = 'diger-tuzlu-su'), 'Karalı ve kayalık dipli sularda yaşayan Sciaenidae familyasından balık. Sesi ile bilinen gece balıkçılığı türü.', 20, true),
('Kırlangıç Balığı', 'Trigla lyra', 'kirlangic-baligi', 'salt', (SELECT id FROM categories WHERE slug = 'diger-tuzlu-su'), 'Büyük göğüs yüzgeçleriyle kırlangıç kanadına benzeyen dip balığı. Yayınladığı sesle tanınan ilginç bir tür.', 20, true),
('Kılıç Balığı', 'Xiphias gladius', 'kilic-baligi', 'salt', (SELECT id FROM categories WHERE slug = 'diger-tuzlu-su'), 'Sivri ve düz uzun gagasıyla tanınan büyük pelajik predatör. Nesli tehlike altında olduğundan sportif avcılıkta serbest bırakma önerilir.', 80, true),
('Lagos', 'Serranus cabrilla', 'lagos', 'salt', (SELECT id FROM categories WHERE slug = 'diger-tuzlu-su'), 'Kayalık ve posidonia çayırlı diplerinde yaşayan Serranidae balığı. Küçük jigler ve silikon yemlerle avlanır.', 12, true),
('Hani', 'Serranus hepatus', 'hani', 'salt', (SELECT id FROM categories WHERE slug = 'diger-tuzlu-su'), 'Serranidae familyasının küçük ve renkli üyesi. Kayalık diplerde yaşar, iyi bir hedef balık değildir ama sıkça oltaya düşer.', 10, true)
ON CONFLICT (slug) DO UPDATE SET is_published = true;

-- Kabuklular
INSERT INTO fish (name_tr, name_latin, slug, water_type, category_id, description, min_size_cm, is_published) VALUES
('Kalamar', 'Loligo vulgaris', 'kalamar', 'salt', (SELECT id FROM categories WHERE slug = 'kabuklular-yumusakcalar'), 'Yumuşakça. Zoka ile avlanan, gece ışıkla gelen pelajik tür. Hem sportif hem ticari önemi büyüktür.', 10, true),
('Ahtapot', 'Octopus vulgaris', 'ahtapot', 'salt', (SELECT id FROM categories WHERE slug = 'kabuklular-yumusakcalar'), 'Sekiz kollu yumuşakça. Ege ve Akdeniz kıyılarında kayalık diplerde yaşar. Geleneksel olta ile zor, tuzak ile kolay avlanır.', 0, true),
('Mürekkep Balığı', 'Sepia officinalis', 'murekkep-baligi', 'salt', (SELECT id FROM categories WHERE slug = 'kabuklular-yumusakcalar'), 'Kalamar ile akraba olan Sepiida. Sığ sularda kumlu dipler üzerinde yaşar. Zoka ile avlanır.', 0, true)
ON CONFLICT (slug) DO UPDATE SET is_published = true;

-- Köpek Balıkları
INSERT INTO fish (name_tr, name_latin, slug, water_type, category_id, description, min_size_cm, is_published) VALUES
('Katran Köpek Balığı', 'Squalus acanthias', 'katran-kopek-baligi', 'salt', (SELECT id FROM categories WHERE slug = 'kopek-baliklari'), 'Sırtında iki sivri diken taşıyan küçük köpek balığı. Karadeniz''de çok yaygındır. Türkiye''de tüketilen tek köpek balığı türüdür.', 30, true)
ON CONFLICT (slug) DO UPDATE SET is_published = true;

-- 5. MEVCUT KEFAL (both) KAYDI — tuzlu su kaydıyla çakışmasın diye slug düzelt
UPDATE fish SET slug = 'kefal-her-su', name_tr = 'Kefal (Tatlı ve Tuzlu Su)' WHERE slug = 'kefal';
