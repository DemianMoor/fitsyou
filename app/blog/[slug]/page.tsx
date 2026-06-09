import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug, formatDate } from "@/lib/content";
import { hasSupabaseEnv } from "@/lib/supabase";
import { FitMark } from "@/components/FitMark";
import { BrandImage } from "@/components/BrandImage";

const BRASS = "#B79256", OBSIDIAN = "#101114", BONE = "#F5F2EB", ASH = "#6B6A66";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticleBySlug(slug);
  if (!a) return { title: "Article — Fits You" };
  return {
    title: a.seo_title ?? `${a.title} — Fits You`,
    description: a.seo_description ?? a.excerpt ?? a.subtitle ?? undefined,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    // Backend present + slug missing/unpublished → a real 404.
    if (hasSupabaseEnv()) notFound();
    // Pre-provisioning (no backend) → a soft notice instead of a jarring 404.
    return (
      <div style={{ paddingTop: 64, background: OBSIDIAN, minHeight: "80vh" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "120px 32px", textAlign: "center" }}>
          <FitMark size={14} />
          <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 32, fontWeight: 400, color: BONE, margin: "24px 0 12px" }}>
            This article isn&apos;t published yet.
          </h1>
          <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 14, color: "rgba(245,242,235,0.55)", lineHeight: 1.7, margin: "0 0 28px" }}>
            The Journal is being set up. Check back soon.
          </p>
          <Link href="/blog" style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: BRASS, textDecoration: "none" }}>
            ← Back to the Journal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article style={{ paddingTop: 64 }}>
      {/* Header */}
      <header style={{ background: OBSIDIAN, padding: "80px 32px 56px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Link href="/blog" style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: BRASS, textDecoration: "none" }}>
            ← The Journal
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "28px 0 18px" }}>
            <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: BRASS }}>
              {article.pillar}
            </span>
            {article.published_at && (
              <>
                <span style={{ width: 1, height: 12, background: "rgba(183,146,86,0.3)" }} />
                <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, color: "rgba(245,242,235,0.4)" }}>
                  {formatDate(article.published_at)}
                </span>
              </>
            )}
          </div>
          <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(34px, 4vw, 56px)", fontWeight: 400, color: BONE, letterSpacing: "-0.025em", lineHeight: 1.05, margin: "0 0 18px" }}>
            {article.title}
          </h1>
          {article.subtitle && (
            <p style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 20, fontStyle: "italic", color: "rgba(245,242,235,0.6)", lineHeight: 1.5, margin: 0 }}>
              {article.subtitle}
            </p>
          )}
          {article.byline && (
            <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 12, color: ASH, margin: "24px 0 0" }}>
              {article.byline}
            </p>
          )}
        </div>
      </header>

      {/* Hero image */}
      {article.image_url && (
        <div style={{ background: BONE }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
              <BrandImage src={article.image_url} alt={article.image_alt ?? article.title} fill priority sizes="(max-width: 1000px) 100vw, 960px" style={{ objectFit: "cover" }} />
            </div>
          </div>
        </div>
      )}

      {/* Body (rendered from the article's stored HTML) */}
      <div style={{ background: BONE, padding: "64px 32px 112px" }}>
        <div
          style={{ maxWidth: 720, margin: "0 auto", fontFamily: "var(--font-archivo), sans-serif", fontSize: 17, color: OBSIDIAN, lineHeight: 1.8 }}
          dangerouslySetInnerHTML={{ __html: article.body }}
        />
        <div style={{ maxWidth: 720, margin: "48px auto 0", paddingTop: 24, borderTop: "1px solid rgba(16,17,20,0.1)" }}>
          <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, color: ASH, lineHeight: 1.7, margin: 0 }}>
            Results vary. Individual outcomes depend on many factors. This article is general information, not medical advice.
          </p>
        </div>
      </div>
    </article>
  );
}
