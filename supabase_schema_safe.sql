-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Drop existing tables if you want to start fresh (Optional, be careful with data loss)
-- drop table if exists public.trips;
-- drop table if exists public.profiles;

-- Create profiles table if it doesn't exist
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  role text default 'leader', -- 'leader' or 'member'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles (Idempotent)
alter table public.profiles enable row level security;

-- Create policies only if they don't exist (using a DO block to avoid errors)
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Public profiles are viewable by everyone.') then
        create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can insert their own profile.') then
        create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can update own profile.') then
        create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);
    end if;
end
$$;

-- Create trips table if it doesn't exist
create table if not exists public.trips (
  id uuid default uuid_generate_v4() primary key,
  leader_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  start_date date,
  end_date date,
  description text,
  status text default 'draft', -- 'draft', 'published', 'completed'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for trips (Idempotent)
alter table public.trips enable row level security;

-- Create policies for trips only if they don't exist
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'trips' and policyname = 'Leaders can view their own trips.') then
        create policy "Leaders can view their own trips." on public.trips for select using (auth.uid() = leader_id);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'trips' and policyname = 'Leaders can insert their own trips.') then
        create policy "Leaders can insert their own trips." on public.trips for insert with check (auth.uid() = leader_id);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'trips' and policyname = 'Leaders can update their own trips.') then
        create policy "Leaders can update their own trips." on public.trips for update using (auth.uid() = leader_id);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'trips' and policyname = 'Leaders can delete their own trips.') then
        create policy "Leaders can delete their own trips." on public.trips for delete using (auth.uid() = leader_id);
    end if;
end
$$;
