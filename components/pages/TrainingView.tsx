"use client";

import { useRouter } from "next/navigation";
import { FitMark } from "@/components/FitMark";
import { BrandImage } from "@/components/BrandImage";
import { ArrowRight } from "lucide-react";

const BRASS = "#B79256", OBSIDIAN = "#101114", BONE = "#F5F2EB", PINE = "#2F3A30", EMBER = "#D9603B";

export type Protocol = {
  name: string;
  tag: string;
  desc: string;
  weeks: string;
  sessions: string;
  equipment: string;
};

const FALLBACK_PROTOCOLS: Protocol[] = [
  { name: "Strength", tag: "Lift-focused", desc: "Progressive overload programs built around your frequency and equipment. Tied directly to your protein and caloric targets.", weeks: "12-week progressive cycles", sessions: "3–5× / week", equipment: "Barbell, dumbbells, or bands" },
  { name: "Endurance", tag: "Cardio-focused", desc: "Running, cycling, or rowing programs calibrated to your aerobic base. Nutrition synced to session duration and intensity.", weeks: "8-week build cycles", sessions: "4–6× / week", equipment: "Minimal — track and trail" },
  { name: "Hybrid", tag: "Strength + cardio", desc: "A combined protocol for those who train across modalities. Balances recovery, fuel, and output across all types of sessions.", weeks: "Ongoing adaptive cycles", sessions: "4–5× / week", equipment: "Full gym recommended" },
  { name: "Mobility", tag: "Movement quality", desc: "Structured mobility and movement quality work — designed to complement any other training type or stand alone.", weeks: "Continuous", sessions: "Daily or 3–4× / week", equipment: "Mat, bands" },
];

export function TrainingView({ protocols }: { protocols: Protocol[] | null }) {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const list = protocols ?? FALLBACK_PROTOCOLS;

  return (
    <div style={{ paddingTop: 64 }}>
      {/* Header */}
      <section style={{ background: OBSIDIAN, padding: "96px 32px" }}>
        <div className="fy-stack" style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: BRASS }}>Training</span>
            <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(44px, 5vw, 76px)", fontWeight: 400, color: BONE, letterSpacing: "-0.03em", margin: "16px 0 24px", lineHeight: 0.97 }}>
              Movement<br /><em style={{ fontStyle: "italic", color: BRASS }}>built for your body.</em>
            </h1>
            <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 16, color: "rgba(245,242,235,0.6)", lineHeight: 1.78, margin: "0 0 32px", maxWidth: 440 }}>
              Your training protocol is derived from the same intake as your nutrition plan. The two systems are synchronized — nutrition fuels training, training informs nutrition.
            </p>
            <button onClick={() => navigate("/plan")} style={{ background: EMBER, color: BONE, border: "none", cursor: "pointer", fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "14px 28px", borderRadius: 4, display: "inline-flex", alignItems: "center", gap: 8, transition: "background 0.15s" }} onMouseEnter={e => { e.currentTarget.style.background = "#C04F2A"; }} onMouseLeave={e => { e.currentTarget.style.background = EMBER; }}>
              Build your protocol <ArrowRight size={13} />
            </button>
          </div>
          <div>
            <FitMark size={28} padded={false}>
              <div style={{ padding: 16 }}>
                <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", borderRadius: 6 }}>
                  <BrandImage src="/images/training/hero.jpg" alt="Athlete training — natural light, confident, strong" fill sizes="(max-width: 900px) 100vw, 45vw" style={{ objectFit: "cover" }} placeholderLabel="Sample" />
                  <div style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(16,17,20,0.82)", padding: "8px 14px", borderRadius: 2, borderLeft: `2px solid ${BRASS}` }}>
                    <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: BRASS }}>SAMPLE — not a real client</span>
                  </div>
                </div>
              </div>
            </FitMark>
          </div>
        </div>
      </section>

      {/* Protocols */}
      <section style={{ background: BONE, padding: "128px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BRASS }}>Training protocols</span>
            <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 48, fontWeight: 400, color: OBSIDIAN, letterSpacing: "-0.025em", margin: "14px 0 0", lineHeight: 1.05 }}>
              Your plan, your method.
            </h2>
          </div>

          <div className="fy-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {list.map((p, i) => (
              <div key={p.name} style={{ background: i % 2 === 0 ? OBSIDIAN : PINE, padding: "52px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                  <div>
                    {p.tag && <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BRASS }}>{p.tag}</span>}
                    <h3 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 36, fontWeight: 400, color: BONE, margin: "8px 0 0", letterSpacing: "-0.02em" }}>{p.name}</h3>
                  </div>
                </div>
                {p.desc && <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 14, color: "rgba(245,242,235,0.6)", lineHeight: 1.75, margin: "0 0 28px" }}>{p.desc}</p>}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 20, borderTop: "1px solid rgba(183,146,86,0.14)" }}>
                  {([["Cycle", p.weeks], ["Frequency", p.sessions], ["Equipment", p.equipment]] as [string, string][])
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k} style={{ display: "flex", gap: 12 }}>
                        <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: BRASS, minWidth: 80 }}>{k}</span>
                        <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 13, color: "rgba(245,242,235,0.65)" }}>{v}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sync section */}
      <section style={{ background: OBSIDIAN, padding: "96px 32px" }}>
        <div className="fy-stack" style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 96, alignItems: "center" }}>
          <div>
            <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BRASS }}>The sync</span>
            <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 48, fontWeight: 400, color: BONE, letterSpacing: "-0.025em", margin: "16px 0 24px", lineHeight: 1.05 }}>
              Training and nutrition<br /><em style={{ fontStyle: "italic", color: BRASS }}>in one system.</em>
            </h2>
            <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 15, color: "rgba(245,242,235,0.6)", lineHeight: 1.78, margin: "0 0 32px" }}>
              Most programs treat food and movement as separate variables. Fits You ties them together from the start. A hard training week adjusts your meal plan. A rest week recalibrates your macros. One system, not two.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              ["Training log syncs nutrition", "Log a session and your next kit reflects the additional fuel need."],
              ["Rest day macros", "Lower-intensity days automatically reduce caloric targets."],
              ["Performance checkpoints", "Monthly reviews assess progress and adjust load accordingly."],
              ["Injury modifications", "Flag a limitation and your protocol adapts around it."],
            ].map(([label, desc], i, arr) => (
              <div key={label} style={{ padding: "28px 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(245,242,235,0.07)" : "none", display: "flex", gap: 22 }}>
                <span style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 34, fontWeight: 300, color: BRASS, opacity: 0.35, minWidth: 48, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 13, fontWeight: 600, color: BONE, marginBottom: 5 }}>{label}</div>
                  <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 13, color: "rgba(245,242,235,0.55)", lineHeight: 1.65, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
