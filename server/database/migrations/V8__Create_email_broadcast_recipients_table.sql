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
