'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  const fullName = formData.get('fullName') as string
  const phone = formData.get('phone') as string
  const collegeCompany = formData.get('collegeCompany') as string

  // Use admin client to bypass any RLS update restrictions
  const adminSupabase = createAdminClient()
  const { error } = await adminSupabase
    .from('profiles')
    .update({
      full_name: fullName,
      phone,
      college_company: collegeCompany
    })
    .eq('id', user.id)

  if (error) {
    console.error('Error updating profile:', error)
    throw new Error('Failed to update profile')
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/profile')
  
  return { success: true }
}

export async function getProfile() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  // Use admin client to select to bypass RLS policies that might restrict SELECT
  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase
    .from('profiles')
    .select('full_name, phone, college_company, email, role')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    console.error('Error fetching profile:', error)
    throw new Error('Failed to fetch profile')
  }

  if (!data) {
    // Profile doesn't exist, let's create a default profile for the user using admin client to bypass RLS
    const defaultProfile = {
      id: user.id,
      full_name: user.user_metadata?.full_name || '',
      email: user.email || '',
      role: 'USER'
    }

    const { data: insertedData, error: insertError } = await adminSupabase
      .from('profiles')
      .insert(defaultProfile)
      .select('full_name, phone, college_company, email, role')
      .single()

    if (insertError) {
      console.error('Error creating default profile:', insertError)
      throw new Error('Failed to create default profile')
    }

    return insertedData
  }

  return data
}

// ─── Change Email ─────────────────────────────────────────────────────────────

export async function changeEmail(newEmail: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated' }

  if (!newEmail || !newEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address' }
  }

  if (newEmail.toLowerCase() === user.email?.toLowerCase()) {
    return { success: false, error: 'New email is the same as current email' }
  }

  const { error } = await supabase.auth.updateUser({
    email: newEmail,
  })

  if (error) {
    console.error('Error changing email:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// ─── Delete Account ───────────────────────────────────────────────────────────

export async function deleteAccount(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const adminSupabase = createAdminClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated' }

  try {
    // 1. Check if user has paid — block deletion if so
    const { data: payment } = await adminSupabase
      .from('payments')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'SUCCESS')
      .limit(1)
      .maybeSingle()

    if (payment) {
      return { success: false, error: 'Cannot delete account — you have an active payment. Contact support for assistance.' }
    }

    // 2. Find team membership
    const { data: membership } = await adminSupabase
      .from('team_members')
      .select('id, team_id, role')
      .eq('user_id', user.id)
      .maybeSingle()

    if (membership) {
      if (membership.role === 'LEADER') {
        // Delete all team members + team
        await adminSupabase.from('team_members').delete().eq('team_id', membership.team_id)
        await adminSupabase.from('teams').delete().eq('id', membership.team_id)
      } else {
        // Just remove self from team
        await adminSupabase.from('team_members').delete().eq('id', membership.id)
      }
    }

    // 3. Delete submissions
    await adminSupabase.from('submissions').delete().eq('user_id', user.id)

    // 4. Delete profile
    await adminSupabase.from('profiles').delete().eq('id', user.id)

    // 5. Delete auth user
    const { error: authError } = await adminSupabase.auth.admin.deleteUser(user.id)
    if (authError) {
      console.error('Error deleting auth user:', authError)
      return { success: false, error: 'Failed to delete account. Please contact support.' }
    }

    return { success: true }
  } catch (err) {
    console.error('Error deleting account:', err)
    return { success: false, error: 'An unexpected error occurred. Please contact support.' }
  }
}
