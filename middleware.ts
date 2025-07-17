import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from './lib/supabase/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user) {
    // Rediriger vers login si non connected
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Vérifie le rôle dans votre propre base de données Prisma
  const response = await fetch(`${req.nextUrl.origin}/api/get-role`, {
    headers: {
      Cookie: req.headers.get('cookie') || '',
    },
  })
  const result = await response.json()
  const role = result.role

  const pathname = req.nextUrl.pathname

  // Rediriger si rôle non autorisé
  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  if (pathname.startsWith('/dashboard') && role !== 'CLIENT') {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}