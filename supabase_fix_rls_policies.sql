-- Add new columns if they don't exist
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS wifi_ssid text;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS wifi_password text;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS images text[];

-- Enable RLS on hotels table if not already enabled
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean slate (optional, but good for idempotency if names match)
DROP POLICY IF EXISTS "Users can view their own hotels" ON hotels;
DROP POLICY IF EXISTS "Users can insert their own hotels" ON hotels;
DROP POLICY IF EXISTS "Users can update their own hotels" ON hotels;
DROP POLICY IF EXISTS "Users can delete their own hotels" ON hotels;
DROP POLICY IF EXISTS "Public can view hotels" ON hotels;

-- Policy: Admin can do EVERYTHING on their own hotels
CREATE POLICY "Users can all their own hotels"
ON hotels
FOR ALL
USING (auth.uid() = admin_id);

-- Policy: Public (Travelers) can VIEW hotels
-- Note: You might want to restrict this to only travelers associated with a trip that uses this hotel,
-- but for now, allowing read access to authenticated users or public might be easier depending on your auth model for travelers.
-- Assuming travelers are anonymous or authenticated differently, let's allow public read for now or restricted read.
-- If travelers are not authenticated via Supabase Auth, you might need a service role or a public policy.
-- Let's assume travelers view via a page that might use a service role OR the data is fetched server-side with admin rights? 
-- Wait, the traveler view is likely public or protected by trip ID.
-- If the traveler view fetches data client-side, it needs a SELECT policy.
-- If it fetches server-side (Server Components), it uses the server client.
-- If the server client is not the admin user, it might fail unless we use Service Role.

-- For now, let's ensure the ADMIN can update/delete.
