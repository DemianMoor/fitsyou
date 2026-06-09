import type { MetadataRoute } from "next";
import { getBlogArticles } from "@/lib/content";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fitsyou.net";

// Catalog types render on list pages only (no per-item detail routes), so they
// aren't enumerated here. Blog articles have /blog/[slug] routes and are included.
const STATIC_PATHS = [
  "", "/how", "/plan", "/meal-kits", "/supplements",
  "/training", "/stories", "/pricing", "/trust", "/about", "/blog",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: p === "" || p === "/blog" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.7,
  }));

  const articles = (await getBlogArticles()) ?? [];
  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE}/blog/${a.slug}`,
    lastModified: a.published_at ?? undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...articleEntries];
}
