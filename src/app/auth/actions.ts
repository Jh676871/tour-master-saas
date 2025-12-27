'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signup(prevState: { error: string }, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  if (!email || !password || !fullName) {
    return { error: '請填寫所有欄位' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // 自動在 profiles 表中建立資料
  // 注意：最佳實務是使用 Postgres Trigger，但為了確保符合需求，這邊也嘗試手動寫入
  // 如果已經有 Trigger，這段可能會失敗或重複，建議使用 Trigger。
  // 但由於我們無法控制 DB Trigger，這裡我們嘗試插入，如果 Trigger 存在並處理了，這裡可能會報錯 (Duplicate)，
  // 所以我們忽略插入錯誤，或者假設使用者會運行我們提供的 SQL。
  
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: email,
        full_name: fullName,
        role: 'leader', // 預設為領隊
      })
    
    if (profileError) {
      console.error('Profile creation error:', profileError)
      // 不阻擋註冊流程，但記錄錯誤
    }
  }

  redirect('/dashboard')
}

export async function login(prevState: { error: string }, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  await supabase.auth.signOut()
  redirect('/login')
}
