'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Profile, JudgeAssignment } from '@/types'

export type AdminActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Fetches all users with the JUDGE role.
 */
export async function getJudges(): Promise<AdminActionResult<Profile[]>> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  // Verify Admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'ADMIN') {
    return { success: false, error: 'Access denied' }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'JUDGE')
    .order('full_name', { ascending: true })

  if (error) return { success: false, error: error.message }
  return { success: true, data: data as Profile[] }
}

/**
 * Assigns a judge to a submission.
 */
export async function assignJudge(submissionId: string, judgeId: string): Promise<AdminActionResult> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'ADMIN') {
    return { success: false, error: 'Access denied' }
  }

  const { error } = await supabase
    .from('judge_assignments')
    .upsert({
      submission_id: submissionId,
      judge_id: judgeId
    }, { onConflict: 'submission_id,judge_id' })

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin')
  revalidatePath('/judge')
  return { success: true, data: undefined }
}

/**
 * Removes a judge assignment.
 */
export async function unassignJudge(submissionId: string, judgeId: string): Promise<AdminActionResult> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'ADMIN') {
    return { success: false, error: 'Access denied' }
  }

  const { error } = await supabase
    .from('judge_assignments')
    .delete()
    .eq('submission_id', submissionId)
    .eq('judge_id', judgeId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin')
  revalidatePath('/judge')
  return { success: true, data: undefined }
}

/**
 * Gets all assignments for a specific submission.
 */
export async function getAssignmentsBySubmission(submissionId: string): Promise<AdminActionResult<JudgeAssignment[]>> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('judge_assignments')
    .select('*')
    .eq('submission_id', submissionId)

  if (error) return { success: false, error: error.message }
  return { success: true, data: data as JudgeAssignment[] }
}

/**
 * Gets all assignments.
 */
export async function getAllAssignments(): Promise<AdminActionResult<JudgeAssignment[]>> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('judge_assignments')
    .select('*')

  if (error) return { success: false, error: error.message }
  return { success: true, data: data as JudgeAssignment[] }
}
