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
