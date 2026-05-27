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

  // Check if user is in a team and if any team member paid
  const { data: teamMember } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (teamMember) {
    const { data: teamMembers } = await supabase
      .from('team_members')
      .select('user_id')
      .eq('team_id', teamMember.team_id)

    if (teamMembers && teamMembers.length > 0) {
      const userIds = teamMembers.map(m => m.user_id)
      const { data: teamPayments } = await supabase
        .from('payments')
        .select('status')
        .in('user_id', userIds)
        .eq('status', 'SUCCESS')
        .limit(1)

      if (teamPayments && teamPayments.length > 0) {
        return { status: 'SUCCESS' }
      }
    }
  }

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
