"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FitMark } from "@/components/FitMark";
import { ArrowRight } from "lucide-react";

const BRASS = "#B79256", OBSIDIAN = "#101114", BONE = "#F5F2EB", ASH = "#6B6A66", PINE = "#2F3A30";

const POSTS = [
  {
    slug: "protein-timing",
    category: "Nutrition",
    title: "Protein timing: what the evidence actually says",
    excerpt: "The 30-minute anabolic window is mostly marketing. What the research shows is more nuanced — and more useful — than the gym-floor version.",
    date: "Nov 12, 2024",
    readTime: "8 min",
    img: "https://images.unsplash.com/photo-1590394072807-12f9869e3907?w=800&h=500&fit=crop&auto=format",
    featured: true,
  },
  {
    slug: "creatine-evidence",
    category: "Supplements",
    title: "Creatine: the most studied supplement in sports science",
    excerpt: "Decades of research and a remarkably consistent finding. Why creatine earns its place in a personalized stack — and who doesn't need it.",
    date: "Oct 28, 2024",
    readTime: "6 min",
    img: "https://images.unsplash.com/photo-1585830812369-b88fce3bee22?w=600&h=400&fit=crop&auto=format",
    featured: false,
  },
  {
    slug: "progressive-overload",
    category: "Training",
    title: "Progressive overload is the only principle that matters",
    excerpt: "Every effective training program is a version of the same idea. Understanding it lets you evaluate any program — and build your own.",
    date: "Oct 14, 2024",
    readTime: "7 min",
    img: "https://images.unsplash.com/photo-1434596922112-19c563067271?w=600&h=400&fit=crop&auto=format",
    featured: false,
  },
  {
    slug: "sleep-recovery",
    category: "Recovery",
    title: "Sleep is the supplement most people aren't taking",
    excerpt: "No stack formulation overrides chronic sleep debt. What the research shows about sleep's role in body composition, performance, and nutrient utilization.",
    date: "Sep 30, 2024",
    readTime: "9 min",
    img: "https://images.unsplash.com/photo-1447078806655-40579c2520d6?w=600&h=400&fit=crop&auto=format",
    featured: false,
  },
  {
    slug: "personalization-limits",
    category: "Science",
    title: "The honest limits of personalized nutrition",
    excerpt: "Nutrigenomics and continuous glucose monitoring make compelling promises. Here's what the current evidence supports — and what it doesn't.",
    date: "Sep 16, 2024",
    readTime: "11 min",
    img: "https://images.unsplash.com/photo-1663530761401-15eefb544889?w=600&h=400&fit=crop&auto=format",
    featured: false,
  },
];

const CATEGORIES = ["All", "Nutrition", "Supplements", "Training", "Recovery", "Science"];

