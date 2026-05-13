'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Submission, SubmissionStatus } from '@/types'

export type JudgingActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string; code?: number }

/**
 * Fetches all submissions for judges to review.
 * Includes team name by joining with teams table.
 */
export async function getAllSubmissions(): Promise<JudgingActionResult<(Submission & { team_name: string })[]>> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated', code: 401 }

  // Verify role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'JUDGE' && profile.role !== 'ADMIN')) {
    return { success: false, error: 'Access denied. Judge or Admin role required.', code: 403 }
  }

  const { data, error } = await supabase
    .from('submissions')
    .select('*, teams(name)')
    .order('created_at', { ascending: false })

  if (error) return { success: false, error: error.message }

  const formatted = (data || []).map((s: any) => ({
    ...s,
    team_name: s.teams?.name || 'Unknown Team',
  }))

  return { success: true, data: formatted }
}

/**
 * Updates the score of a submission and marks it as JUDGED.
 */
export async function scoreSubmission(
  submissionId: string,
  score: number,
): Promise<JudgingActionResult<Submission>> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated', code: 401 }

  // Verify role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'JUDGE' && profile.role !== 'ADMIN')) {
    return { success: false, error: 'Access denied. Judge or Admin role required.', code: 403 }
  }

  if (score < 0 || score > 100) {
    return { success: false, error: 'Score must be between 0 and 100', code: 400 }
  }

  const { data, error } = await supabase
    .from('submissions')
    .update({
      score,
      judged_by: user.id,
      status: 'JUDGED' as SubmissionStatus,
    })
    .eq('id', submissionId)
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  revalidatePath('/judge')
  return { success: true, data: data as Submission }
}
