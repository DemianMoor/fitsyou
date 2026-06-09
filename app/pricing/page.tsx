"use client";

import { useRouter } from "next/navigation";
import { FitMark } from "@/components/FitMark";
import { ArrowRight, Check } from "lucide-react";

const BRASS = "#B79256", OBSIDIAN = "#101114", BONE = "#F5F2EB", ASH = "#6B6A66", EMBER = "#D9603B", PINE = "#2F3A30";


const PLANS = [
  {
    name: "Essentials",
    price: "$129",
    cadence: "/ week",
    desc: "The foundation — meal kits calibrated to your macros.",
    includes: ["4 meal kits per week","Personalized recipes","Macro-matched portions","Digital plan dashboard","Pause or cancel anytime"],
    excludes: ["Supplements","Training protocol","Dietitian check-ins"],
    highlight: false,
  },
  {
    name: "Full Fit",
    price: "$199",
    cadence: "/ week",
    desc: "The complete system — kits, stack, and training in one plan.",
    includes: ["6 meal kits per week","Personalized supplement stack","Custom training protocol","Digital plan dashboard","Monthly dietitian check-in","Quarterly full recalibration","Priority support"],
    excludes: [],
    highlight: true,
  },
  {
    name: "Kits + Stack",
    price: "$159",
    cadence: "/ week",
    desc: "Meal kits and personalized supplements — no training protocol.",
    includes: ["4 meal kits per week","Personalized supplement stack","Macro-matched portions","Digital plan dashboard","Pause or cancel anytime"],
    excludes: ["Training protocol","Dietitian check-ins"],
    highlight: false,
  },
];

const FAQ_PRICING = [
  ["Is there a minimum commitment?", "No. You can pause or cancel your plan at any time from your account. We don't believe in trapping you in something that isn't working."],
  ["What's in the supplement stack?", "Your formulation is specific to you — not a standard product. It's reviewed by a registered dietitian and ships monthly."],
  ["How many meals per week?", "Essentials and Kits + Stack include 4 meals per week. Full Fit includes 6. You can adjust your meal count after your first box."],
  ["Is delivery included?", "Yes. Delivery is included in all plan prices, across all 50 states."],
  ["Can I switch plans?", "Yes — any time. Changes take effect at the next billing cycle."],
];

export default function PricingPage() {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const go = (path: string) => { navigate(path); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <div style={{ paddingTop: 64 }}>
      {/* Header */}
      <section style={{ background: OBSIDIAN, padding: "96px 32px 72px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: BRASS }}>Pricing</span>
          <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(44px, 5vw, 72px)", fontWeight: 400, color: BONE, letterSpacing: "-0.03em", margin: "16px 0 20px", lineHeight: 1.0 }}>
            Clear. Confident.<br /><em style={{ fontStyle: "italic", color: BRASS }}>No dark patterns.</em>
          </h1>
          <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 16, color: "rgba(245,242,235,0.6)", lineHeight: 1.75, maxWidth: 480, margin: "0 auto" }}>
            All prices shown are the full price. No hidden fees. No bait-and-switch. No mandatory add-ons.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section style={{ background: BONE, padding: "96px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
            {PLANS.map(plan => (
              <div
                key={plan.name}
                style={{
                  background: plan.highlight ? OBSIDIAN : BONE,
                  border: plan.highlight ? "none" : "1px solid rgba(16,17,20,0.1)",
                  padding: "52px 40px",
                  position: "relative",
                }}
              >
                {plan.highlight && (
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: BRASS }} />
                )}
                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: plan.highlight ? BRASS : ASH }}>{plan.name}</span>
                    {plan.highlight && <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: OBSIDIAN, background: BRASS, padding: "4px 10px", borderRadius: 2 }}>Most complete</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }}>
                    <span style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 52, fontWeight: 400, color: plan.highlight ? BONE : OBSIDIAN, letterSpacing: "-0.025em", lineHeight: 1 }}>{plan.price}</span>
                    <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 13, color: plan.highlight ? "rgba(245,242,235,0.5)" : ASH }}>{plan.cadence}</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 14, color: plan.highlight ? "rgba(245,242,235,0.6)" : ASH, lineHeight: 1.65, margin: 0 }}>{plan.desc}</p>
                </div>

                <div style={{ borderTop: `1px solid ${plan.highlight ? "rgba(245,242,235,0.1)" : "rgba(16,17,20,0.09)"}`, paddingTop: 28, marginBottom: 32 }}>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {plan.includes.map(item => (
                      <li key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Check size={13} color={BRASS} strokeWidth={2.5} />
                        <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 13, color: plan.highlight ? "rgba(245,242,235,0.8)" : OBSIDIAN }}>{item}</span>
                      </li>
                    ))}
                    {plan.excludes.map(item => (
                      <li key={item} style={{ display: "flex", alignItems: "center", gap: 10, opacity: 0.35 }}>
                        <span style={{ width: 13, height: 13, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ width: 8, height: 1, background: plan.highlight ? BONE : OBSIDIAN }} />
                        </span>
                        <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 13, color: plan.highlight ? "rgba(245,242,235,0.5)" : ASH, textDecoration: "line-through" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => navigate("/plan")}
                  style={{
                    background: plan.highlight ? EMBER : "transparent",
                    color: plan.highlight ? BONE : OBSIDIAN,
                    border: plan.highlight ? "none" : `1px solid ${OBSIDIAN}`,
                    cursor: "pointer",
                    fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    padding: "16px 24px", borderRadius: 4,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    width: "100%", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => {
                    if (plan.highlight) { e.currentTarget.style.background = "#C04F2A"; }
                    else { e.currentTarget.style.background = OBSIDIAN; e.currentTarget.style.color = BONE; }
                  }}
                  onMouseLeave={e => {
                    if (plan.highlight) { e.currentTarget.style.background = EMBER; }
                    else { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = OBSIDIAN; }
                  }}
                >
                  Start with {plan.name} <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 12, color: ASH, textAlign: "center", marginTop: 24, lineHeight: 1.65 }}>
            All plans include free delivery. Cancel or pause anytime from your account — no calls required.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: OBSIDIAN, padding: "96px 32px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BRASS }}>Questions</span>
          <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 44, fontWeight: 400, color: BONE, letterSpacing: "-0.025em", margin: "14px 0 48px", lineHeight: 1.05 }}>Pricing, plain.</h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {FAQ_PRICING.map(([q, a], i, arr) => (
              <div key={q} style={{ padding: "32px 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(245,242,235,0.08)" : "none" }}>
                <h3 style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 15, fontWeight: 600, color: BONE, margin: "0 0 12px", letterSpacing: "-0.01em" }}>{q}</h3>
                <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 14, color: "rgba(245,242,235,0.55)", lineHeight: 1.72, margin: 0 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
