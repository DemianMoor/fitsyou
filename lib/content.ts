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

// ── Catalog types (Phase 3a; brand-specific tables in the Fits You DB) ───────
export type MealKit = {
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  servings: number | null;
  prep_minutes: number | null;
  dietary_tags: string[];
  nutrition: Record<string, number> | null;
  price_cents: number | null;
  featured: boolean;
  image_url: string | null;
  image_alt: string | null;
};

export type Supplement = {
  slug: string;
  name: string;
  benefit_statement: string | null;
  description: string | null;
  ingredients: unknown;
  serving_size: string | null;
  price_cents: number | null;
  category: string | null;
  requires_dshea_disclaimer: boolean;
  image_url: string | null;
  image_alt: string | null;
};

export type TrainingPlan = {
  slug: string;
  name: string;
  focus: string | null;
  level: string | null;
  weeks: number | null;
  sessions_per_week: number | null;
  equipment: string[];
  description: string | null;
  image_url: string | null;
  image_alt: string | null;
};

async function getPublished<T>(table: string, columns: string): Promise<T[] | null> {
  if (!hasSupabaseEnv()) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("published_at", { ascending: false });
    if (error) throw error;
    return (data as T[]) ?? [];
  } catch {
    return null;
  }
}

export function getMealKits(): Promise<MealKit[] | null> {
  return getPublished<MealKit>(
    "meal_kits",
    "slug,name,tagline,description,servings,prep_minutes,dietary_tags,nutrition,price_cents,featured,image_url,image_alt",
  );
}

export function getSupplements(): Promise<Supplement[] | null> {
  return getPublished<Supplement>(
    "supplements",
    "slug,name,benefit_statement,description,ingredients,serving_size,price_cents,category,requires_dshea_disclaimer,image_url,image_alt",
  );
}

export function getTrainingPlans(): Promise<TrainingPlan[] | null> {
  return getPublished<TrainingPlan>(
    "training_plans",
    "slug,name,focus,level,weeks,sessions_per_week,equipment,description,image_url,image_alt",
  );
}

// ── Feature flags ────────────────────────────────────────────────────────────
// Read from the brand's OWN site_settings (key='features'), mirroring how
// analytics IDs live per-brand (MASTER-SPEC §7) — NOT control-plane brand_config,
// which the public site never reads. B-ready: a future shared admin would write
// site_settings.features via getBrandClient. Defaults ON (Fits You has all four).
export type FeatureFlags = {
  has_meal_kits: boolean;
  has_supplements: boolean;
  has_training: boolean;
  has_plan_builder: boolean;
};

const DEFAULT_FLAGS: FeatureFlags = {
  has_meal_kits: true,
  has_supplements: true,
  has_training: true,
  has_plan_builder: true,
};

export async function getFeatureFlags(): Promise<FeatureFlags> {
  if (!hasSupabaseEnv()) return DEFAULT_FLAGS;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "features")
      .maybeSingle();
    if (error) throw error;
    const value = (data?.value ?? {}) as Partial<FeatureFlags>;
    return { ...DEFAULT_FLAGS, ...value };
  } catch {
    return DEFAULT_FLAGS;
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
