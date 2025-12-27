-- Enable Public Read Access for Hotels
DROP POLICY IF EXISTS "Public hotels are viewable by everyone" ON hotels;
CREATE POLICY "Public hotels are viewable by everyone"
ON hotels FOR SELECT
USING (true);

-- Enable Public Read Access for Trip Days
DROP POLICY IF EXISTS "Public trip_days are viewable by everyone" ON trip_days;
CREATE POLICY "Public trip_days are viewable by everyone"
ON trip_days FOR SELECT
USING (true);

-- Enable Public Read Access for Trip Day Attractions
DROP POLICY IF EXISTS "Public trip_day_attractions are viewable by everyone" ON trip_day_attractions;
CREATE POLICY "Public trip_day_attractions are viewable by everyone"
ON trip_day_attractions FOR SELECT
USING (true);

-- Enable Public Read Access for Attractions
DROP POLICY IF EXISTS "Public attractions are viewable by everyone" ON attractions;
CREATE POLICY "Public attractions are viewable by everyone"
ON attractions FOR SELECT
USING (true);

-- Ensure meeting_location column exists (in case previous script wasn't run)
ALTER TABLE trip_days ADD COLUMN IF NOT EXISTS meeting_location TEXT;
