import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from './admin'

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
  const isAdminRoute = pathname.startsWith('/admin')
  const isJudgeRoute = pathname.startsWith('/judge') || pathname.startsWith('/panel')

  if (isAdminRoute || isJudgeRoute) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }

    // Fetch role from profiles table using admin client to bypass RLS
    const adminSupabase = createAdminClient()
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const requiredRole = isAdminRoute ? 'ADMIN' : 'JUDGE'
    // ADMIN can access both /admin and /judge routes
    const hasAccess =
      profile?.role === 'ADMIN' || profile?.role === requiredRole



    if (!profile || !hasAccess) {
      // Redirect unauthorised users to the main dashboard
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // ── Dashboard routes: require login ──────────────────────────────────────────
  const isDashboardRoute = pathname.startsWith('/dashboard')
  
  if (isDashboardRoute && !isAdminRoute && !isJudgeRoute) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  // ── Auth routes: redirect logged-in users to their correct dashboard ─────────
  const isAuthRoute = pathname === '/login' || pathname === '/signup' || pathname === '/auth'

  if (isAuthRoute && user) {
    const adminSupabase = createAdminClient()
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    let targetPath = '/dashboard'
    if (profile?.role === 'ADMIN' || user.email === 'kishlayamishra@gmail.com') {
      targetPath = '/admin'
    } else if (profile?.role === 'JUDGE') {
      targetPath = '/panel'
    }

    const url = request.nextUrl.clone()
    url.pathname = targetPath
    return NextResponse.redirect(url)
  }
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
