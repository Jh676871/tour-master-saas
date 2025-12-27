'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function createHotel(prevState: any, formData: FormData) {
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

  const { error } = await supabase.from('hotels').insert({
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

  const { error } = await supabase.from('attractions').insert({
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
