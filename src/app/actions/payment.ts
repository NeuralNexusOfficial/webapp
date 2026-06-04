'use server'

import { createClient } from '@/lib/supabase/server'
import { Track } from '@/types'

/**
 * Returns the current user's latest payment status and paid track (if any).
 * Used by PayButton to persist state across sessions/reloads.
 */
export async function getPaymentStatus(): Promise<{
  status: 'NONE' | 'INITIATED' | 'SUCCESS' | 'FAILED'
  track?: Track | null
  id?: string
  amount?: number
  currency?: string
  razorpay_payment_id?: string | null
  created_at?: string
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
        .select('id, status, track, amount, currency, razorpay_payment_id, created_at')
        .in('user_id', userIds)
        .eq('status', 'SUCCESS')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (teamPayments) {
        return {
          status: 'SUCCESS',
          track: (teamPayments.track as Track) ?? null,
          id: teamPayments.id,
          amount: teamPayments.amount,
          currency: teamPayments.currency,
          razorpay_payment_id: teamPayments.razorpay_payment_id,
          created_at: teamPayments.created_at,
        }
      }
    }
  }

  // Get the latest payment for this user, ordered by most recent
  const { data, error } = await supabase
    .from('payments')
    .select('id, status, track, amount, currency, razorpay_payment_id, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data) return { status: 'NONE' }

  return {
    status: data.status as 'INITIATED' | 'SUCCESS' | 'FAILED',
    track: (data.track as Track) ?? null,
    id: data.id,
    amount: data.amount,
    currency: data.currency,
    razorpay_payment_id: data.razorpay_payment_id,
    created_at: data.created_at,
  }
}
