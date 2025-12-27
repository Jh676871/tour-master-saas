-- Fix missing columns and backfill data

-- 1. Ensure profiles table has email column
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'email') then
        alter table public.profiles add column email text;
    end if;
end $$;

-- 2. Ensure trips table has code column
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'trips' and column_name = 'code') then
        alter table public.trips add column code text;
    end if;
end $$;

-- 3. Backfill profiles from auth.users
-- This will insert missing profiles for existing users
insert into public.profiles (id, email, full_name, role)
select 
    id, 
    email, 
    coalesce(raw_user_meta_data->>'full_name', email), 
    'leader'
from auth.users
on conflict (id) do update 
set email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name);
