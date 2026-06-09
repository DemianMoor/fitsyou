import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

/**
 * Supabase clients for the Fits You public site.
 *
 * SINGLE-TENANT: every client targets the Fits You project's OWN database via
 * its own env vars. There is no control-plane, no getBrandClient, no brand_id
 * filter — brands are isolated at the database level (see PHASE-0-RECON.md §0).
 */

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True only when the anon read env is configured. Lets callers degrade
 *  gracefully (fall back to placeholder content) before provisioning. */
export function hasSupabaseEnv(): boolean {
  return Boolean(URL && ANON);
}

/** Browser-side anon client (client components). */
export function createSupabaseBrowserClient() {
  return createBrowserClient(URL!, ANON!);
}

/**
 * Server-side anon client (Server Components / route handlers).
 * Reads cookies via a dynamic next/headers import so client bundles never
 * pull in next/headers. Anon key ⇒ RLS enforces published-only reads.
 */
export async function createSupabaseServerClient() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  return createServerClient(URL!, ANON!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component (read-only cookies) — safe to ignore.
        }
      },
    },
  });
}

/**
 * Service-role client — SERVER ONLY. Bypasses RLS. Used exclusively by the
 * subscribe write path (app/api/subscribe). Never import from a client
 * component; the key is never NEXT_PUBLIC_ and never reaches the browser.
 */
export function createSupabaseServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!URL || !serviceKey) {
    throw new Error(
      "Supabase service env not set (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).",
    );
  }
  return createClient(URL, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
