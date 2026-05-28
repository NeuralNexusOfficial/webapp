'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserRole } from '@/lib/auth/roles'
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

  const role = await getUserRole(user.id)
  if (role !== 'ADMIN') {
    return { success: false, error: 'Access denied' }
  }

  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase
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

  const role = await getUserRole(user.id)
  if (role !== 'ADMIN') {
    return { success: false, error: 'Access denied' }
  }

  const adminSupabase = createAdminClient()
  const { error } = await adminSupabase
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

  const role = await getUserRole(user.id)
  if (role !== 'ADMIN') {
    return { success: false, error: 'Access denied' }
  }

  const adminSupabase = createAdminClient()
  const { error } = await adminSupabase
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

/**
 * Gets all users (profiles).
 */
export async function getAllUsers(): Promise<AdminActionResult<Profile[]>> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const role = await getUserRole(user.id)
  if (role !== 'ADMIN') {
    return { success: false, error: 'Access denied' }
  }

  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return { success: false, error: error.message }
  return { success: true, data: data as Profile[] }
}

/**
 * Updates a user's role.
 */
export async function updateUserRole(userId: string, newRole: 'USER' | 'ADMIN' | 'JUDGE'): Promise<AdminActionResult> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const role = await getUserRole(user.id)
  if (role !== 'ADMIN') {
    return { success: false, error: 'Access denied' }
  }

  const adminSupabase = createAdminClient()

  // Prevent modifying the super admin
  const { data: targetUser } = await adminSupabase
    .from('profiles')
    .select('email')
    .eq('id', userId)
    .single()

  if (targetUser?.email === 'kishlayamishra@gmail.com') {
    return { success: false, error: 'Cannot modify the Super Admin role.' }
  }

  const { error } = await adminSupabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/users')
  return { success: true, data: undefined }
}

/**
 * Deletes a user from the platform (profiles + Supabase Auth).
 * Super Admin account is protected from deletion.
 */
export async function deleteUser(userId: string): Promise<AdminActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const role = await getUserRole(user.id)
  if (role !== 'ADMIN') {
    return { success: false, error: 'Access denied' }
  }

  // Cannot delete yourself
  if (user.id === userId) {
    return { success: false, error: 'You cannot delete your own account.' }
  }

  const adminSupabase = createAdminClient()

  // Protect super admin
  const { data: targetUser } = await adminSupabase
    .from('profiles')
    .select('email')
    .eq('id', userId)
    .single()

  if (!targetUser) {
    return { success: false, error: 'User not found.' }
  }

  if (targetUser.email === 'kishlayamishra@gmail.com') {
    return { success: false, error: 'Cannot delete the Super Admin account.' }
  }

  // Delete profile (cascade should handle related records)
  const { error: profileError } = await adminSupabase
    .from('profiles')
    .delete()
    .eq('id', userId)

  if (profileError) return { success: false, error: profileError.message }

  // Delete from Supabase Auth
  const { error: authError } = await adminSupabase.auth.admin.deleteUser(userId)
  if (authError) return { success: false, error: authError.message }

  revalidatePath('/admin/users')
  return { success: true, data: undefined }
}
