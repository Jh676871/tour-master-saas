-- Add Broadcasts table and enhance Attractions/Hotels for mobile experience

-- 1. Create Broadcasts table for Leader Notifications
create table if not exists public.broadcasts (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  sender_id uuid references public.profiles(id)
);

-- Enable RLS for broadcasts
alter table public.broadcasts enable row level security;

-- Policy: Public (Travelers) can read broadcasts for their trip
drop policy if exists "Allow public read broadcasts" on public.broadcasts;
create policy "Allow public read broadcasts" on public.broadcasts for select using (true);

-- Policy: Leaders can insert broadcasts
drop policy if exists "Leaders can insert broadcasts" on public.broadcasts;
create policy "Leaders can insert broadcasts" on public.broadcasts for insert with check (auth.uid() = sender_id);


-- 2. Enhance Attractions with Image and Location
alter table public.attractions add column if not exists image_url text;
alter table public.attractions add column if not exists location_url text; -- Google Maps link
alter table public.attractions add column if not exists address text;

-- 3. Enhance Hotels with Image and Map
alter table public.hotels add column if not exists image_url text;
alter table public.hotels add column if not exists map_url text;

-- 4. Trip Days might need an image too (e.g., cover image for the day)
alter table public.trip_days add column if not exists cover_image_url text;

-- 5. Add status to members
alter table public.members add column if not exists status text default 'joined';
