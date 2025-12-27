-- Add meeting_location to trip_days
ALTER TABLE trip_days ADD COLUMN IF NOT EXISTS meeting_location TEXT;
