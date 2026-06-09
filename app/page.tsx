"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FitMark } from "@/components/FitMark";
import { BrandImage } from "@/components/BrandImage";
import { ArrowRight, ChevronDown } from "lucide-react";

const BRASS = "#B79256";
const OBSIDIAN = "#101114";
const BONE = "#F5F2EB";
const EMBER = "#D9603B";
const ASH = "#6B6A66";
const PINE = "#2F3A30";

function PrimaryBtn({ label, onClick }: { label: string; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? EMBER : BONE, color: hov ? BONE : OBSIDIAN,
        border: "none", cursor: "pointer",
        fontFamily: "var(--font-archivo), sans-serif", fontSize: 12, fontWeight: 700,
        letterSpacing: "0.12em", textTransform: "uppercase",
        padding: "16px 32px", borderRadius: 4,
        display: "inline-flex", alignItems: "center", gap: 8,
        transition: "background 0.18s, color 0.18s",
      }}
    >
      {label} <ArrowRight size={13} />
    </button>
  );
}

function GhostBtn({ label, onClick, light = false }: { label: string; onClick: () => void; light?: boolean }) {
  const [hov, setHov] = useState(false);
  const base = light ? "rgba(245,242,235,0.2)" : "rgba(16,17,20,0.15)";
  const baseText = light ? "rgba(245,242,235,0.65)" : ASH;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? (light ? "rgba(245,242,235,0.1)" : "rgba(16,17,20,0.06)") : "transparent",
        color: hov ? (light ? BONE : OBSIDIAN) : baseText,
        border: `1px solid ${hov ? (light ? "rgba(245,242,235,0.5)" : "rgba(16,17,20,0.4)") : base}`,
        cursor: "pointer",
        fontFamily: "var(--font-archivo), sans-serif", fontSize: 12, fontWeight: 600,
        letterSpacing: "0.1em", textTransform: "uppercase",
        padding: "16px 28px", borderRadius: 4, transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

export default function HomePage() {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 60); return () => clearTimeout(t); }, []);

  const go = (path: string) => { navigate(path); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div style={{ background: BONE }}>
      {/* ── HERO ── */}
      <section style={{ background: OBSIDIAN, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden", paddingTop: 64 }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "rgba(183,146,86,0.35)" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", width: "100%", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(28px)", transition: "opacity 0.85s ease, transform 0.85s ease" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div>
              <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: BRASS }}>Measured. Made for one.</span>
              <div style={{ width: 40, height: 1, background: "rgba(183,146,86,0.35)", marginTop: 10 }} />
            </div>

            <FitMark size={28} padded={false}>
              <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(52px, 6.5vw, 96px)", fontWeight: 400, color: BONE, lineHeight: 0.97, letterSpacing: "-0.03em", margin: 0, padding: "20px 24px" }}>
                Built to<br /><em style={{ fontStyle: "italic", color: BRASS }}>fit you.</em>
              </h1>
            </FitMark>

            <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 17, color: "rgba(245,242,235,0.6)", lineHeight: 1.75, maxWidth: 420, margin: 0, opacity: vis ? 1 : 0, transition: "opacity 0.8s ease 0.35s" }}>
              Every meal kit, supplement stack, and training plan is calibrated to your body and goals. Not a template. Yours.
            </p>

            <div style={{ display: "flex", gap: 16, opacity: vis ? 1 : 0, transition: "opacity 0.8s ease 0.55s" }}>
              <PrimaryBtn label="Build your plan" onClick={() => go("/plan")} />
              <GhostBtn label="How it works" onClick={() => go("/how")} light />
            </div>
          </div>

          <div style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(32px)", transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s" }}>
            <FitMark size={32} padded={false}>
              <div style={{ padding: 14 }}>
                <div style={{ aspectRatio: "4/5", overflow: "hidden", borderRadius: 6, position: "relative" }}>
                  <BrandImage
                    src="/images/home/hero-portrait.jpg"
                    alt="Chef pouring sauce over a precisely plated steak — editorial food photography"
                    fill
                    priority
                    sizes="(max-width: 900px) 100vw, 45vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </FitMark>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, opacity: vis ? 0.45 : 0, transition: "opacity 1s ease 1.2s" }}>
          <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: BRASS }}>Scroll</span>
          <ChevronDown size={13} color={BRASS} />
        </div>
      </section>

      {/* ── CREDIBILITY BAND ── */}
      <section style={{ background: PINE, borderTop: "1px solid rgba(183,146,86,0.2)", borderBottom: "1px solid rgba(183,146,86,0.2)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "22px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          {["Delivered across all 50 states","Calibrated to your biology, not a template","No lock-in — pause or cancel anytime","Registered dietitians on staff"].map(t => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <FitMark size={10} />
              <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: "0.04em", color: "rgba(245,242,235,0.72)" }}>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE IDEA ── */}
      <section style={{ background: BONE, padding: "128px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 96, alignItems: "center" }}>
          <div>
            <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BRASS }}>The concept</span>
            <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 400, color: OBSIDIAN, letterSpacing: "-0.025em", lineHeight: 1.08, margin: "16px 0 28px" }}>
              A tailor measures<br />before they cut.<br /><em style={{ fontStyle: "italic", color: ASH }}>So do we.</em>
            </h2>
            <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 16, color: ASH, lineHeight: 1.78, maxWidth: 420, margin: "0 0 32px" }}>
              Generic plans are designed for everyone — which means they're built for no one. Fits You begins with a precise intake of your body, goals, and life. Everything that follows is derived from that.
            </p>
            <GhostBtn label="See how it works" onClick={() => go("/how")} />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              { n: "01", label: "Measured", desc: "A rigorous intake — body metrics, goals, training history, food preferences, lifestyle." },
              { n: "02", label: "Calibrated", desc: "Our system, built with registered dietitians, produces your unique targets and plan." },
              { n: "03", label: "Delivered", desc: "Meal kits, supplement stack, and training protocol. Yours. To your door, weekly." },
            ].map((s, i) => (
              <div key={s.n} style={{ display: "flex", gap: 24, padding: "32px 0", borderBottom: i < 2 ? "1px solid rgba(16,17,20,0.09)" : "none" }}>
                <span style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 42, fontWeight: 300, color: BRASS, lineHeight: 1, minWidth: 56, opacity: 0.5 }}>{s.n}</span>
                <div>
                  <div style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: OBSIDIAN, marginBottom: 8 }}>{s.label}</div>
                  <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 14, color: ASH, lineHeight: 1.72, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FULL-BLEED FOOD SHOT ── */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ aspectRatio: "21/8", position: "relative" }}>
          <BrandImage src="/images/home/editorial-band.jpg" alt="Beautifully plated dish — fine dining editorial" fill sizes="100vw" style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(16,17,20,0.75) 0%, rgba(16,17,20,0.1) 65%)" }} />
          <div style={{ position: "absolute", top: "50%", left: 80, transform: "translateY(-50%)" }}>
            <FitMark size={22} padded={false}>
              <div style={{ padding: "20px 28px" }}>
                <p style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 30, fontStyle: "italic", color: BONE, margin: 0, lineHeight: 1.3, maxWidth: 420 }}>"Food is the vehicle.<br />Performance is the destination."</p>
                <div style={{ marginTop: 14, width: 36, height: 1, background: BRASS }} />
              </div>
            </FitMark>
          </div>
        </div>
      </section>

      {/* ── THREE PARTS ── */}
      <section style={{ background: BONE, padding: "128px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56 }}>
            <div>
              <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BRASS }}>What you receive</span>
              <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 48, fontWeight: 400, color: OBSIDIAN, letterSpacing: "-0.025em", margin: "12px 0 0", lineHeight: 1.05 }}>Three parts.<br />One fit.</h2>
            </div>
            <GhostBtn label="Start your intake" onClick={() => go("/plan")} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
            {[
              { path: "/meal-kits", tag: "01", label: "Meal Kits", desc: "Weekly boxes matched to your macros and palate. Every recipe built for your goals — fueled, not filled.", img: "/images/home/meal-kits.jpg", alt: "Dark bowl with spoon — editorial food photography" },
              { path: "/supplements", tag: "02", label: "Supplements", desc: "A personalized stack — not a generic multivitamin. Formulated around your intake gaps and performance targets.", img: "/images/home/supplements.jpg", alt: "Supplement capsules on dark surface" },
              { path: "/training", tag: "03", label: "Training", desc: "Movement programming built around your schedule, equipment, and output goals. Synced with your nutrition.", img: "/images/home/training.jpg", alt: "Athlete training with kettlebell" },
            ].map(card => (
              <div key={card.path} onClick={() => go(card.path)} style={{ cursor: "pointer", position: "relative", overflow: "hidden", background: OBSIDIAN, aspectRatio: "3/4" }}
                onMouseEnter={e => { const img = e.currentTarget.querySelector("img") as HTMLElement; if (img) img.style.transform = "scale(1.05)"; }}
                onMouseLeave={e => { const img = e.currentTarget.querySelector("img") as HTMLElement; if (img) img.style.transform = "scale(1)"; }}
              >
                <BrandImage src={card.img} alt={card.alt} fill sizes="(max-width: 900px) 100vw, 33vw" style={{ objectFit: "cover", opacity: 0.55, transition: "transform 0.55s ease" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(16,17,20,0.95) 0%, transparent 55%)" }} />
                <div style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}>
                  <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BRASS }}>{card.tag}</span>
                  <h3 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 28, fontWeight: 400, color: BONE, margin: "8px 0 12px", lineHeight: 1 }}>{card.label}</h3>
                  <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 13, color: "rgba(245,242,235,0.6)", lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
                </div>
                <div style={{ position: "absolute", top: 24, right: 24 }}><ArrowRight size={15} color="rgba(245,242,235,0.35)" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORIES TEASER ── */}
      <section style={{ background: OBSIDIAN, padding: "128px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56 }}>
            <div>
              <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BRASS }}>Stories</span>
              <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 48, fontWeight: 400, color: BONE, letterSpacing: "-0.025em", margin: "12px 0 0", lineHeight: 1.05 }}>Built for real people.<br /><em style={{ fontStyle: "italic", color: "rgba(245,242,235,0.4)" }}>Results vary.</em></h2>
            </div>
            <button onClick={() => go("/stories")} style={{ background: "none", border: "1px solid rgba(245,242,235,0.2)", color: "rgba(245,242,235,0.6)", cursor: "pointer", fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "12px 22px", borderRadius: 4, transition: "all 0.15s" }} onMouseEnter={e => { e.currentTarget.style.color = BONE; e.currentTarget.style.borderColor = "rgba(245,242,235,0.45)"; }} onMouseLeave={e => { e.currentTarget.style.color = "rgba(245,242,235,0.6)"; e.currentTarget.style.borderColor = "rgba(245,242,235,0.2)"; }}>All stories</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {[
              { name: "M.T., 38", title: "I started cooking again.", quote: "I hadn't cooked a real meal in two years. Fits You showed me what worked for my body — and made it easy to act on." },
              { name: "D.A., 44", title: "Strength I didn't expect.", quote: "The training and nutrition worked together in a way I hadn't found before. Three months in, I was hitting numbers I'd been chasing for years." },
            ].map(s => (
              <div key={s.name} style={{ background: "#161A1F", padding: "52px" }}>
                <FitMark size={18} padded={false}>
                  <div style={{ padding: "8px 12px" }}>
                    <p style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 22, fontStyle: "italic", color: BONE, lineHeight: 1.55, margin: 0 }}>"{s.quote}"</p>
                  </div>
                </FitMark>
                <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid rgba(183,146,86,0.18)" }}>
                  <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: BRASS }}>{s.name}</span>
                  <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, color: "rgba(245,242,235,0.32)", margin: "4px 0 0" }}>{s.title} — SAMPLE — replace with real customer</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: EMBER, padding: "112px 32px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <FitMark size={28} className="block" padded>
            <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(36px, 4.5vw, 60px)", fontWeight: 400, color: BONE, letterSpacing: "-0.025em", margin: "0 0 18px", lineHeight: 1.05 }}>Your fit starts here.</h2>
            <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 16, color: "rgba(245,242,235,0.8)", lineHeight: 1.72, margin: "0 0 36px" }}>Ten minutes. Your body, your goals, your preferences — the plan calibrates itself around you.</p>
            <button onClick={() => go("/plan")} style={{ background: BONE, color: OBSIDIAN, border: "none", cursor: "pointer", fontFamily: "var(--font-archivo), sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "18px 40px", borderRadius: 4, display: "inline-flex", alignItems: "center", gap: 8, transition: "background 0.15s, color 0.15s" }} onMouseEnter={e => { e.currentTarget.style.background = OBSIDIAN; e.currentTarget.style.color = BONE; }} onMouseLeave={e => { e.currentTarget.style.background = BONE; e.currentTarget.style.color = OBSIDIAN; }}>
              Begin the intake <ArrowRight size={13} />
            </button>
          </FitMark>
        </div>
      </section>
    </div>
  );
}
