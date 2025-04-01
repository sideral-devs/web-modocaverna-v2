import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname

  try {
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_PROD_URL}/api/health/`,
    )

    if (backendResponse.status === 503) {
      if (!url.startsWith('/manutencao')) {
        return NextResponse.redirect(new URL('/manutencao', req.url))
      }
    } else {
      if (url.startsWith('/manutencao')) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }
  } catch (error) {
    console.error('Erro ao verificar status do backend:', error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|public).*)',
}
