import { getBlogArticles, formatDate, type Article } from "@/lib/content";
import { BlogView, type BlogPost } from "@/components/pages/BlogView";

export const metadata = {
  title: "The Journal — Fits You",
  description:
    "Nutrition, training, and the science behind both. Written by registered dietitians and exercise scientists.",
};

function cap(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function toPost(a: Article, featured: boolean): BlogPost {
  return {
    slug: a.slug,
    category: cap(a.pillar),
    title: a.title,
    excerpt: a.excerpt ?? a.subtitle ?? "",
    date: formatDate(a.published_at),
    img: a.image_url ?? "",
    featured,
  };
}

export default async function BlogPage() {
  const articles = await getBlogArticles();
  // null = no backend yet → BlogView falls back to placeholder content.
  const posts =
    articles === null ? null : articles.map((a, i) => toPost(a, i === 0));
  return <BlogView posts={posts} />;
}
