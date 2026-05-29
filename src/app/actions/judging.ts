'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserRole } from '@/lib/auth/roles'
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

  const role = await getUserRole(user.id)
  if (role !== 'ADMIN') {
    return { success: false, error: 'Access denied. Admin role required.', code: 403 }
  }

  const adminSupabase = createAdminClient()
  let query = adminSupabase
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

  const role = await getUserRole(user.id)
  if (role !== 'ADMIN') {
    return { success: false, error: 'Access denied. Admin role required.', code: 403 }
  }

  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase
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

  const role = await getUserRole(user.id)
  if (role !== 'ADMIN') {
    return { success: false, error: 'Access denied. Admin role required.', code: 403 }
  }

  const adminSupabase = createAdminClient()
  const { error } = await adminSupabase
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

export async function unassignJudge(submissionId: string, judgeId: string): Promise<JudgingActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated', code: 401 }

  const role = await getUserRole(user.id)
  if (role !== 'ADMIN') {
    return { success: false, error: 'Access denied. Admin role required.', code: 403 }
  }

  const adminSupabase = createAdminClient()
  const { error } = await adminSupabase
    .from('judge_assignments')
    .delete()
    .eq('submission_id', submissionId)
    .eq('judge_id', judgeId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin')
  revalidatePath(`/admin/submissions/${submissionId}`)
  return { success: true, data: undefined }
}

export async function getAssignedSubmissions(): Promise<JudgingActionResult<(Submission & { team_name: string; is_scored: boolean })[]>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated', code: 401 }

  const role = await getUserRole(user.id)
  if (role !== 'JUDGE' && role !== 'ADMIN') {
    return { success: false, error: 'Access denied. Judge role required.', code: 403 }
  }

  const adminSupabase = createAdminClient()
  // Get assignments
  const { data: assignments, error: assignError } = await adminSupabase
    .from('judge_assignments')
    .select('submission_id')
    .eq('judge_id', user.id)

  if (assignError) return { success: false, error: assignError.message }

  const submissionIds = assignments.map(a => a.submission_id)
  if (submissionIds.length === 0) return { success: true, data: [] }

  // Get submissions
  const { data: submissions, error: subError } = await adminSupabase
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

  const role = await getUserRole(user.id)
  if (role !== 'JUDGE' && role !== 'ADMIN') {
    return { success: false, error: 'Access denied.', code: 403 }
  }

  const adminSupabase = createAdminClient()
  if (role === 'JUDGE') {
    const { data: assignment, error: assignError } = await adminSupabase
      .from('judge_assignments')
      .select('id')
      .eq('submission_id', submissionId)
      .eq('judge_id', user.id)
      .maybeSingle()

    if (assignError || !assignment) {
      return { success: false, error: 'Access denied. You are not assigned to this submission.', code: 403 }
    }
  }

  const { data: scoreData, error: scoreError } = await adminSupabase
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
  const { error: subError } = await adminSupabase
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

  const role = await getUserRole(user.id)
  if (role !== 'ADMIN' && role !== 'JUDGE') {
    return { success: false, error: 'Access denied.', code: 403 }
  }

  const adminSupabase = createAdminClient()
  if (role === 'JUDGE') {
    const { data: assignment, error: assignError } = await adminSupabase
      .from('judge_assignments')
      .select('id')
      .eq('submission_id', submissionId)
      .eq('judge_id', user.id)
      .maybeSingle()

    if (assignError || !assignment) {
      return { success: false, error: 'Access denied. You are not assigned to this submission.', code: 403 }
    }
  }

  const { data, error } = await adminSupabase
    .from('scores')
    .select('*, profiles(full_name, email)')
    .eq('submission_id', submissionId)

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function getSubmissionById(submissionId: string): Promise<
  JudgingActionResult<
    Submission & {
      team_name: string
      judge_assignments: any[]
      team_members: { full_name: string | null; email: string | null; role: string }[]
    }
  >
> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated', code: 401 }

  const role = await getUserRole(user.id)
  if (role !== 'ADMIN' && role !== 'JUDGE') {
    return { success: false, error: 'Access denied.', code: 403 }
  }

  const adminSupabase = createAdminClient()
  if (role === 'JUDGE') {
    const { data: assignment, error: assignError } = await adminSupabase
      .from('judge_assignments')
      .select('id')
      .eq('submission_id', submissionId)
      .eq('judge_id', user.id)
      .maybeSingle()

    if (assignError || !assignment) {
      return { success: false, error: 'Access denied. You are not assigned to this submission.', code: 403 }
    }
  }

  const { data, error } = await adminSupabase
    .from('submissions')
    .select('*, teams(name), judge_assignments(judge_id, profiles(full_name, email))')
    .eq('id', submissionId)
    .single()

  if (error) return { success: false, error: error.message }

  // Fetch team members for this submission's team
  const { data: membersData, error: membersError } = await adminSupabase
    .from('team_members')
    .select('role, profiles(full_name, email)')
    .eq('team_id', data.team_id)

  const teamMembers = (membersData || []).map((m: any) => ({
    full_name: m.profiles?.full_name ?? null,
    email: m.profiles?.email ?? null,
    role: m.role as string,
  }))

  return {
    success: true,
    data: {
      ...data,
      team_name: data.teams?.name || 'Unknown Team',
      team_members: teamMembers,
    },
  }
}
