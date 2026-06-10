"use client";

import { useRouter } from "next/navigation";
import { FitMark } from "@/components/FitMark";
import { ArrowRight } from "lucide-react";

const BRASS = "#B79256", OBSIDIAN = "#101114", BONE = "#F5F2EB", ASH = "#6B6A66", PINE = "#2F3A30";


const steps = [
  { num: "01", label: "The Intake", sub: "Measure", bg: OBSIDIAN,
    desc: "You answer a precise set of questions — body composition, health history, training, sleep, stress, food preferences, goals. Not a five-minute quiz. A real calibration.",
    points: ["Body metrics and composition goals","Health and injury history","Training frequency and type","Sleep and recovery patterns","Dietary preferences and restrictions"] },
  { num: "02", label: "The Calibration", sub: "Calculate", bg: PINE,
    desc: "Our system — developed with registered dietitians and exercise scientists — translates your intake into exact targets: macros, micronutrient gaps, caloric needs, training load. Nothing averaged.",
    points: ["Personalized macro and calorie targets","Micronutrient gap analysis","Supplement formulation","Training load recommendation","Weekly adaptation schedule"] },
  { num: "03", label: "The Plan", sub: "Build", bg: OBSIDIAN,
    desc: "Your meal kits, supplement stack, and training plan are assembled from your calibration. Meals match your macros and palate. The stack fills your gaps. Training syncs with your nutrition.",
    points: ["Weekly meal kits (2, 4, or 6 meals)","Personalized supplement formulation","Progressive training protocol","Digital plan dashboard","Registered dietitian access"] },
  { num: "04", label: "The Delivery", sub: "Deliver", bg: PINE,
    desc: "Kits arrive weekly. Supplements ship monthly. Your training protocol lives in the app. Adjust any variable and the plan recalibrates around the change.",
    points: ["Weekly insulated meal kit delivery","Monthly supplement subscription","In-app training tracker","Anytime plan adjustments","Quarterly full recalibration"] },
];

export default function HowItFitsPage() {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const go = (path: string) => { navigate(path); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const jumpTo = (e: React.MouseEvent, id: string) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  return (
    <div style={{ paddingTop: 64 }}>
      {/* Header */}
      <section style={{ background: OBSIDIAN, padding: "96px 32px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: BRASS }}>How it fits</span>
          <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(44px, 6vw, 84px)", fontWeight: 400, color: BONE, letterSpacing: "-0.03em", margin: "16px 0 24px", lineHeight: 0.97 }}>
            The engine<br /><em style={{ fontStyle: "italic", color: BRASS }}>behind the fit.</em>
          </h1>
          <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 16, color: "rgba(245,242,235,0.6)", lineHeight: 1.75, maxWidth: 520, margin: 0 }}>
            Four precise steps. Intake → Calibration → Plan → Delivery. Every variable in the system traces back to you.
          </p>
        </div>
      </section>

      {/* Flow diagram */}
      <section style={{ background: BONE, padding: "80px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="fy-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 2 }}>
            {steps.map((s, i) => (
              <a key={s.num} href={`#step-${s.num}`} onClick={e => jumpTo(e, `step-${s.num}`)} className="fy-flow-card" style={{ background: i % 2 === 0 ? OBSIDIAN : PINE, padding: "48px 36px", position: "relative", display: "block", textDecoration: "none", cursor: "pointer" }}>
                <span style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 64, fontWeight: 300, color: BRASS, opacity: 0.25, lineHeight: 1, display: "block", marginBottom: 16 }}>{s.num}</span>
                <div style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BRASS, marginBottom: 6 }}>{s.sub}</div>
                <h3 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 24, fontWeight: 400, color: BONE, margin: "0 0 16px", lineHeight: 1.1 }}>{s.label}</h3>
                {i < 3 && (
                  <div className="fy-flow-arrow" style={{ position: "absolute", top: "50%", right: -12, transform: "translateY(-50%)", zIndex: 1, width: 22, height: 22, background: BONE, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                    <ArrowRight size={11} color={OBSIDIAN} />
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Steps deep-dive */}
      {steps.map((step, i) => (
        <section key={step.num} id={`step-${step.num}`} style={{ background: step.bg, scrollMarginTop: 64 }}>
          <div className="fy-stack" style={{ maxWidth: 1280, margin: "0 auto", padding: "96px 32px", display: "grid", gridTemplateColumns: i % 2 === 0 ? "1fr 1fr" : "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div style={{ order: i % 2 === 0 ? 1 : 2 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 28 }}>
                <span style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 72, fontWeight: 300, color: BRASS, lineHeight: 1, opacity: 0.35 }}>{step.num}</span>
                <div>
                  <div style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BRASS, marginBottom: 4 }}>{step.sub}</div>
                  <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 40, fontWeight: 400, color: BONE, margin: 0, letterSpacing: "-0.02em" }}>{step.label}</h2>
                </div>
              </div>
              <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 15, color: "rgba(245,242,235,0.65)", lineHeight: 1.8, marginBottom: 36 }}>{step.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {step.points.map(pt => (
                  <li key={pt} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 8, height: 1, background: BRASS, flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 13, color: "rgba(245,242,235,0.72)", letterSpacing: "0.01em" }}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ order: i % 2 === 0 ? 2 : 1 }}>
              <FitMark size={22} padded={false}>
                <div style={{ padding: "48px", background: "rgba(245,242,235,0.04)", border: "1px solid rgba(183,146,86,0.14)", borderRadius: 8, minHeight: 320, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
                  <div style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BRASS, marginBottom: 4 }}>Step {step.num}</div>
                  {step.points.map((pt, pi) => (
                    <div key={pt} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <span style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 16, fontWeight: 300, color: BRASS, opacity: 0.5, lineHeight: 1, minWidth: 22 }}>{String(pi + 1).padStart(2,"0")}</span>
                      <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 14, color: "rgba(245,242,235,0.65)", lineHeight: 1.5 }}>{pt}</span>
                    </div>
                  ))}
                </div>
              </FitMark>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section style={{ background: BONE, padding: "96px 32px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 48, fontWeight: 400, color: OBSIDIAN, letterSpacing: "-0.025em", margin: "0 0 18px" }}>Ready to be measured?</h2>
          <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 15, color: ASH, lineHeight: 1.72, margin: "0 0 36px" }}>Ten minutes to a plan that actually fits.</p>
          <button onClick={() => navigate("/plan")} style={{ background: OBSIDIAN, color: BONE, border: "none", cursor: "pointer", fontFamily: "var(--font-archivo), sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "18px 40px", borderRadius: 4, display: "inline-flex", alignItems: "center", gap: 8, transition: "background 0.15s" }} onMouseEnter={e => { e.currentTarget.style.background = "#D9603B"; }} onMouseLeave={e => { e.currentTarget.style.background = OBSIDIAN; }}>
            Build your plan <ArrowRight size={13} />
          </button>
        </div>
      </section>
    </div>
  );
}
