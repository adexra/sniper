import { createClient } from '@/utils/supabase/server'
import type { Lead } from '@/types/supabase'
import { DashboardClient } from './dashboard-client'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  return <DashboardClient initialLeads={(leads ?? []) as Lead[]} />
}
