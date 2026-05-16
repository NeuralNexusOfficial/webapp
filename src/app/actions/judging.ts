'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Submission, SubmissionStatus, Profile, Score } from '@/types'

export type JudgingActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string; code?: number }

export async function getFilteredSubmissions(
  trackFilter?: string,
  statusFilter?: string
): Promise<JudgingActionResult<(Submission & { team_name: string; judge_assignments: any[] })[]>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated', code: 401 }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'ADMIN') {
    return { success: false, error: 'Access denied. Admin role required.', code: 403 }
  }

  let query = supabase
    .from('submissions')
    .select('*, teams(name), judge_assignments(judge_id, profiles(full_name, email))')
    .order('created_at', { ascending: false })

  if (trackFilter && trackFilter !== 'All') {
    query = query.eq('track', trackFilter)
  }
  if (statusFilter && statusFilter !== 'All') {
    query = query.eq('status', statusFilter)
  }

  const { data, error } = await query
  if (error) return { success: false, error: error.message }

  const formatted = (data || []).map((s: any) => ({
    ...s,
    team_name: s.teams?.name || 'Unknown Team',
  }))

  return { success: true, data: formatted }
}

export async function getAllJudges(): Promise<JudgingActionResult<Profile[]>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated', code: 401 }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'ADMIN') {
    return { success: false, error: 'Access denied. Admin role required.', code: 403 }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'JUDGE')

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function assignJudge(submissionId: string, judgeId: string): Promise<JudgingActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated', code: 401 }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'ADMIN') {
    return { success: false, error: 'Access denied. Admin role required.', code: 403 }
  }

  const { error } = await supabase
    .from('judge_assignments')
    .insert({ submission_id: submissionId, judge_id: judgeId })

  if (error) {
    if (error.code === '23505') return { success: false, error: 'Judge is already assigned to this submission.' }
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/submissions/[id]', 'page')
  return { success: true, data: undefined }
}

export async function getAssignedSubmissions(): Promise<JudgingActionResult<(Submission & { team_name: string; is_scored: boolean })[]>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated', code: 401 }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'JUDGE') {
    return { success: false, error: 'Access denied. Judge role required.', code: 403 }
  }

  // Get assignments
  const { data: assignments, error: assignError } = await supabase
    .from('judge_assignments')
    .select('submission_id')
    .eq('judge_id', user.id)

  if (assignError) return { success: false, error: assignError.message }

  const submissionIds = assignments.map(a => a.submission_id)
  if (submissionIds.length === 0) return { success: true, data: [] }

  // Get submissions
  const { data: submissions, error: subError } = await supabase
    .from('submissions')
    .select('*, teams(name), scores(judge_id)')
    .in('id', submissionIds)
    .order('created_at', { ascending: false })

  if (subError) return { success: false, error: subError.message }

  const formatted = submissions.map((s: any) => ({
    ...s,
    team_name: s.teams?.name || 'Unknown Team',
    is_scored: s.scores.some((score: any) => score.judge_id === user.id)
  }))

  return { success: true, data: formatted }
}

export async function scoreSubmission(
  submissionId: string,
  innovation: number,
  technical: number,
  uiUx: number,
  scalability: number,
  comments: string
): Promise<JudgingActionResult<Score>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated', code: 401 }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || (profile.role !== 'JUDGE' && profile.role !== 'ADMIN')) {
    return { success: false, error: 'Access denied.', code: 403 }
  }

  const { data: scoreData, error: scoreError } = await supabase
    .from('scores')
    .upsert({
      submission_id: submissionId,
      judge_id: user.id,
      innovation_score: innovation,
      technical_score: technical,
      ui_ux_score: uiUx,
      scalability_score: scalability,
      comments: comments
    }, { onConflict: 'submission_id, judge_id' })
    .select()
    .single()

  if (scoreError) return { success: false, error: scoreError.message }

  // Update submission status to JUDGED
  const { error: subError } = await supabase
    .from('submissions')
    .update({ status: 'JUDGED' as SubmissionStatus })
    .eq('id', submissionId)

  if (subError) return { success: false, error: subError.message }

  revalidatePath('/judge')
  revalidatePath(`/judge/submissions/${submissionId}`)
  revalidatePath('/admin')
  return { success: true, data: scoreData as Score }
}

export async function getSubmissionScores(submissionId: string): Promise<JudgingActionResult<Score[]>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated', code: 401 }

  const { data, error } = await supabase
    .from('scores')
    .select('*, profiles(full_name, email)')
    .eq('submission_id', submissionId)

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function getSubmissionById(submissionId: string): Promise<JudgingActionResult<Submission & { team_name: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated', code: 401 }

  const { data, error } = await supabase
    .from('submissions')
    .select('*, teams(name)')
    .eq('id', submissionId)
    .single()

  if (error) return { success: false, error: error.message }

  return { success: true, data: { ...data, team_name: data.teams?.name || 'Unknown Team' } }
}
