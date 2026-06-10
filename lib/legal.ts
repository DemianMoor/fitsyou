import { createSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase";

/**
 * Legal pages (privacy, terms) are edited in the central admin panel and stored
 * in this project's `legal_pages` table. The public site reads the published row
 * (anon ⇒ RLS published-only) and renders its HTML body. Falls back to null when
 * Supabase env is absent or no row exists, so pages can degrade to their
 * built-in copy instead of erroring.
 */
export type LegalRow = {
  title: string;
  body: string;
  effective_date: string | null;
};

export async function fetchLegalPage(slug: string): Promise<LegalRow | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("legal_pages")
    .select("title, body, effective_date")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return (data as LegalRow) ?? null;
}

/** "Effective date: May 10, 2026" (or empty when unset). */
export function legalUpdatedLabel(effectiveDate: string | null): string {
  if (!effectiveDate) return "";
  const d = new Date(`${effectiveDate}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  return `Effective date: ${d}`;
}
