-- Add referral_code column to reservations table
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS referral_code VARCHAR(50);

-- Index for filtering reservations by referral code in the admin dashboard
CREATE INDEX IF NOT EXISTS idx_reservations_referral_code ON reservations(referral_code);

-- Seed the dynamic referral code option list.
-- Managed afterwards from the admin "Parameters" UI (key: referral_code_options).
INSERT INTO parameters (key, value, description, category) VALUES
  ('referral_code_options',
   'AMEL01,MUTHI02,DITHA03,SANIA04,LAILATUL05,CHAIRUNNISA06,CAHYA07,PRAKAS08,RYAN09,SAEFUL10,SATRIO11,WAHYU12,BILI13',
   'Available referral code options',
   'reservation')
ON CONFLICT (key) DO NOTHING;
