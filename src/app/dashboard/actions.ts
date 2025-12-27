'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createGroup(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const code = formData.get('code') as string
  const start_date = formData.get('start_date') as string
  const end_date = formData.get('end_date') as string

  if (!title || !code || !start_date || !end_date) {
    return { error: '請填寫所有欄位' }
  }

  const { error } = await supabase.from('trips').insert({
    leader_id: user.id,
    title,
    code,
    start_date,
    end_date,
    status: 'draft',
  })

  if (error) {
    console.error('Create group error:', error)
    return { error: `建立團體失敗: ${error.message} (Code: ${error.code})` }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
