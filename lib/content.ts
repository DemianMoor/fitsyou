import { createSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase";

/**
 * Read-only content access for the public site. Every function degrades
 * gracefully: it returns `null` when the backend is absent (env unset) or a
 * query errors, so pages can fall back to placeholder content instead of
 * crashing. An empty array means "backend present, no matching rows".
 */

// Subset of the canonical `articles` contract the public site renders.
export type Article = {
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  body: string;
  pillar: string;
  byline: string | null;
  image_url: string | null;
  image_alt: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
};

const LIST_COLUMNS =
  "slug,title,subtitle,excerpt,pillar,byline,image_url,image_alt,seo_title,seo_description,published_at";
const FULL_COLUMNS = `${LIST_COLUMNS},body`;

const STORIES_PILLAR = "stories";

/** Published articles for the blog (everything except the stories pillar). */
export async function getBlogArticles(): Promise<Article[] | null> {
  if (!hasSupabaseEnv()) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("articles")
      .select(LIST_COLUMNS)
      .eq("status", "published")
      .neq("pillar", STORIES_PILLAR)
      .order("published_at", { ascending: false });
    if (error) throw error;
    return (data as Article[]) ?? [];
  } catch {
    return null;
  }
}

/** A single published article by slug (null if missing/unpublished/no backend). */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!hasSupabaseEnv()) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("articles")
      .select(FULL_COLUMNS)
      .eq("status", "published")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return (data as Article) ?? null;
  } catch {
    return null;
  }
}

/** Published customer stories (pillar='stories'). Real, consented content only. */
export async function getStories(): Promise<Article[] | null> {
  if (!hasSupabaseEnv()) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("articles")
      .select(LIST_COLUMNS)
      .eq("status", "published")
      .eq("pillar", STORIES_PILLAR)
      .order("published_at", { ascending: false });
    if (error) throw error;
    return (data as Article[]) ?? [];
  } catch {
    return null;
  }
}

/** Format an ISO timestamp as e.g. "Nov 12, 2024" (empty string if null). */
export function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
