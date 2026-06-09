"use client";

import { useRouter } from "next/navigation";
import { FitMark } from "@/components/FitMark";
import { ArrowRight } from "lucide-react";

const BRASS = "#B79256", OBSIDIAN = "#101114", BONE = "#F5F2EB";

export type Story = {
  key: string;
  title: string;
  quote: string;
  attribution: string;
  img: string;
  imageAlt: string;
};

// Clearly-labeled SAMPLE placeholders. Shown until real, consented customer
// stories (published `articles` with pillar='stories') exist. NEVER presented
// as real customers or real results.
const SAMPLE_STORIES = [
  { initials: "M.T.", age: "38", title: "I started cooking again.", quote: "I hadn't cooked a real meal in two years. Fits You showed me what actually worked for my body — and made it easy to act on. The recipes weren't just nutritious. They were something I wanted to eat.", duration: "6 months on the plan", img: "https://images.unsplash.com/photo-1470468969717-61d5d54fd036?w=600&h=700&fit=crop&auto=format" },
  { initials: "D.A.", age: "44", title: "Strength I didn't expect.", quote: "The training and nutrition worked together in a way I hadn't experienced. Three months in, I was hitting personal bests I'd been chasing for two years. Results vary — I know that. This was mine.", duration: "5 months on the plan", img: "https://images.unsplash.com/photo-1434596922112-19c563067271?w=600&h=700&fit=crop&auto=format" },
  { initials: "R.M.", age: "51", title: "Energy I'd forgotten about.", quote: "I'd accepted that I'd be tired. It turned out I wasn't eating for my body at all. The supplement stack filled gaps I didn't know I had. Six weeks in, I noticed the difference.", duration: "4 months on the plan", img: "https://images.unsplash.com/photo-1590556409324-aa1d726e5c3c?w=600&h=700&fit=crop&auto=format" },
  { initials: "S.K.", age: "33", title: "The plan adapted with me.", quote: "When I told the system I was training for a half marathon, my meal plan changed within a week. The carb timing was different. The portion sizes shifted. It felt like it was watching.", duration: "8 months on the plan", img: "https://images.unsplash.com/photo-1607962252666-2c33af3c6ba6?w=600&h=700&fit=crop&auto=format" },
];

