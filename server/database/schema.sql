-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  booking_id VARCHAR(5) PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  alamat TEXT NOT NULL,
  telepon VARCHAR(20) NOT NULL,
  tanggal DATE NOT NULL,
  kebutuhan VARCHAR(100) NOT NULL,
  kebutuhan_lainnya VARCHAR(255),
  kebutuhan_catatan TEXT,
  merek VARCHAR(100) NOT NULL,
  merek_lainnya VARCHAR(255),
  total_unit INTEGER NOT NULL,
  pk VARCHAR(20) NOT NULL,
  pk_lainnya VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  google_maps_link TEXT,
  distance_km DECIMAL(10, 2),
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  whatsapp_sent_at TIMESTAMP,
  whatsapp_error TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_reservations_email ON reservations(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);

-- Create index on tanggal for date-based queries
CREATE INDEX IF NOT EXISTS idx_reservations_tanggal ON reservations(tanggal);

-- Create index on latitude and longitude for location-based queries
CREATE INDEX IF NOT EXISTS idx_reservations_location ON reservations(latitude, longitude);

-- Create index on whatsapp_sent for filtering failed messages
CREATE INDEX IF NOT EXISTS idx_reservations_whatsapp_sent ON reservations(whatsapp_sent);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_reservations_updated_at ON reservations;
CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

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

-- Create daily_quotas table for date-specific quota management
CREATE TABLE IF NOT EXISTS daily_quotas (
  id SERIAL PRIMARY KEY,
  tanggal DATE NOT NULL UNIQUE,
  quota_limit INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on tanggal for faster lookups
CREATE INDEX IF NOT EXISTS idx_daily_quotas_tanggal ON daily_quotas(tanggal);

-- Function to update updated_at timestamp for daily_quotas
CREATE OR REPLACE FUNCTION update_daily_quotas_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at for daily_quotas
DROP TRIGGER IF EXISTS update_daily_quotas_updated_at ON daily_quotas;
CREATE TRIGGER update_daily_quotas_updated_at
  BEFORE UPDATE ON daily_quotas
  FOR EACH ROW
  EXECUTE FUNCTION update_daily_quotas_updated_at_column();

-- Create email_broadcasts table for tracking promotional email campaigns
CREATE TABLE IF NOT EXISTS email_broadcasts (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sending', 'completed', 'failed')),
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  sent_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_email_broadcasts_status ON email_broadcasts(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_email_broadcasts_created_at ON email_broadcasts(created_at);

-- Function to update updated_at timestamp for email_broadcasts
CREATE OR REPLACE FUNCTION update_email_broadcasts_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at for email_broadcasts
DROP TRIGGER IF EXISTS update_email_broadcasts_updated_at ON email_broadcasts;
CREATE TRIGGER update_email_broadcasts_updated_at
  BEFORE UPDATE ON email_broadcasts
  FOR EACH ROW
  EXECUTE FUNCTION update_email_broadcasts_updated_at_column();

-- Create email_broadcast_recipients table to track individual recipient status
CREATE TABLE IF NOT EXISTS email_broadcast_recipients (
  id SERIAL PRIMARY KEY,
  broadcast_id INTEGER NOT NULL REFERENCES email_broadcasts(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  nama VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  message_id VARCHAR(255),
  error_message TEXT,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(broadcast_id, email)
);

-- Create index on broadcast_id for filtering
CREATE INDEX IF NOT EXISTS idx_email_broadcast_recipients_broadcast_id ON email_broadcast_recipients(broadcast_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_email_broadcast_recipients_status ON email_broadcast_recipients(status);

-- Create index on email for deduplication across broadcasts
CREATE INDEX IF NOT EXISTS idx_email_broadcast_recipients_email ON email_broadcast_recipients(email);

-- Function to update updated_at timestamp for email_broadcast_recipients
CREATE OR REPLACE FUNCTION update_email_broadcast_recipients_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at for email_broadcast_recipients
DROP TRIGGER IF EXISTS update_email_broadcast_recipients_updated_at ON email_broadcast_recipients;
CREATE TRIGGER update_email_broadcast_recipients_updated_at
  BEFORE UPDATE ON email_broadcast_recipients
  FOR EACH ROW
  EXECUTE FUNCTION update_email_broadcast_recipients_updated_at_column();

-- Create admins table for admin authentication
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- Function to update updated_at timestamp for admins
CREATE OR REPLACE FUNCTION update_admins_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at for admins
DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW
  EXECUTE FUNCTION update_admins_updated_at_column();
