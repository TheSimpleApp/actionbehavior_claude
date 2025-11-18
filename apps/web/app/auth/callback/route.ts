import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    // Check user role
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      // Redirect based on role
      if (profile?.role === 'admin') {
        return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
      }
    }

    // Default redirect for regular users
    return NextResponse.redirect(new URL('/register', requestUrl.origin));
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/login', requestUrl.origin));
}
