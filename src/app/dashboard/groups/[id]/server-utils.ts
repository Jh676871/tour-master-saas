import { createClient } from '@/utils/supabase/server'

// Initialize Trip Days based on start/end date
// This is a pure server-side utility, not a Server Action
export async function initializeTripDays(tripId: string) {
  try {
    const supabase = await createClient()
    
    // Get trip dates
    const { data: trip } = await supabase.from('trips').select('*').eq('id', tripId).single()
    if (!trip || !trip.start_date || !trip.end_date) return

    const startDate = new Date(trip.start_date)
    const endDate = new Date(trip.end_date)
    
    // Calculate days
    const days = []
    let currentDate = new Date(startDate)
    let dayNum = 1
    
    while (currentDate <= endDate) {
      days.push({
        trip_id: tripId,
        day_date: currentDate.toISOString().split('T')[0],
        day_number: dayNum,
      })
      currentDate.setDate(currentDate.getDate() + 1)
      dayNum++
    }
    
    // Upsert days (ignore if exists)
    if (days.length > 0) {
      const { error } = await supabase.from('trip_days').upsert(days, { onConflict: 'trip_id,day_date', ignoreDuplicates: true })
      if (error) {
        console.error('Error initializing trip days:', error)
      }
    }
  } catch (error) {
    console.error('Unexpected error in initializeTripDays:', error)
  }
}
