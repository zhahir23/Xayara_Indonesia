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
  merek VARCHAR(100) NOT NULL,
  merek_lainnya VARCHAR(255),
  total_unit INTEGER NOT NULL,
  pk VARCHAR(20) NOT NULL,
  pk_lainnya VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_reservations_email ON reservations(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);

-- Create index on tanggal for date-based queries
CREATE INDEX IF NOT EXISTS idx_reservations_tanggal ON reservations(tanggal);

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
