-- Trip Details Schema

-- 1. Trip Days (Itinerary)
create table if not exists public.trip_days (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  day_date date not null,
  day_number integer not null,
  hotel_id uuid references public.hotels(id) on delete set null,
  meeting_time text,
  morning_call_time text,
  summary text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(trip_id, day_date)
);

-- 2. Trip Day Attractions (Junction table)
create table if not exists public.trip_day_attractions (
  id uuid default uuid_generate_v4() primary key,
  trip_day_id uuid references public.trip_days(id) on delete cascade not null,
  attraction_id uuid references public.attractions(id) on delete cascade not null,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Members (Passengers)
create table if not exists public.members (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  name text not null,
  phone text,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Room Assignments
create table if not exists public.room_assignments (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  member_id uuid references public.members(id) on delete cascade not null,
  day_date date not null,
  room_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(member_id, day_date)
);

-- Enable RLS
alter table public.trip_days enable row level security;
alter table public.trip_day_attractions enable row level security;
alter table public.members enable row level security;
alter table public.room_assignments enable row level security;

-- Policies (Assuming leaders can access everything linked to their trips)
-- We need to join with trips to check leader_id. 
-- For simplicity in RLS performance, we often trust the application logic or use a function, 
-- but here we will use a subquery approach which is standard.

-- Trip Days Policies
create policy "Leaders can view trip days" on public.trip_days for select using (
  exists (select 1 from public.trips where trips.id = trip_days.trip_id and trips.leader_id = auth.uid())
);
create policy "Leaders can manage trip days" on public.trip_days for all using (
  exists (select 1 from public.trips where trips.id = trip_days.trip_id and trips.leader_id = auth.uid())
);

-- Trip Day Attractions Policies
create policy "Leaders can view trip day attractions" on public.trip_day_attractions for select using (
  exists (select 1 from public.trip_days join public.trips on trip_days.trip_id = trips.id where trip_days.id = trip_day_attractions.trip_day_id and trips.leader_id = auth.uid())
);
create policy "Leaders can manage trip day attractions" on public.trip_day_attractions for all using (
  exists (select 1 from public.trip_days join public.trips on trip_days.trip_id = trips.id where trip_days.id = trip_day_attractions.trip_day_id and trips.leader_id = auth.uid())
);

-- Members Policies
create policy "Leaders can view members" on public.members for select using (
  exists (select 1 from public.trips where trips.id = members.trip_id and trips.leader_id = auth.uid())
);
create policy "Leaders can manage members" on public.members for all using (
  exists (select 1 from public.trips where trips.id = members.trip_id and trips.leader_id = auth.uid())
);

-- Room Assignments Policies
create policy "Leaders can view room assignments" on public.room_assignments for select using (
  exists (select 1 from public.trips where trips.id = room_assignments.trip_id and trips.leader_id = auth.uid())
);
create policy "Leaders can manage room assignments" on public.room_assignments for all using (
  exists (select 1 from public.trips where trips.id = room_assignments.trip_id and trips.leader_id = auth.uid())
);
