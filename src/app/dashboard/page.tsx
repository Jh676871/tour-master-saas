import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signout } from '../auth/actions'
import { PlusCircle, LogOut } from 'lucide-react'
import { CreateGroupModal } from './components/CreateGroupModal'
import { GroupCard } from './components/GroupCard'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 查詢 profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 查詢團體 (trips)
  const { data: trips } = await supabase
    .from('trips')
    .select('*')
    .eq('leader_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <>
      {trips && trips.length > 0 ? (
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">我的團體</h1>
            <CreateGroupModal />
          </div>
          {/* 團體列表 */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trips.map((trip) => (
                <GroupCard key={trip.id} trip={trip} />
              ))}
          </div>
        </div>
      ) : (
        <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center">
          <div className="rounded-full bg-secondary p-4">
            <PlusCircle className="h-10 w-10 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">您目前還沒有團體</h3>
          <p className="mt-2 text-sm text-muted-foreground">開始建立您的第一個團體，輕鬆管理行程與旅客。</p>
          <CreateGroupModal trigger={
              <button className="mt-6 flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                開始建立一個吧！
              </button>
          } />
        </div>
      )}
    </>
  )
}
