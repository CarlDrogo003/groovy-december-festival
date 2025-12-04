import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Only run Supabase middleware on protected routes
  const protectedPaths = [
    '/admin',
    '/vendor-dashboard',
    '/contestant-dashboard',
    '/api/admin'
  ];

  const pathname = req.nextUrl.pathname;

  // If route is NOT protected, do nothing
  const isProtected = protectedPaths.some(p => pathname.startsWith(p));
  if (!isProtected) {
    return res;
  }

  // Run Supabase check only for protected routes
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  // ADMIN routes
  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth?redirect=/admin', req.url));
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/auth?error=unauthorized', req.url));
    }
  }

  // VENDOR routes
  if (pathname.startsWith('/vendor-dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth?redirect=/vendor-dashboard', req.url));
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || (profile.role !== 'vendor' && profile.role !== 'admin')) {
      return NextResponse.redirect(new URL('/auth?error=unauthorized', req.url));
    }
  }

  // CONTESTANT routes
  if (pathname.startsWith('/contestant-dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth?redirect=/contestant-dashboard', req.url));
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || (profile.role !== 'contestant' && profile.role !== 'admin')) {
      return NextResponse.redirect(new URL('/auth?error=unauthorized', req.url));
    }
  }

  return res;
}

// Vercel must only match PROTECTED routes
export const config = {
  matcher: [
    '/admin/:path*',
    '/vendor-dashboard/:path*',
    '/contestant-dashboard/:path*',
    '/api/admin/:path*'
  ]
};
