-- Comprehensive Schema Fix
-- This script ensures all required columns exist, regardless of the current table state.

-- 1. Ensure profiles table exists and has all columns
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add columns safely (idempotent)
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists role text default 'leader';

-- 2. Ensure trips table exists and has all columns
create table if not exists public.trips (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add columns safely
alter table public.trips add column if not exists leader_id uuid references public.profiles(id) on delete cascade;
alter table public.trips add column if not exists title text;
alter table public.trips add column if not exists start_date date;
alter table public.trips add column if not exists end_date date;
alter table public.trips add column if not exists description text;
alter table public.trips add column if not exists status text default 'draft';
alter table public.trips add column if not exists code text;

-- 3. Backfill profiles from auth.users
-- This ensures your current login user has a profile record
insert into public.profiles (id, email, full_name, role)
select 
    id, 
    email, 
    coalesce(raw_user_meta_data->>'full_name', email), 
    'leader'
from auth.users
on conflict (id) do update 
set email = excluded.email,
    role = coalesce(public.profiles.role, 'leader'),
    full_name = coalesce(public.profiles.full_name, excluded.full_name);
