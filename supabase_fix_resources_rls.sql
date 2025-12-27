-- Fix RLS for Hotels
alter table public.hotels enable row level security;

-- Policy for INSERT: Allow authenticated users to insert if they are the admin
drop policy if exists "Users can insert their own hotels" on public.hotels;
create policy "Users can insert their own hotels" on public.hotels for insert with check (auth.uid() = admin_id);

-- Policy for UPDATE: Allow authenticated users to update their own hotels
drop policy if exists "Users can update their own hotels" on public.hotels;
create policy "Users can update their own hotels" on public.hotels for update using (auth.uid() = admin_id);

-- Policy for DELETE: Allow authenticated users to delete their own hotels
drop policy if exists "Users can delete their own hotels" on public.hotels;
create policy "Users can delete their own hotels" on public.hotels for delete using (auth.uid() = admin_id);

-- Policy for SELECT: Allow users to see their own hotels (in Dashboard)
-- Note: We also have a public read policy for the "Passenger View", which is fine.
-- This policy ensures the Admin can definitely see them in the dashboard.
drop policy if exists "Users can select their own hotels" on public.hotels;
create policy "Users can select their own hotels" on public.hotels for select using (auth.uid() = admin_id);


-- Fix RLS for Attractions
alter table public.attractions enable row level security;

-- Policy for INSERT
drop policy if exists "Users can insert their own attractions" on public.attractions;
create policy "Users can insert their own attractions" on public.attractions for insert with check (auth.uid() = admin_id);

-- Policy for UPDATE
drop policy if exists "Users can update their own attractions" on public.attractions;
create policy "Users can update their own attractions" on public.attractions for update using (auth.uid() = admin_id);

-- Policy for DELETE
drop policy if exists "Users can delete their own attractions" on public.attractions;
create policy "Users can delete their own attractions" on public.attractions for delete using (auth.uid() = admin_id);

-- Policy for SELECT
drop policy if exists "Users can select their own attractions" on public.attractions;
create policy "Users can select their own attractions" on public.attractions for select using (auth.uid() = admin_id);
