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

/**
 * Fetches payment details for a specific submission (project).
 */
export async function getPaymentDetailsForSubmission(
  submissionId: string
): Promise<AdminActionResult<{
  submission: { id: string; title: string; team_name: string; track: string };
  payments: {
    id: string;
    amount: number;
    status: string;
    track: string | null;
    created_at: string;
    razorpay_order_id: string;
    razorpay_payment_id: string | null;
    user: { full_name: string | null; email: string | null };
  }[];
}>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const role = await getUserRole(user.id)
  if (role !== 'ADMIN') {
    return { success: false, error: 'Access denied' }
  }

  const adminSupabase = createAdminClient()

  // 1. Get submission & team ID
  const { data: submission, error: subError } = await adminSupabase
    .from('submissions')
    .select('id, title, track, team_id, teams(name)')
    .eq('id', submissionId)
    .single()

  if (subError || !submission) {
    return { success: false, error: subError?.message || 'Submission not found' }
  }

  // 2. Get team members
  const { data: members, error: membersError } = await adminSupabase
    .from('team_members')
    .select('user_id')
    .eq('team_id', submission.team_id)

  if (membersError) {
    return { success: false, error: membersError.message }
  }

  const userIds = (members || []).map(m => m.user_id)
  if (userIds.length === 0) {
    return {
      success: true,
      data: {
        submission: {
          id: submission.id,
          title: submission.title,
          team_name: (submission.teams as any)?.name || 'Unknown Team',
          track: submission.track,
        },
        payments: [],
      },
    }
  }

  // 3. Get payments for those users with profile info
  const { data: paymentsData, error: paymentsError } = await adminSupabase
    .from('payments')
    .select('*, profiles(full_name, email)')
    .in('user_id', userIds)
    .order('created_at', { ascending: false })

  if (paymentsError) {
    return { success: false, error: paymentsError.message }
  }

  const formattedPayments = (paymentsData || []).map((p: any) => ({
    id: p.id,
    amount: p.amount,
    status: p.status,
    track: p.track,
    created_at: p.created_at,
    razorpay_order_id: p.razorpay_order_id,
    razorpay_payment_id: p.razorpay_payment_id,
    user: {
      full_name: p.profiles?.full_name ?? null,
      email: p.profiles?.email ?? null,
    },
  }))

  return {
    success: true,
    data: {
      submission: {
        id: submission.id,
        title: submission.title,
        team_name: (submission.teams as any)?.name || 'Unknown Team',
        track: submission.track,
      },
      payments: formattedPayments,
    },
  }
}

