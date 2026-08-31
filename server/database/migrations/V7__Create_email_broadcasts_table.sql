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
