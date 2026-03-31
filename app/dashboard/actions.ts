'use server'

import { createClient } from '@/utils/supabase/server'
import type { LeadStatus } from '@/types/supabase'

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', leadId)
  if (error) throw new Error(error.message)
}
