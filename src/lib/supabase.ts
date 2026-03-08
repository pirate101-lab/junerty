/**
 * Server-only Supabase admin client.
 *
 * Uses the Service Role key so it bypasses RLS – suitable only for
 * trusted server-side code (Next.js Server Actions / Route Handlers).
 * Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Admin client – bypasses RLS. Use only in server-side trusted code. */
export function getSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set to use the admin Supabase client.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

/**
 * Supabase client authenticated as the current user via the anon key.
 * Pass the user's JWT so RLS policies are enforced correctly.
 */
export function createUserSupabaseClient(userAccessToken: string): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error(
      "SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.",
    );
  }

  return createClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: { Authorization: `Bearer ${userAccessToken}` },
    },
  });
}
