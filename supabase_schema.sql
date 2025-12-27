-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  role text default 'leader', -- 'leader' or 'member'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Create trips table
create table public.trips (
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

-- Enable RLS for trips
alter table public.trips enable row level security;

create policy "Leaders can view their own trips." on public.trips
  for select using (auth.uid() = leader_id);

create policy "Leaders can insert their own trips." on public.trips
  for insert with check (auth.uid() = leader_id);

create policy "Leaders can update their own trips." on public.trips
  for update using (auth.uid() = leader_id);

create policy "Leaders can delete their own trips." on public.trips
  for delete using (auth.uid() = leader_id);

-- Optional: Trigger to automatically create profile on signup
-- This is the recommended way to handle profile creation
/*
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'leader');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
*/
