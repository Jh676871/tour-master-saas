import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ResourceTabs } from './components/ResourceTabs'
import { CreateHotelModal, CreateAttractionModal } from './components/CreateResourceModals'

export default async function ResourcesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 查詢 Hotels
  const { data: hotels } = await supabase
    .from('hotels')
    .select('*')
    .eq('admin_id', user.id)
    .order('created_at', { ascending: false })

  // 查詢 Attractions
  const { data: attractions } = await supabase
    .from('attractions')
    .select('*')
    .eq('admin_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">資源庫管理</h1>
      <ResourceTabs 
        hotels={hotels || []} 
        attractions={attractions || []}
        createHotelBtn={<CreateHotelModal />}
        createAttractionBtn={<CreateAttractionModal />}
      />
    </div>
  )
}
