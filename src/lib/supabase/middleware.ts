import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and getUser(). A simple mistake can make it very hard to debug issues with sessions being lost.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // ── Admin & Judge routes: require login + correct DB role ──────────────────
  const isAdminRoute = pathname.startsWith('/dashboard/admin')
  const isJudgeRoute = pathname.startsWith('/dashboard/judge')

  if (isAdminRoute || isJudgeRoute) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }

    // Fetch role from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const requiredRole = isAdminRoute ? 'ADMIN' : 'JUDGE'
    if (!profile || profile.role !== requiredRole) {
      // Redirect unauthorised users to the main dashboard
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // ── /dashboard and all other routes: fully public ─────────────────────────
  // Session cookie is still refreshed above so server actions can read the user.

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing the cookies!
  // 4. Finally: return myNewResponse
  // If not, you may be causing invalid sessions to be passed to the client.

  return supabaseResponse
}
