-- Allow anonymous users to insert into members table (for Joining a Trip)
-- This is required because travelers are not authenticated users in the traditional sense
create policy "Allow public insert to members"
on members for insert
with check (true);

-- Allow anonymous users to view members if they have the trip_id? 
-- Actually, we don't need them to view *all* members, just maybe their own or if they have a cookie.
-- But for "Join", we just need INSERT.

-- Also, allow anonymous to Select trips (to verify trip exists)
create policy "Allow public read access to trips"
on trips for select
using (true);
