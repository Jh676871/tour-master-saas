'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )
}

// Initialize Trip Days based on start/end date
// Moved to server-utils.ts to avoid Server Action overhead in Server Component


// Update Day Info
export async function updateTripDay(dayId: string, formData: FormData) {
  const supabase = await getSupabase()
  const meeting_time = formData.get('meeting_time') as string
  const morning_call_time = formData.get('morning_call_time') as string
  const summary = formData.get('summary') as string
  const hotel_id = formData.get('hotel_id') as string

  await supabase.from('trip_days').update({
    meeting_time,
    morning_call_time,
    summary,
    hotel_id: hotel_id || null,
  }).eq('id', dayId)
  
  const { data: day } = await supabase.from('trip_days').select('trip_id').eq('id', dayId).single()
  if (day) {
    revalidatePath(`/dashboard/groups/${day.trip_id}`)
  }
}

// Add Attraction to Day
export async function addAttractionToDay(dayId: string, attractionId: string) {
  const supabase = await getSupabase()
  await supabase.from('trip_day_attractions').insert({
    trip_day_id: dayId,
    attraction_id: attractionId,
  })
  
  const { data: day } = await supabase.from('trip_days').select('trip_id').eq('id', dayId).single()
  if (day) {
    revalidatePath(`/dashboard/groups/${day.trip_id}`)
  }
}

// Remove Attraction from Day
export async function removeAttractionFromDay(linkId: string) {
  const supabase = await getSupabase()
  
  // Get trip_id before deleting to revalidate
  const { data: link } = await supabase.from('trip_day_attractions')
    .select('trip_days(trip_id)')
    .eq('id', linkId)
    .single()
    
  await supabase.from('trip_day_attractions').delete().eq('id', linkId)
  
  if (link && link.trip_days) {
    // @ts-ignore - Supabase type inference might be tricky with nested select
    const tripId = (link.trip_days as any).trip_id
    revalidatePath(`/dashboard/groups/${tripId}`)
  }
}

// Add Member
export async function addMember(tripId: string, name: string, phone?: string) {
  const supabase = await getSupabase()
  await supabase.from('members').insert({ trip_id: tripId, name, phone })
  revalidatePath(`/dashboard/groups/${tripId}`)
}

// Delete Member
export async function deleteMember(memberId: string, tripId: string) {
  const supabase = await getSupabase()
  await supabase.from('members').delete().eq('id', memberId)
  revalidatePath(`/dashboard/groups/${tripId}`)
}

// Update Room Assignment
export async function updateRoomAssignment(tripId: string, memberId: string, date: string, roomNumber: string) {
  const supabase = await getSupabase()
  
  if (!roomNumber) {
    // Delete if empty
    await supabase.from('room_assignments')
      .delete()
      .eq('member_id', memberId)
      .eq('day_date', date)
  } else {
    // Upsert
    await supabase.from('room_assignments').upsert({
      trip_id: tripId,
      member_id: memberId,
      day_date: date,
      room_number: roomNumber
    }, { onConflict: 'member_id,day_date' })
  }
  revalidatePath(`/dashboard/groups/${tripId}`)
}

// Send Room Notification
export async function sendRoomNotification(tripId: string, memberId: string) {
    // In a real app, this would integrate with LINE Notify, SMS, or Push Notification
    // For now, we'll just log it or maybe update a 'last_notified_at' field if we had one
    console.log(`Sending room notification to member ${memberId} for trip ${tripId}`)
    
    // Optional: Add a 'notifications' table log
    // await supabase.from('notifications').insert(...)
    
    return { success: true }
}
