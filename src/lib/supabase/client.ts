import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Singleton browser Supabase client.
 *
 * NEXT_PUBLIC_* vars are inlined into the client bundle at build time, so a
 * missing value here means the variable was not present when the app was
 * compiled. We fail with an explicit, named error instead of letting
 * @supabase/ssr throw its opaque "URL and API key are required" message.
 */
let browserClient: SupabaseClient | undefined;

export const createClient = (): SupabaseClient => {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const missing: string[] = [];
  if (!url) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!anonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  if (missing.length > 0) {
    throw new Error(
      `Supabase is not configured: missing ${missing.join(
        ', '
      )}. Add these environment variables to the project and restart the dev server so they are inlined into the client bundle.`
    );
  }

  browserClient = createBrowserClient(url!, anonKey!);
  return browserClient;
};
