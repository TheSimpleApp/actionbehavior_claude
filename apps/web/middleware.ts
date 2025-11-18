import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/dashboard') ||
      request.nextUrl.pathname.startsWith('/registrations') ||
      request.nextUrl.pathname.startsWith('/roommates') ||
      request.nextUrl.pathname.startsWith('/travel') ||
      request.nextUrl.pathname.startsWith('/users') ||
      request.nextUrl.pathname.startsWith('/exports') ||
      request.nextUrl.pathname.startsWith('/notifications') ||
      request.nextUrl.pathname.startsWith('/settings')) {

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/register', request.url));
    }
  }

  // Redirect authenticated users away from login
  if (request.nextUrl.pathname === '/login' && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/register', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/registrations/:path*',
    '/roommates/:path*',
    '/travel/:path*',
    '/users/:path*',
    '/exports/:path*',
    '/notifications/:path*',
    '/settings/:path*',
    '/login',
  ],
};
