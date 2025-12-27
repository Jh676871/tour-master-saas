-- Resources Management System Schema

-- 1. Create Hotels Table
create table if not exists public.hotels (
  id uuid default uuid_generate_v4() primary key,
  admin_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  address text,
  wifi boolean default false,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Attractions Table
create table if not exists public.attractions (
  id uuid default uuid_generate_v4() primary key,
  admin_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable RLS
alter table public.hotels enable row level security;
alter table public.attractions enable row level security;

-- 4. Create RLS Policies for Hotels
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'hotels' and policyname = 'Leaders can view their own hotels.') then
        create policy "Leaders can view their own hotels." on public.hotels for select using (auth.uid() = admin_id);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'hotels' and policyname = 'Leaders can insert their own hotels.') then
        create policy "Leaders can insert their own hotels." on public.hotels for insert with check (auth.uid() = admin_id);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'hotels' and policyname = 'Leaders can update their own hotels.') then
        create policy "Leaders can update their own hotels." on public.hotels for update using (auth.uid() = admin_id);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'hotels' and policyname = 'Leaders can delete their own hotels.') then
        create policy "Leaders can delete their own hotels." on public.hotels for delete using (auth.uid() = admin_id);
    end if;
end $$;

-- 5. Create RLS Policies for Attractions
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'attractions' and policyname = 'Leaders can view their own attractions.') then
        create policy "Leaders can view their own attractions." on public.attractions for select using (auth.uid() = admin_id);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'attractions' and policyname = 'Leaders can insert their own attractions.') then
        create policy "Leaders can insert their own attractions." on public.attractions for insert with check (auth.uid() = admin_id);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'attractions' and policyname = 'Leaders can update their own attractions.') then
        create policy "Leaders can update their own attractions." on public.attractions for update using (auth.uid() = admin_id);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'attractions' and policyname = 'Leaders can delete their own attractions.') then
        create policy "Leaders can delete their own attractions." on public.attractions for delete using (auth.uid() = admin_id);
    end if;
end $$;
