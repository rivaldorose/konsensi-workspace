import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Auth routes (login, signup)
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup')

  // Public routes (if any)
  const isPublicRoute = pathname === '/' || pathname.startsWith('/_next') || pathname.startsWith('/api')

  // Workspace routes (protected)
  const isWorkspaceRoute = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/apps') ||
                          pathname.startsWith('/partners') ||
                          pathname.startsWith('/events') ||
                          pathname.startsWith('/docs') ||
                          pathname.startsWith('/roadmap') ||
                          pathname.startsWith('/chat') ||
                          pathname.startsWith('/marketing') ||
                          pathname.startsWith('/contracts') ||
                          pathname.startsWith('/notifications') ||
                          pathname.startsWith('/settings') ||
                          pathname.startsWith('/search')

  // If user is logged in and trying to access auth routes, redirect to dashboard
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is not logged in and trying to access workspace routes, redirect to login
  if (!user && isWorkspaceRoute) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is not logged in and accessing root, redirect to login
  if (!user && pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user is logged in and accessing root, redirect to dashboard
  if (user && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

