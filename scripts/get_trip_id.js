const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fxfwklkwuancrdihvevw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4ZndrbGt3dWFuY3JkaWh2ZXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NTYxMjUsImV4cCI6MjA4MjMzMjEyNX0.QslP2gRFY8s2tiwn20GJ13Jn6WBshB8XhjTU1WmCDnQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getTrip() {
  const { data, error } = await supabase
    .from('trips')
    .select('id')
    .limit(1);

  if (error) {
    console.error('Error fetching trips:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('TRIP_ID=' + data[0].id);
  } else {
    console.log('No trips found.');
  }
}

getTrip();
