'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function joinTrip(tripId: string, formData: FormData) {
  const name = formData.get('name') as string
  if (!name) return

  const supabase = await createClient()
  const cookieStore = await cookies()

  // 1. Check if member already exists with this name (Simple matching)
  // In a real app, might want more robust auth, but for "One Click Join", name matching is common.
  let memberId: string | null = null

  const { data: existingMember } = await supabase
    .from('members')
    .select('id')
    .eq('trip_id', tripId)
    .eq('name', name)
    .maybeSingle()

  if (existingMember) {
    memberId = existingMember.id
  } else {
    // 2. Create new member
    const { data: newMember, error } = await supabase
      .from('members')
      .insert({
        trip_id: tripId,
        name: name,
        // status: 'joined' 
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error joining trip:', error)
      throw new Error('Failed to join trip')
    }
    memberId = newMember.id
  }

  // 3. Set Cookie (Long Lived)
  if (memberId) {
    cookieStore.set(`passenger_session_${tripId}`, memberId, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
  }

  return { success: true, memberId }
}

export async function restoreSession(tripId: string, memberId: string) {
  const cookieStore = await cookies()
  const supabase = await createClient()

  // Verify member exists
  const { data: member } = await supabase
    .from('members')
    .select('id')
    .eq('id', memberId)
    .eq('trip_id', tripId)
    .single()

  if (member) {
    cookieStore.set(`passenger_session_${tripId}`, memberId, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    return { success: true }
  }
  return { success: false }
}
