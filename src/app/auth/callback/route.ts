import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it, else default to overview dashboard
  const next = searchParams.get('next') ?? '/dashboard/overview';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Check if user has school_id profile configured
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('school_id, role')
          .eq('id', user.id)
          .single();

        // If no school configured and not super_admin, redirect to onboarding
        if (!profile?.school_id && profile?.role !== 'super_admin') {
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page or login with a failure state
  return NextResponse.redirect(`${origin}/login?error=OAuth exchange failed`);
}
