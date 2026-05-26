import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  
  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)

    // After session exchange, check role and redirect to the appropriate dashboard
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const adminSupabase = createAdminClient()
      const { data: profile } = await adminSupabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      let redirectUrl = next
      if (profile?.role === 'ADMIN' || user.email === 'kishlayamishra@gmail.com') {
        redirectUrl = '/admin'
      } else if (profile?.role === 'JUDGE') {
        redirectUrl = '/panel'
      }

      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(next, request.url))
}
