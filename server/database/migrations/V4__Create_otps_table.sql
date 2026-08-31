-- Create OTPs table for admin login verification
CREATE TABLE IF NOT EXISTS otps (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'login',
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on phone for faster lookups
CREATE INDEX IF NOT EXISTS idx_otps_phone ON otps(phone);

-- Create index on expires_at for cleanup of expired OTPs
CREATE INDEX IF NOT EXISTS idx_otps_expires_at ON otps(expires_at);

-- Create index on used_at status
CREATE INDEX IF NOT EXISTS idx_otps_used_at ON otps(used_at);

-- Function to clean up expired OTPs (older than 1 hour)
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM otps WHERE expires_at < CURRENT_TIMESTAMP - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;