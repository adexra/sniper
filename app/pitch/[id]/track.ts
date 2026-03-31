'use server'

import { createClient } from '@/utils/supabase/server'

export async function markAsPitched(leadId: string) {
  const supabase = await createClient()
  // Only move forward — don't overwrite 'closed' or 'lost'
  await supabase
    .from('leads')
    .update({ status: 'pitched' })
    .eq('id', leadId)
    .in('status', ['new', 'follow_up'])
}
