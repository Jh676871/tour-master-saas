-- Allow public insert on members (for Join Trip)
drop policy if exists "Allow public insert members" on public.members;
create policy "Allow public insert members" on public.members for insert with check (true);

-- Allow public read on trips (for Passenger View)
drop policy if exists "Allow public read trips" on public.trips;
create policy "Allow public read trips" on public.trips for select using (true);

-- Allow public read on trip_days
drop policy if exists "Allow public read trip_days" on public.trip_days;
create policy "Allow public read trip_days" on public.trip_days for select using (true);

-- Allow public read on trip_day_attractions
drop policy if exists "Allow public read trip_day_attractions" on public.trip_day_attractions;
create policy "Allow public read trip_day_attractions" on public.trip_day_attractions for select using (true);

-- Allow public read on attractions
drop policy if exists "Allow public read attractions" on public.attractions;
create policy "Allow public read attractions" on public.attractions for select using (true);

-- Allow public read on hotels
drop policy if exists "Allow public read hotels" on public.hotels;
create policy "Allow public read hotels" on public.hotels for select using (true);

-- Allow public read on members (so passengers can see their own name if needed, or we just rely on cookie)
-- For now, let's allow public read on members too to be safe for the UI fetching
drop policy if exists "Allow public read members" on public.members;
create policy "Allow public read members" on public.members for select using (true);
