'use server'

import { createClient } from '@/utils/supabase/server'
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
  const wifi_ssid = formData.get('wifi_ssid') as string
  const wifi_password = formData.get('wifi_password') as string
  const imageFiles = formData.getAll('images') as File[]

  if (!name) {
    return { error: '飯店名稱為必填' }
  }

  // Upload Images
  const imageUrls: string[] = []
  
  if (imageFiles && imageFiles.length > 0) {
    for (const file of imageFiles) {
      if (file.size > 0 && file.name !== 'undefined') {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('hotel-images')
          .upload(fileName, file)

        if (uploadError) {
          console.error('Image upload error:', uploadError)
          // Continue with other images or fail? Let's continue but log it.
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('hotel-images')
            .getPublicUrl(fileName)
          imageUrls.push(publicUrl)
        }
      }
    }
  }

  // Use the authenticated client to perform the insert
  // RLS policies should allow authenticated users to create their own resources
  const { error } = await supabase.from('hotels').insert({
    admin_id: user.id,
    name,
    address,
    phone,
    wifi_ssid,
    wifi_password,
    images: imageUrls,
    // wifi column is deprecated or we can set it to true if wifi fields exist
    wifi: !!(wifi_ssid || wifi_password)
  })

  if (error) {
    console.error('Create hotel error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/resources')
  return { success: true }
}

export async function updateHotel(prevState: any, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '未登入' }

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const phone = formData.get('phone') as string
  const wifi_ssid = formData.get('wifi_ssid') as string
  const wifi_password = formData.get('wifi_password') as string
  
  const imageFiles = formData.getAll('images') as File[]
  const existingImagesJson = formData.get('existing_images') as string
  let existingImages: string[] = []
  try {
      existingImages = JSON.parse(existingImagesJson || '[]')
  } catch (e) {}

  if (!id) return { error: '缺少飯店 ID' }
  if (!name) return { error: '飯店名稱為必填' }

  // Upload New Images
  const newImageUrls: string[] = []
  if (imageFiles && imageFiles.length > 0) {
    for (const file of imageFiles) {
      if (file.size > 0 && file.name !== 'undefined') {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('hotel-images')
          .upload(fileName, file)

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('hotel-images')
            .getPublicUrl(fileName)
          newImageUrls.push(publicUrl)
        }
      }
    }
  }

  const finalImages = [...existingImages, ...newImageUrls]

  const { error } = await supabase.from('hotels')
    .update({
      name,
      address,
      phone,
      wifi_ssid,
      wifi_password,
      images: finalImages,
      wifi: !!(wifi_ssid || wifi_password),
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('admin_id', user.id)

  if (error) {
    console.error('Update hotel error:', error)
    return { error: `更新失敗: ${error.message}` }
  }

  revalidatePath('/dashboard/resources')
  return { success: true }
}

export async function deleteHotel(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '未登入' }

  console.log('Attempting to delete hotel:', id, 'User:', user.id)

  const { error } = await supabase.from('hotels')
    .delete()
    .eq('id', id)
    .eq('admin_id', user.id)

  if (error) {
    console.error('Delete hotel error:', error)
    return { error: `刪除失敗: ${error.message}` }
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

  // Use the authenticated client to perform the insert
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
