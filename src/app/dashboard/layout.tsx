'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signout } from '../auth/actions'
import { DashboardNav } from './components/DashboardNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  return (
    <DashboardNav profile={profile}>
      {children}
    </DashboardNav>
  )
}
