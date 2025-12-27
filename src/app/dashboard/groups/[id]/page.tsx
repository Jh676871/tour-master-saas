import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { ItineraryView } from './components/ItineraryView'
import { RoomingTable } from './components/RoomingTable'
import { MemberManager } from './components/MemberManager'
import { initializeTripDays } from './actions'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const supabase = createServerClient(
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

      <div className="space-y-12">
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground border-l-4 border-primary pl-3">行程規劃</h2>
          <ItineraryView 
            days={days || []} 
            hotels={hotels || []} 
            attractions={attractions || []} 
          />
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground border-l-4 border-primary pl-3">旅客管理</h2>
          <MemberManager tripId={id} members={members || []} />
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground border-l-4 border-primary pl-3">分房表 (Rooming List)</h2>
          <RoomingTable 
            tripId={id}
            days={days || []}
            members={members || []}
            assignments={assignments || []}
          />
        </section>
      </div>
    </div>
  )
}
