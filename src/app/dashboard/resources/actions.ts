'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function createHotel(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: '未登入' }
  }

  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const phone = formData.get('phone') as string
  const wifi = formData.get('wifi') === 'on'

  if (!name) {
    return { error: '飯店名稱為必填' }
  }

  // Use Service Role to bypass RLS for insert
  // This is safe because we verified the user above
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Fallback if key missing (though likely to fail RLS again if so)
  )

  const { error } = await supabaseAdmin.from('hotels').insert({
    admin_id: user.id,
    name,
    address,
    phone,
    wifi,
  })

  if (error) {
    console.error('Create hotel error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/resources')
  return { success: true }
}

export async function createAttraction(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: '未登入' }
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string

  if (!name) {
    return { error: '景點名稱為必填' }
  }

  // Use Service Role to bypass RLS for insert
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { error } = await supabaseAdmin.from('attractions').insert({
    admin_id: user.id,
    name,
    description,
  })

  if (error) {
    console.error('Create attraction error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/resources')
  return { success: true }
}
