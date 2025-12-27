import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { TripClientView } from './components/TripClientView'

export default async function PassengerTripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const cookieStore = await cookies()

  // 1. Check Passenger Session
  const passengerCookie = cookieStore.get(`passenger_session_${id}`)
  let memberId = passengerCookie?.value
  let memberName = null

  if (memberId) {
    // 2. Fetch Member Info if cookie exists
    const { data: member } = await supabase
      .from('members')
      .select('id, name')
      .eq('id', memberId)
      .eq('trip_id', id)
      .single()
    
    if (member) {
      memberName = member.name
    } else {
      // Cookie invalid
      memberId = undefined
    }
  }

  // Redirect to Join if no session
  if (!memberId) {
    redirect(`/trip/${id}/join`)
  }

  // 3. Fetch Trip & Days
  const { data: trip } = await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .single()

  if (!trip) notFound()

  // Fetch Days with Attractions and Hotel
  const { data: days } = await supabase
    .from('trip_days')
    .select(`
      *,
      trip_day_attractions (
        id,
        visit_time,
        attractions (id, name, image_url, location_url, address)
      ),
      hotels (id, name, address, map_url, image_url, phone)
    `)
    .eq('trip_id', id)
    .order('day_number', { ascending: true })

  // 4. Fetch Broadcasts (Safely)
  let latestBroadcast = null
  try {
    const { data, error } = await supabase
      .from('broadcasts')
      .select('message, created_at')
      .eq('trip_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    
    if (!error) {
      latestBroadcast = data
    }
  } catch (e) {
    console.error('Broadcasts fetch failed:', e)
  }

  // 5. Fetch Room Assignments
  const { data: assignments } = await supabase
    .from('room_assignments')
    .select('member_id, day_date, room_number')
    .eq('trip_id', id)

  // 6. Calculate "Today" Context
  const todayStr = new Date().toISOString().split('T')[0]
  const activeDay = days?.find((d: any) => d.day_date === todayStr) || days?.[0]
  
  // Find User's Room for Today
  let myAssignment = null
  let roommateNames: string[] = []

  if (memberId) {
    myAssignment = assignments?.find((a: any) => 
      a.member_id === memberId && a.day_date === (activeDay?.day_date || todayStr)
    )
    
    // Find roommates logic here if needed, but for now passing empty
  }

  return (
    <TripClientView
      tripId={id}
      tripTitle={trip.title}
      days={days || []}
      latestBroadcast={latestBroadcast}
      roomNumber={myAssignment?.room_number}
      roommates={roommateNames}
      assignments={assignments || []}
      memberName={memberName}
    />
  )
}
