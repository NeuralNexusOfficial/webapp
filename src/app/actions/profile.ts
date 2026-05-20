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

