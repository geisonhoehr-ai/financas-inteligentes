import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Páginas que não precisam de autenticação
  const publicPaths = ['/login', '/test-login']
  const isPublicPath = publicPaths.some(path => req.nextUrl.pathname.startsWith(path))

  // Se não está logado e não está em página pública, redirecionar para login
  if (!session && !isPublicPath) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    console.log('🔒 Middleware: Redirecionando para login (sem sessão)')
    return NextResponse.redirect(redirectUrl)
  }

  // Se está logado e tentando acessar página de login, redirecionar para home
  if (session && req.nextUrl.pathname.startsWith('/login')) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/'
    console.log('✅ Middleware: Redirecionando para home (já autenticado)')
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
