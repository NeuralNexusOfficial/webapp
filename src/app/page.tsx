import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile) {
    // Handle case where profile doesn't exist yet (maybe first login)
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p>Setting up your profile...</p>
      </div>
    )
  }

  // Redirect based on role
  if (profile.role === 'ADMIN') {
    redirect('/admin')
  } else if (profile.role === 'JUDGE') {
    redirect('/judge')
  } else {
    redirect('/user')
  }
}
