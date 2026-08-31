-- Add WhatsApp message status columns to reservations table
ALTER TABLE reservations 
ADD COLUMN IF NOT EXISTS whatsapp_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS whatsapp_sent_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS whatsapp_error TEXT;

-- Create index on whatsapp_sent for filtering failed messages
CREATE INDEX IF NOT EXISTS idx_reservations_whatsapp_sent ON reservations(whatsapp_sent);
