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

/**
 * Everything the /lp/[slug] route needs out of site_settings, in one round trip:
 * analytics IDs, the direct-mode Keitaro script, and the serve-time tracking-URL
 * rewrite config (see lib/tracking-rewrite). The central admin writes these; the
 * public site reads them.
 *
 * No hardcoded fallbacks — a blank value means "don't inject", and for the
 * tracking domain it means "serve landing pages exactly as uploaded". Never
 * throws: a fetch failure degrades to that same off state.
 */
export async function getLpSettings(): Promise<{
  gtmId: string;
  clarityId: string;
  keitaroScript: string;
  tracking: { domain: string | null; source: string | null };
}> {
  const off = {
    gtmId: "",
    clarityId: "",
    keitaroScript: "",
    tracking: { domain: null, source: null },
  };

  try {
    const supabase = createSupabaseServiceClient();
    const { data } = await supabase.from("site_settings").select("key, value");

    // `value` is jsonb, so supabase-js hands back an already-decoded JS value.
    const get = (key: string): string => {
      const raw = data?.find((row) => row.key === key)?.value;
      if (raw === null || raw === undefined) return "";
      return typeof raw === "string" ? raw : String(raw);
    };

    return {
      gtmId: get("analytics_gtm_id"),
      clarityId: get("analytics_clarity_id"),
      keitaroScript: get("keitaro_tracking_script"),
      tracking: {
        domain: get("tracking_domain") || null,
        source: get("tracking_source") || null,
      },
    };
  } catch {
    return off;
  }
}
