import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { TripDashboard } from './components/TripDashboard'
import { initializeTripDays } from './server-utils'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 1. Fetch Trip Basic Info
  const { data: trip } = await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .eq('leader_id', user.id)
    .single()

  if (!trip) notFound()

  // 2. Initialize Days (if needed)
  await initializeTripDays(id)

  // 3. Fetch Days with Relations
  const { data: days } = await supabase
    .from('trip_days')
    .select(`
      *,
      trip_day_attractions (
        id,
        attractions (id, name)
      )
    `)
    .eq('trip_id', id)
    .order('day_number', { ascending: true })

  // 4. Fetch Resources for Dropdowns
  const { data: hotels } = await supabase.from('hotels').select('*').eq('admin_id', user.id)
  const { data: attractions } = await supabase.from('attractions').select('*').eq('admin_id', user.id)

  // 5. Fetch Members & Assignments
  const { data: members } = await supabase.from('members').select('*').eq('trip_id', id).order('created_at')
  const { data: assignments } = await supabase.from('room_assignments').select('*').eq('trip_id', id)

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="mr-1 h-4 w-4" />
          返回團體列表
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{trip.title}</h1>
            <p className="text-muted-foreground">
              {trip.start_date} ~ {trip.end_date} | 代碼: {trip.code || '無'}
            </p>
          </div>
        </div>
      </div>

      <TripDashboard 
        tripId={id}
        trip={trip}
        days={days || []}
        members={members || []}
        assignments={assignments || []}
        hotels={hotels || []}
        attractions={attractions || []}
      />
    </div>
  )
}
