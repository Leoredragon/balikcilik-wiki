-- monthly_yield tablosu
-- Her balık için 12 aylık verim puanı (0-100)

CREATE TABLE IF NOT EXISTS monthly_yield (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  fish_id     uuid REFERENCES fish(id) ON DELETE CASCADE NOT NULL,
  month       smallint NOT NULL CHECK (month BETWEEN 1 AND 12),
  yield_score smallint NOT NULL DEFAULT 0 CHECK (yield_score BETWEEN 0 AND 100),
  created_at  timestamptz DEFAULT now(),
  UNIQUE(fish_id, month)
);

-- RLS
ALTER TABLE monthly_yield ENABLE ROW LEVEL SECURITY;
CREATE POLICY "monthly_yield_public_read" ON monthly_yield FOR SELECT TO anon USING (true);
CREATE POLICY "monthly_yield_auth_all"   ON monthly_yield FOR ALL TO authenticated USING (true);

-- Hızlı sorgular için index
CREATE INDEX IF NOT EXISTS monthly_yield_month_idx ON monthly_yield(month);
CREATE INDEX IF NOT EXISTS monthly_yield_fish_idx  ON monthly_yield(fish_id);

-- ÖN TANIMLI VERİLER (popüler türler için)
-- Önce fish tablosundan id'leri kullanarak ekleyebilirsiniz.
-- Bu sorgu, slug üzerinden eşleşerek verileri ekler.

DO $$
DECLARE
  v_id uuid;
BEGIN
  -- SAZAN
  SELECT id INTO v_id FROM fish WHERE slug = 'sazan' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO monthly_yield (fish_id, month, yield_score) VALUES
      (v_id,1,20),(v_id,2,20),(v_id,3,40),(v_id,4,70),(v_id,5,90),
      (v_id,6,70),(v_id,7,50),(v_id,8,50),(v_id,9,80),(v_id,10,90),
      (v_id,11,60),(v_id,12,30)
    ON CONFLICT (fish_id, month) DO NOTHING;
  END IF;

  -- LEVREK
  SELECT id INTO v_id FROM fish WHERE slug = 'levrek' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO monthly_yield (fish_id, month, yield_score) VALUES
      (v_id,1,50),(v_id,2,50),(v_id,3,70),(v_id,4,80),(v_id,5,70),
      (v_id,6,60),(v_id,7,50),(v_id,8,50),(v_id,9,70),(v_id,10,90),
      (v_id,11,90),(v_id,12,60)
    ON CONFLICT (fish_id, month) DO NOTHING;
  END IF;

  -- LÜFER
  SELECT id INTO v_id FROM fish WHERE slug = 'lufer' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO monthly_yield (fish_id, month, yield_score) VALUES
      (v_id,1,20),(v_id,2,10),(v_id,3,10),(v_id,4,10),(v_id,5,20),
      (v_id,6,30),(v_id,7,40),(v_id,8,60),(v_id,9,80),(v_id,10,100),
      (v_id,11,90),(v_id,12,40)
    ON CONFLICT (fish_id, month) DO NOTHING;
  END IF;

  -- PALAMUT
  SELECT id INTO v_id FROM fish WHERE slug = 'palamut' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO monthly_yield (fish_id, month, yield_score) VALUES
      (v_id,1,10),(v_id,2,10),(v_id,3,10),(v_id,4,10),(v_id,5,10),
      (v_id,6,20),(v_id,7,40),(v_id,8,70),(v_id,9,90),(v_id,10,100),
      (v_id,11,60),(v_id,12,20)
    ON CONFLICT (fish_id, month) DO NOTHING;
  END IF;

  -- ALABALIK
  SELECT id INTO v_id FROM fish WHERE slug = 'alabalik' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO monthly_yield (fish_id, month, yield_score) VALUES
      (v_id,1,40),(v_id,2,60),(v_id,3,90),(v_id,4,100),(v_id,5,80),
      (v_id,6,50),(v_id,7,30),(v_id,8,30),(v_id,9,60),(v_id,10,80),
      (v_id,11,90),(v_id,12,60)
    ON CONFLICT (fish_id, month) DO NOTHING;
  END IF;
END $$;