export function StoriesView({ stories }: { stories: Story[] | null }) {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const hasReal = !!stories && stories.length > 0;

  return (
    <div style={{ paddingTop: 64 }}>
      {/* Header */}
      <section style={{ background: OBSIDIAN, padding: "96px 32px 72px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: BRASS }}>Stories</span>
          <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(44px, 6vw, 84px)", fontWeight: 400, color: BONE, letterSpacing: "-0.03em", margin: "16px 0 20px", lineHeight: 0.97 }}>
            Real people.<br /><em style={{ fontStyle: "italic", color: BRASS }}>Real plans.</em>
          </h1>
          <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 15, color: "rgba(245,242,235,0.5)", lineHeight: 1.72, maxWidth: 520, margin: 0 }}>
            {hasReal
              ? "Shared with consent by people on a Fits You plan. Results vary — individual outcomes depend on many factors."
              : "Every story here is a sample placeholder — labeled clearly as such. We will never present generated experiences as real customer results. Results vary. Individual outcomes depend on many factors."}
          </p>
        </div>
      </section>

      {/* Disclaimer banner */}
      <section style={{ background: "#1A1E23", borderBottom: `1px solid rgba(183,146,86,0.15)` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 32px", display: "flex", alignItems: "center", gap: 12 }}>
          <FitMark size={10} />
          <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, color: "rgba(245,242,235,0.45)", margin: 0, lineHeight: 1.6 }}>
            {hasReal ? (
              <>
                <strong style={{ color: BRASS, fontWeight: 700 }}>RESULTS VARY</strong> — Stories are shared with consent and reflect individual experiences. They are not typical or guaranteed outcomes.
              </>
            ) : (
              <>
                <strong style={{ color: BRASS, fontWeight: 700 }}>SAMPLE CONTENT</strong> — All stories on this page are illustrative placeholders. Real customer stories will replace these before launch. Results vary. No outcomes are guaranteed.
              </>
            )}
          </p>
        </div>
      </section>

      {/* Stories grid */}
      <section style={{ background: OBSIDIAN, padding: "2px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {hasReal
              ? stories!.map((s, i) => (
                  <div key={s.key} style={{ background: i % 2 === 0 ? "#141719" : "#161B1C" }}>
                    {s.img && (
                      <div style={{ aspectRatio: "4/3", overflow: "hidden", position: "relative" }}>
                        <img src={s.img} alt={s.imageAlt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 45%, rgba(20,23,25,0.85) 100%)" }} />
                      </div>
                    )}
                    <div style={{ padding: "48px" }}>
                      <FitMark size={18} padded={false}>
                        <div style={{ padding: "8px 12px" }}>
                          <p style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 20, fontStyle: "italic", color: BONE, lineHeight: 1.58, margin: 0 }}>&ldquo;{s.quote}&rdquo;</p>
                        </div>
                      </FitMark>
                      <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid rgba(183,146,86,0.15)" }}>
                        {s.attribution && (
                          <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: BRASS }}>{s.attribution}</span>
                        )}
                        {s.title && (
                          <p style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 16, fontStyle: "italic", color: "rgba(245,242,235,0.6)", margin: "4px 0 6px" }}>{s.title}</p>
                        )}
                        <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, color: "rgba(245,242,235,0.28)", margin: 0 }}>Results vary — individual experience.</p>
                      </div>
                    </div>
                  </div>
                ))
              : SAMPLE_STORIES.map((s, i) => (
                  <div key={s.initials} style={{ background: i % 2 === 0 ? "#141719" : "#161B1C" }}>
                    <div style={{ aspectRatio: "4/3", overflow: "hidden", position: "relative" }}>
                      <img src={s.img} alt={`${s.title} — SAMPLE, not a real customer`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.5 }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(20,23,25,0.95) 100%)" }} />
                      <div style={{ position: "absolute", bottom: 24, left: 24, background: "rgba(16,17,20,0.8)", padding: "6px 12px", borderRadius: 2, borderLeft: `2px solid ${BRASS}` }}>
                        <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: BRASS }}>SAMPLE — not a real customer</span>
                      </div>
                    </div>
                    <div style={{ padding: "48px" }}>
                      <FitMark size={18} padded={false}>
                        <div style={{ padding: "8px 12px" }}>
                          <p style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 20, fontStyle: "italic", color: BONE, lineHeight: 1.58, margin: 0 }}>&ldquo;{s.quote}&rdquo;</p>
                        </div>
                      </FitMark>
                      <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid rgba(183,146,86,0.15)" }}>
                        <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: BRASS }}>{s.initials}, {s.age}</span>
                        <p style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 16, fontStyle: "italic", color: "rgba(245,242,235,0.6)", margin: "4px 0 6px" }}>{s.title}</p>
                        <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, color: "rgba(245,242,235,0.28)", margin: 0 }}>{s.duration} · SAMPLE — replace with real customer</p>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Disclaimer footer */}
      <section style={{ background: "#141719", padding: "48px 32px", borderTop: "1px solid rgba(183,146,86,0.1)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 12, color: "rgba(245,242,235,0.35)", lineHeight: 1.7, margin: "0 0 32px" }}>
            Individual results vary significantly. These stories represent a range of possible experiences and are not representative of typical outcomes. Many factors influence results, including adherence, starting point, health status, and lifestyle. No specific outcomes are guaranteed or implied.
          </p>
          <button onClick={() => navigate("/plan")} style={{ background: "none", border: `1px solid rgba(183,146,86,0.3)`, color: BRASS, cursor: "pointer", fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "14px 28px", borderRadius: 4, display: "inline-flex", alignItems: "center", gap: 8, transition: "all 0.15s" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(183,146,86,0.08)"; e.currentTarget.style.borderColor = BRASS; }} onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "rgba(183,146,86,0.3)"; }}>
            Build your own plan <ArrowRight size={13} />
          </button>
        </div>
      </section>
    </div>
  );
}