export default function BlogPage() {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const go = (path: string) => { navigate(path); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const [activeCategory, setActiveCategory] = useState("All");

  const featured = POSTS.find(p => p.featured)!;
  const rest = POSTS.filter(p => !p.featured && (activeCategory === "All" || p.category === activeCategory));

  return (
    <div style={{ paddingTop: 64 }}>
      {/* Header */}
      <section style={{ background: OBSIDIAN, padding: "80px 32px 64px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: BRASS }}>The Journal</span>
          <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 400, color: BONE, letterSpacing: "-0.03em", margin: "16px 0 16px", lineHeight: 0.97 }}>
            Nutrition, training,<br /><em style={{ fontStyle: "italic", color: BRASS }}>and the science behind both.</em>
          </h1>
          <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 15, color: "rgba(245,242,235,0.55)", lineHeight: 1.72, maxWidth: 480, margin: 0 }}>
            Written by registered dietitians and exercise scientists. No supplement ads. No engagement bait. Just evidence, explained plainly.
          </p>
        </div>
      </section>

      {/* Featured post */}
      <section style={{ background: BONE }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 480 }}>
            <div style={{ overflow: "hidden", position: "relative" }}>
              <img
                src={featured.img}
                alt={featured.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent, rgba(245,242,235,0.08))" }} />
            </div>
            <div style={{ padding: "64px", display: "flex", flexDirection: "column", justifyContent: "center", background: OBSIDIAN }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: BRASS }}>{featured.category}</span>
                <span style={{ width: 1, height: 12, background: "rgba(183,146,86,0.3)" }} />
                <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, color: "rgba(245,242,235,0.4)" }}>{featured.date} · {featured.readTime} read</span>
              </div>
              <FitMark size={20} padded={false}>
                <div style={{ padding: "8px 12px" }}>
                  <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 32, fontWeight: 400, color: BONE, margin: "0 0 16px", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                    {featured.title}
                  </h2>
                </div>
              </FitMark>
              <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 15, color: "rgba(245,242,235,0.6)", lineHeight: 1.75, margin: "16px 0 32px" }}>
                {featured.excerpt}
              </p>
              <button
                onClick={() => go("/blog")}
                style={{ background: "none", border: "1px solid rgba(183,146,86,0.4)", color: BRASS, cursor: "pointer", fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "13px 22px", borderRadius: 4, display: "inline-flex", alignItems: "center", gap: 8, alignSelf: "flex-start", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(183,146,86,0.1)"; e.currentTarget.style.borderColor = BRASS; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "rgba(183,146,86,0.4)"; }}
              >
                Read article <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter + grid */}
      <section style={{ background: BONE, padding: "80px 32px 128px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Category filter */}
          <div style={{ display: "flex", gap: 8, marginBottom: 48, paddingBottom: 20, borderBottom: "1px solid rgba(16,17,20,0.09)" }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{ background: activeCategory === cat ? OBSIDIAN : "transparent", color: activeCategory === cat ? BONE : ASH, border: `1px solid ${activeCategory === cat ? OBSIDIAN : "rgba(16,17,20,0.15)"}`, cursor: "pointer", fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 16px", borderRadius: 4, transition: "all 0.15s" }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Post grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {rest.map(post => (
              <div
                key={post.slug}
                onClick={() => go("/blog")}
                style={{ cursor: "pointer", background: BONE, border: "1px solid rgba(16,17,20,0.08)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(183,146,86,0.4)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(16,17,20,0.08)"; }}
              >
                <div style={{ overflow: "hidden", aspectRatio: "16/9" }}>
                  <img
                    src={post.img}
                    alt={post.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease" }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.transform = "scale(1.04)"; }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.transform = "scale(1)"; }}
                  />
                </div>
                <div style={{ padding: "32px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: BRASS }}>{post.category}</span>
                    <span style={{ width: 1, height: 10, background: "rgba(16,17,20,0.2)" }} />
                    <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, color: ASH }}>{post.date} · {post.readTime} read</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 22, fontWeight: 400, color: OBSIDIAN, margin: "0 0 12px", lineHeight: 1.25, letterSpacing: "-0.015em" }}>
                    {post.title}
                  </h3>
                  <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 13, color: ASH, lineHeight: 1.7, margin: "0 0 20px" }}>
                    {post.excerpt}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: BRASS }}>
                    <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Read</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {rest.length === 0 && (
            <div style={{ textAlign: "center", padding: "64px 0" }}>
              <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 14, color: ASH }}>No articles in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ background: PINE, padding: "96px 32px", borderTop: "1px solid rgba(183,146,86,0.15)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BRASS }}>The Journal</span>
          <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 40, fontWeight: 400, color: BONE, letterSpacing: "-0.025em", margin: "14px 0 16px", lineHeight: 1.05 }}>New articles, when they're ready.</h2>
          <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 14, color: "rgba(245,242,235,0.55)", lineHeight: 1.72, margin: "0 0 36px" }}>
            Not a weekly newsletter. We publish when we have something worth saying.
          </p>
          <div style={{ display: "flex", gap: 8, maxWidth: 440, margin: "0 auto" }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{ flex: 1, fontFamily: "var(--font-archivo), sans-serif", fontSize: 14, color: BONE, background: "rgba(245,242,235,0.08)", border: "1px solid rgba(245,242,235,0.18)", borderRadius: 4, padding: "14px 16px", outline: "none" }}
            />
            <button style={{ background: BRASS, color: OBSIDIAN, border: "none", cursor: "pointer", fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "14px 22px", borderRadius: 4, whiteSpace: "nowrap", transition: "background 0.15s" }} onMouseEnter={e => { e.currentTarget.style.background = "#C9A866"; }} onMouseLeave={e => { e.currentTarget.style.background = BRASS; }}>
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
