import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/auth?redirect=/admin', req.url));
    }

    // Check if user has admin role
    if (req.nextUrl.pathname.startsWith('/admin') && req.nextUrl.pathname !== '/admin/login') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        // Redirect non-admin users
        return NextResponse.redirect(new URL('/auth?error=unauthorized', req.url));
      }
    }
  }

  // Protected vendor routes
  if (req.nextUrl.pathname.startsWith('/vendor-dashboard')) {
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

  // Protected contestant routes
  if (req.nextUrl.pathname.startsWith('/contestant-dashboard')) {
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

  // API routes protection
  if (req.nextUrl.pathname.startsWith('/api/admin')) {
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/vendor-dashboard/:path*',
    '/contestant-dashboard/:path*',
    '/api/admin/:path*',
  ],
};