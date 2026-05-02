-- Varsa Supabase'in yarım ürettiği eski kısıtlamaları temizleyelim
DROP POLICY IF EXISTS "Resim Yukleme Izni orvatp_0" ON storage.objects;
DROP POLICY IF EXISTS "Resim Yukleme Izni orvatp_1" ON storage.objects;

-- 1. OKUMA İZNİ (Ziyaretçiler dahil herkes siteye girince resimleri görebilsin)
CREATE POLICY "Herkes Resimleri Gorebilir" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'fish-images');

-- 2. YÜKLEME İZNİ (Sadece giriş yapmış Admin yükleyebilsin)
CREATE POLICY "Admin Resim Yukleyebilir" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'fish-images');

-- 3. GÜNCELLEME İZNİ (İşte hata buradaydı! Upsert çalışması için ŞART)
CREATE POLICY "Admin Resim Guncelleyebilir" 
ON storage.objects FOR UPDATE TO authenticated 
USING (bucket_id = 'fish-images');

-- 4. SİLME İZNİ (İleride resmi kaldırmak istersen hata vermesin)
CREATE POLICY "Admin Resim Silebilir" 
ON storage.objects FOR DELETE TO authenticated 
USING (bucket_id = 'fish-images');
