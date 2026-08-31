-- Add kebutuhan_catatan column to reservations table
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS kebutuhan_catatan TEXT;
