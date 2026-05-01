-- ============================================================
-- AVLAK WİKİ — ALAN GENİŞLETME MİGRASYONU
-- Supabase Dashboard > SQL Editor > New Query > Çalıştır
-- ============================================================

-- 1. FISH TABLOSUNA YENİ ALANLAR
ALTER TABLE fish
  ADD COLUMN IF NOT EXISTS habitat TEXT,
  ADD COLUMN IF NOT EXISTS avg_weight_kg NUMERIC(6,2),
  ADD COLUMN IF NOT EXISTS max_size_cm INTEGER,
  ADD COLUMN IF NOT EXISTS fishing_tactics TEXT,
  ADD COLUMN IF NOT EXISTS recommended_baits TEXT,
  ADD COLUMN IF NOT EXISTS meat_quality TEXT;

-- 2. FISHING_METHODS TABLOSUNA YENİ ALANLAR
ALTER TABLE fishing_methods
  ADD COLUMN IF NOT EXISTS suitable_fish TEXT,
  ADD COLUMN IF NOT EXISTS best_season TEXT,
  ADD COLUMN IF NOT EXISTS step_by_step TEXT,
  ADD COLUMN IF NOT EXISTS common_mistakes TEXT;

-- 3. WIKI_ARTICLES TABLOSU OLUŞTUR
CREATE TABLE IF NOT EXISTS wiki_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  section TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content_main TEXT,
  content_2 TEXT,
  content_3 TEXT,
  content_4 TEXT,
  cover_image_url TEXT,
  region TEXT,
  coordinates TEXT,
  best_months TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. WIKI_ARTICLES GÜVENLİK POLİTİKALARI
ALTER TABLE wiki_articles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='wiki_articles' AND policyname='public_read_wiki') THEN
    CREATE POLICY "public_read_wiki" ON wiki_articles FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='wiki_articles' AND policyname='auth_write_wiki') THEN
    CREATE POLICY "auth_write_wiki" ON wiki_articles FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- 5. ÖRNEK AVLAK VERİLERİ
INSERT INTO wiki_articles (slug, section, title, subtitle, content_main, region, best_months, is_published) VALUES
('marmara-sapanca-golu', 'avlak', 'Sapanca Gölü', 'İzmit körfezi yakınlarında tatlı su cenneti', 'Sapanca Gölü Türkiye''nin en önemli su kaynaklarından biridir. Kızılgöz, sazan, yayın ve sudak türleri bolca bulunur. Kuzey kıyısı tekne ile avlanmaya uygundur.', 'Marmara', '4,5,9,10', true),
('marmara-iznik-golu', 'avlak', 'İznik Gölü', 'Türkiye''nin 5. büyük gölü, zengin balık çeşitliliği', 'İznik Gölü levrek, sazan, kızılgöz ve yayın balığı ile ünlüdür. Kıyı avlanması için ideal noktalar bulunmaktadır. Gölün güney sahilleri daha verimlidir.', 'Marmara', '3,4,5,9,10,11', true),
('ege-kucuk-menderes', 'avlak', 'Küçük Menderes Nehri', 'Ege''nin gözbebeği akarsu balıkçılığı', 'Küçük Menderes yayın ve sazan avcılığı için idealdir. Bahar aylarında su seviyesi yüksekken en verimli dönemdir.', 'Ege', '3,4,5', true),
('ic-anadolu-beysehir', 'avlak', 'Beyşehir Gölü', 'Türkiye''nin en büyük tatlı su gölü', 'Beyşehir Gölü zengin balık popülasyonuyla ünlüdür. Sazan, levrek ve diğer tatlı su balıkları için mükemmel bir nokta.', 'İç Anadolu', '4,5,6,9,10', true),
('karadeniz-uzungol', 'avlak', 'Uzungöl', 'Karadeniz''in efsanevi alabalık vadisi', 'Uzungöl ve çevresindeki dereler dağ alabalığı avcılığı için Türkiye''nin en ünlü noktaları arasındadır. Fly fishing tutkunlarının gözdesidir.', 'Karadeniz', '4,5,6,7,8,9', true),
('dogu-anadolu-cildir', 'avlak', 'Çıldır Gölü', 'Doğu Anadolu''nun buz tutan gölünde kış balıkçılığı', 'Çıldır Gölü kışın buz tuttuğunda buzaltı balıkçılığıyla meşhurdur. Sazan ve diğer tatlı su balıkları yoğundur.', 'Doğu Anadolu', '12,1,2,7,8', true)
ON CONFLICT (slug) DO NOTHING;

-- 6. ÖRNEK YASAL VERİLERİ
INSERT INTO wiki_articles (slug, section, title, content_main, is_published) VALUES
('yasal-boy-limitleri', 'yasal', 'Yasal Boy Limitleri', 'Levrek: 25 cm | Çipura: 20 cm | Lüfer: 25 cm | Palamut: 25 cm | Kefal: 20 cm | Dil Balığı: 18 cm | Kalkan: 45 cm | Sazan: 30 cm | Sudak: 30 cm | Yayın: 50 cm | Turna: 30 cm | Alabalık: 20 cm', true),
('av-yasaklari-uremedonemleri', 'yasal', 'Av Yasakları & Üreme Dönemleri', 'Genel tatlı su av yasağı Nisan-Haziran arası uygulanır. Bu dönemde balıkların üremesi korunmaktadır. Tuzlu suda hamsi yasağı genellikle Nisan-Ekim arası geçerlidir. Orfoz, Granyöz ve İstakoz tüm yıl boyunca avlanmaları yasaktır.', true),
('ruhsat-ve-izinler', 'yasal', 'Ruhsat ve İzin Gereklilikleri', 'Amatör balıkçılık için Tarım ve Orman Bakanlığı''ndan ruhsat alınması gerekmektedir. Ruhsat e-Devlet üzerinden çıkartılabilir. Yıllık ücret semboliktir. İç sularda bazı noktalarda belediye izni de aranabilir.', true)
ON CONFLICT (slug) DO NOTHING;

-- 7. ÖRNEK BAŞLANGIÇ REHBERİ
INSERT INTO wiki_articles (slug, section, title, subtitle, content_main, is_published) VALUES
('ilk-ekipman-secimi', 'baslangic', 'İlk Ekipmanını Nasıl Seçersin?', 'Bütçe dostu başlangıç paketi', 'Yeni başlayan biri için 500-1000 TL bütçeyle şu ekipman seti idealdir: Orta sertlikte 2.7-3m bir kamış, 2000-3000 beden bir makine, 0.20 mm misina, çeşitli iğne ve kurşun seti. Markayı önemsemeyin; önce tekniği öğrenin.', true),
('ilk-av-hazirlik', 'baslangic', 'İlk Ava Nasıl Hazırlanırsın?', 'Güvenlik, izin, hava ve ekipman', 'İlk avdan önce şunları yapın: 1) e-Devlet''ten amatör ruhsat alın 2) Hava durumunu kontrol edin 3) Gideceğiniz noktanın yasallığını öğrenin 4) Ekipmanınızı önceden test edin 5) En az iki kişiyle gidin.', true),
('en-kolay-baliklar', 'baslangic', 'En Kolay Yakalanan Balıklar', 'Yeni başlayanlar için ideal hedef türler', 'Yeni başlayanlar için en kolay türler: Kızılgöz (akar ve durgun sularda, ekmek yemine düşer), Çapak (göl kenarlarında bolca bulunur), İstavrit (tuzlu suda kıyıdan), Adi Sazan (sabırlı bekleyenler için). Bu balıklar teknik bilgi gerektirmez.', true)
ON CONFLICT (slug) DO NOTHING;
