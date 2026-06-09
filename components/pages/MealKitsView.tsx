"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FitMark } from "@/components/FitMark";
import { ArrowRight } from "lucide-react";

const BRASS = "#B79256", OBSIDIAN = "#101114", BONE = "#F5F2EB", EMBER = "#D9603B", ASH = "#6B6A66";

export type MealCard = {
  name: string;
  tag: string;
  cal: number | null;
  protein: number | null;
  carb: number | null;
  fat: number | null;
  img: string;
  placeholder?: boolean;
};

const FALLBACK_MEALS: MealCard[] = [
  { name: "Seared Salmon, Miso Braised Greens", tag: "High protein · Omega-rich", cal: 520, protein: 46, carb: 28, fat: 24, img: "https://images.unsplash.com/photo-1663530761401-15eefb544889?w=700&h=900&fit=crop&auto=format", placeholder: true },
  { name: "Grass-Fed Sirloin, Roasted Root Veg", tag: "Strength recovery · Iron-forward", cal: 640, protein: 52, carb: 38, fat: 22, img: "https://images.unsplash.com/photo-1750943082231-0d84cfabc4dd?w=700&h=900&fit=crop&auto=format", placeholder: true },
  { name: "Lemongrass Chicken, Forbidden Rice", tag: "Endurance focus · Complex carbs", cal: 580, protein: 44, carb: 58, fat: 14, img: "https://images.unsplash.com/photo-1727952846147-d406806b169a?w=700&h=900&fit=crop&auto=format", placeholder: true },
  { name: "White Bean Stew, Herb Oil, Sourdough", tag: "Plant-forward · High fiber", cal: 480, protein: 22, carb: 68, fat: 16, img: "https://images.unsplash.com/photo-1590394072807-12f9869e3907?w=700&h=900&fit=crop&auto=format", placeholder: true },
];

const FILTERS = ["All", "High Protein", "Endurance", "Plant-Forward", "Recovery"];

export function MealKitsView({ meals }: { meals: MealCard[] | null }) {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const [filter, setFilter] = useState("All");

  const list = meals ?? FALLBACK_MEALS;

  return (
    <div style={{ paddingTop: 64 }}>
      {/* Header */}
      <section style={{ background: OBSIDIAN, padding: "96px 32px 64px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "flex-end" }}>
          <div>
            <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: BRASS }}>Meal kits</span>
            <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(44px, 5vw, 76px)", fontWeight: 400, color: BONE, letterSpacing: "-0.03em", margin: "16px 0 0", lineHeight: 0.97 }}>
              Cooked for<br /><em style={{ fontStyle: "italic", color: BRASS }}>your numbers.</em>
            </h1>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 16, color: "rgba(245,242,235,0.6)", lineHeight: 1.78, margin: "0 0 28px" }}>
              Every recipe hits your exact macro targets. Fresh ingredients, precise portions, zero guesswork. You cook it. It fits.
            </p>
            <button onClick={() => navigate("/plan")} style={{ background: EMBER, color: BONE, border: "none", cursor: "pointer", fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "14px 28px", borderRadius: 4, display: "inline-flex", alignItems: "center", gap: 8, transition: "background 0.15s" }} onMouseEnter={e => { e.currentTarget.style.background = "#C04F2A"; }} onMouseLeave={e => { e.currentTarget.style.background = EMBER; }}>
              Get your kit <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section style={{ background: OBSIDIAN, borderTop: "1px solid rgba(183,146,86,0.12)", borderBottom: "1px solid rgba(183,146,86,0.12)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "14px 32px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? BRASS : "transparent", border: `1px solid ${filter === f ? BRASS : "rgba(183,146,86,0.2)"}`, color: filter === f ? OBSIDIAN : "rgba(245,242,235,0.5)", cursor: "pointer", fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 16px", borderRadius: 4, transition: "all 0.15s" }}>
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Meal grid */}
      <section style={{ background: OBSIDIAN }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {list.map(meal => (
              <div key={meal.name} style={{ position: "relative", overflow: "hidden", cursor: "pointer", background: "#0C0E10" }}
                onMouseEnter={e => { const img = e.currentTarget.querySelector("img") as HTMLElement; if (img) img.style.transform = "scale(1.04)"; }}
                onMouseLeave={e => { const img = e.currentTarget.querySelector("img") as HTMLElement; if (img) img.style.transform = "scale(1)"; }}
              >
                <div style={{ aspectRatio: "3/4", position: "relative", overflow: "hidden" }}>
                  {meal.img && <img src={meal.img} alt={meal.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.62, transition: "transform 0.6s ease" }} />}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,14,16,1) 0%, transparent 58%)" }} />
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "36px" }}>
                  <FitMark size={16} padded={false}>
                    <div style={{ padding: "24px" }}>
                      <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: BRASS }}>{meal.tag}</span>
                      <h3 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 24, fontWeight: 400, color: BONE, margin: "10px 0 20px", lineHeight: 1.15 }}>{meal.name}</h3>
                      <div style={{ display: "flex", gap: 24 }}>
                        {[["Cal", meal.cal], ["Protein", meal.protein != null ? `${meal.protein}g` : null], ["Carbs", meal.carb != null ? `${meal.carb}g` : null], ["Fat", meal.fat != null ? `${meal.fat}g` : null]]
                          .filter(([, v]) => v != null && v !== "")
                          .map(([k, v]) => (
                            <div key={k as string}>
                              <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 18, fontWeight: 300, color: BONE, lineHeight: 1 }}>{v}</div>
                              <div style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,242,235,0.38)", marginTop: 3 }}>{k}</div>
                            </div>
                          ))}
                      </div>
                      {meal.placeholder && (
                        <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 9, color: "rgba(245,242,235,0.22)", margin: "14px 0 0" }}>Placeholder — real food photography coming</p>
                      )}
                    </div>
                  </FitMark>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How kits work */}
      <section style={{ background: BONE, padding: "128px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 96, alignItems: "center" }}>
          <div>
            <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BRASS }}>How it works</span>
            <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 48, fontWeight: 400, color: OBSIDIAN, letterSpacing: "-0.025em", margin: "16px 0 24px", lineHeight: 1.05 }}>
              Not just healthy.<br /><em style={{ fontStyle: "italic", color: ASH }}>Calibrated.</em>
            </h2>
            <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 15, color: ASH, lineHeight: 1.78 }}>
              Every recipe in your box is calculated to hit your exact macro and caloric targets. As your plan evolves — training harder, shifting goals — your kit adjusts at the next delivery.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              ["Weekly delivery", "Arrives every Monday. Insulated, sustainably packaged."],
              ["Pre-portioned", "Exact ingredients for your macros. No measuring, no waste."],
              ["30-minute recipes", "Designed for efficiency — technique, not time."],
              ["Adaptive", "Update your goals and your recipes adjust at the next delivery."],
            ].map(([label, desc], i, arr) => (
              <div key={label} style={{ padding: "28px 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(16,17,20,0.09)" : "none", display: "flex", gap: 24 }}>
                <span style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 36, fontWeight: 300, color: BRASS, opacity: 0.4, minWidth: 52, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 13, fontWeight: 600, color: OBSIDIAN, marginBottom: 6 }}>{label}</div>
                  <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 13, color: ASH, lineHeight: 1.65, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
