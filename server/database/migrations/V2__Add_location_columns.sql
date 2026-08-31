-- Add location columns to reservations table
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS google_maps_link TEXT;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS distance_km DECIMAL(10, 2);

-- Create index on latitude and longitude for location-based queries
CREATE INDEX IF NOT EXISTS idx_reservations_location ON reservations(latitude, longitude);
