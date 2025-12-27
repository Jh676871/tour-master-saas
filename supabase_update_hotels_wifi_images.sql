-- Add new columns to hotels table
alter table public.hotels 
add column if not exists wifi_ssid text,
add column if not exists wifi_password text,
add column if not exists images text[]; -- Array of image URLs

-- Create storage bucket for hotel images if it doesn't exist
insert into storage.buckets (id, name, public) 
values ('hotel-images', 'hotel-images', true) 
on conflict (id) do nothing;

-- Storage Policies for hotel-images bucket

-- Allow public access to view images
drop policy if exists "Public can view hotel images" on storage.objects;
create policy "Public can view hotel images" 
on storage.objects for select 
using (bucket_id = 'hotel-images');

-- Allow authenticated users (admins) to upload images
drop policy if exists "Authenticated users can upload hotel images" on storage.objects;
create policy "Authenticated users can upload hotel images" 
on storage.objects for insert 
with check (
  bucket_id = 'hotel-images' 
  and auth.role() = 'authenticated'
);

-- Allow authenticated users to update/delete their images (optional but good)
drop policy if exists "Authenticated users can update hotel images" on storage.objects;
create policy "Authenticated users can update hotel images" 
on storage.objects for update
using (
  bucket_id = 'hotel-images' 
  and auth.role() = 'authenticated'
);

drop policy if exists "Authenticated users can delete hotel images" on storage.objects;
create policy "Authenticated users can delete hotel images" 
on storage.objects for delete
using (
  bucket_id = 'hotel-images' 
  and auth.role() = 'authenticated'
);
