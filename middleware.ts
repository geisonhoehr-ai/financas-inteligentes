import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Verificar sessão
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/', '/pricing', '/register', '/login']
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname)

  // Se não estiver logado e tentar acessar rota protegida
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Se estiver logado e tentar acessar página de login/registro
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/', req.url))
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
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}