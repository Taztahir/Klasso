import { type NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

// Helper to generate a URL slug
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

export async function POST(request: NextRequest) {
  try {
    const { schoolName } = await request.json();

    if (!schoolName || schoolName.trim() === '') {
      return NextResponse.json({ error: 'School name is required' }, { status: 400 });
    }

    // 1. Verify user's session
    const serverSupabase = await createServerClient();
    const { data: { user }, error: authError } = await serverSupabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 });
    }

    // 2. Initialize a service role client to write bypass RLS for setup
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 3. Check if user already has a school
    const { data: profile, error: profileError } = await serviceSupabase
      .from('users')
      .select('school_id')
      .eq('id', user.id)
      .single();

    if (profile?.school_id) {
      return NextResponse.json({ error: 'School already configured' }, { status: 400 });
    }

    // 4. Create the school row
    const slug = slugify(schoolName) + '-' + Math.floor(1000 + Math.random() * 9000);
    const { data: school, error: schoolError } = await serviceSupabase
      .from('schools')
      .insert({
        name: schoolName,
        slug,
        subscription_tier: 'free',
      })
      .select('id')
      .single();

    if (schoolError || !school) {
      return NextResponse.json({ error: schoolError?.message || 'Failed to create school' }, { status: 500 });
    }

    // 5. Update user profile to link to the new school and set role as school_admin
    const { error: updateError } = await serviceSupabase
      .from('users')
      .update({
        school_id: school.id,
        role: 'school_admin',
      })
      .eq('id', user.id);

    if (updateError) {
      // Rollback school creation on failure
      await serviceSupabase.from('schools').delete().eq('id', school.id);
      return NextResponse.json({ error: 'Failed to configure user tenant profile' }, { status: 500 });
    }

    return NextResponse.json({ success: true, schoolId: school.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
