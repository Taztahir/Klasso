import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabase, user, response } = await updateSession(request);

  const url = request.nextUrl.clone();
  const isDashboardPath = url.pathname.startsWith('/dashboard');
  const isAuthPath = url.pathname === '/login' || url.pathname === '/signup';
  const isOnboardingPath = url.pathname === '/onboarding';

  // 1. If user is NOT logged in and trying to access dashboard/onboarding, redirect to /login
  if (!user && (isDashboardPath || isOnboardingPath)) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 2. If user is logged in
  if (user) {
    // Fetch profile to see if they have school_id
    const { data: profile } = await supabase
      .from('users')
      .select('school_id, role')
      .eq('id', user.id)
      .single();

    const hasSchool = !!profile?.school_id;
    const isSuperAdmin = profile?.role === 'super_admin';

    // A. If they don't have a school and are not a super_admin, they MUST complete onboarding
    if (!hasSchool && !isSuperAdmin) {
      if (!isOnboardingPath) {
        url.pathname = '/onboarding';
        return NextResponse.redirect(url);
      }
    } else {
      // B. If they have a school (or are super_admin), they shouldn't access onboarding
      if (isOnboardingPath) {
        url.pathname = '/dashboard/overview';
        return NextResponse.redirect(url);
      }
    }

    // C. Logged in users shouldn't access login/signup pages
    if (isAuthPath) {
      url.pathname = '/dashboard/overview';
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/login', 
    '/signup', 
    '/onboarding'
  ],
};
