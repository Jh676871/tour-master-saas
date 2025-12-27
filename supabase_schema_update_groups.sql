-- Add code column to trips table if it doesn't exist
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'trips' and column_name = 'code') then
        alter table public.trips add column code text;
        -- Optional: Add a unique constraint if group code should be unique per system or per user
        -- alter table public.trips add constraint trips_code_unique unique (code);
    end if;
end $$;
