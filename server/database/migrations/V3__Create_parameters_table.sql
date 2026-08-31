-- Create parameters table for dynamic configuration
CREATE TABLE IF NOT EXISTS parameters (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  category VARCHAR(50) DEFAULT 'general',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on key for faster lookups
CREATE INDEX IF NOT EXISTS idx_parameters_key ON parameters(key);

-- Insert default parameters
INSERT INTO parameters (key, value, description, category) VALUES
  ('daily_reservation_quota', '10', 'Maximum number of reservations per day', 'general'),
  ('kebutuhan_options', 'Perbaikan,Pemasangan Baru,Bongkar Pasang,Cuci AC,Tambah Freon,Perbaikan Kebocoran,Lainnya', 'Available kebutuhan options', 'reservation'),
  ('merek_options', 'Daikin,Panasonic,Sharp,LG,Samsung,Mitsubishi,Gree,Changhong,Lainnya', 'Available merek options', 'reservation'),
  ('pk_options', '0.5 PK,0.75 PK,1 PK,1.5 PK,2 PK,2.5 PK,3 PK,Lainnya', 'Available PK options', 'reservation')
ON CONFLICT (key) DO NOTHING;

-- Function to update updated_at timestamp for parameters
CREATE OR REPLACE FUNCTION update_parameters_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at for parameters
DROP TRIGGER IF EXISTS update_parameters_updated_at ON parameters;
CREATE TRIGGER update_parameters_updated_at
  BEFORE UPDATE ON parameters
  FOR EACH ROW
  EXECUTE FUNCTION update_parameters_updated_at_column();
