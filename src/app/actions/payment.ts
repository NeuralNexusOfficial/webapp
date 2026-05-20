'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Returns the current user's latest payment status.
 * Used by PayButton to persist state across sessions/reloads.
 */
export async function getPaymentStatus(): Promise<{
  status: 'NONE' | 'INITIATED' | 'SUCCESS' | 'FAILED'
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { status: 'NONE' }

  // Get the latest payment for this user, ordered by most recent
  const { data, error } = await supabase
    .from('payments')
    .select('status')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data) return { status: 'NONE' }

  return { status: data.status as 'INITIATED' | 'SUCCESS' | 'FAILED' }
}
