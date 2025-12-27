-- Enable RLS on trip_days table
ALTER TABLE trip_days ENABLE ROW LEVEL SECURITY;

-- Allow admin (trip leader) to update trip_days
-- This requires checking the 'trips' table to see if the user is the leader of the trip linked to the day.

CREATE POLICY "Users can update trip_days of their own trips"
ON trip_days
FOR UPDATE
USING (
  trip_id IN (
    SELECT id FROM trips WHERE leader_id = auth.uid()
  )
);

CREATE POLICY "Users can insert trip_days of their own trips"
ON trip_days
FOR INSERT
WITH CHECK (
  trip_id IN (
    SELECT id FROM trips WHERE leader_id = auth.uid()
  )
);

CREATE POLICY "Users can delete trip_days of their own trips"
ON trip_days
FOR DELETE
USING (
  trip_id IN (
    SELECT id FROM trips WHERE leader_id = auth.uid()
  )
);

CREATE POLICY "Users can view trip_days of their own trips"
ON trip_days
FOR SELECT
USING (
  trip_id IN (
    SELECT id FROM trips WHERE leader_id = auth.uid()
  )
);

-- Also fix trip_day_attractions RLS
ALTER TABLE trip_day_attractions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage trip_day_attractions of their own trips"
ON trip_day_attractions
FOR ALL
USING (
  trip_day_id IN (
    SELECT td.id 
    FROM trip_days td
    JOIN trips t ON t.id = td.trip_id
    WHERE t.leader_id = auth.uid()
  )
);

-- Also ensure 'trips' table allows updates by leader
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leaders can manage their own trips"
ON trips
FOR ALL
USING (leader_id = auth.uid());
