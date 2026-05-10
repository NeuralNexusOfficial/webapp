'use server'

import { createClient } from '@/lib/supabase/server'
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

  const { error } = await supabase
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
