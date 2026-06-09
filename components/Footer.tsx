"use client";

import { useRouter } from "next/navigation";
import { FitMark } from "@/components/FitMark";

export function Footer() {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);

  const go = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const link = (path: string, label: string) => (
    <button
      key={path + label}
      onClick={() => go(path)}
      style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-archivo), sans-serif", fontSize: 13, color: "rgba(245,242,235,0.55)", textAlign: "left", padding: 0, transition: "color 0.15s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#F5F2EB"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(245,242,235,0.55)"; }}
    >{label}</button>
  );

  const col = (heading: string, items: [string, string][]) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#B79256" }}>{heading}</span>
      {items.map(([path, label]) => link(path, label))}
    </div>
  );

  return (
    <footer style={{ background: "#101114", borderTop: "1px solid rgba(183,146,86,0.18)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px 40px" }}>
        <div className="fy-stack" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 22, fontWeight: 600, color: "#F5F2EB" }}>Fits You</span>
              <FitMark size={8} />
            </div>
            <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 13, color: "rgba(245,242,235,0.45)", lineHeight: 1.75, maxWidth: 280, margin: 0 }}>
              Personalized meal kits, supplements, and training — calibrated precisely to you. Delivered across the US.
            </p>
            <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, color: "rgba(245,242,235,0.25)", lineHeight: 1.65, maxWidth: 300, margin: 0 }}>
              Results vary. Individual outcomes depend on many factors. Fits You provides general information, not medical advice — consult a qualified healthcare provider before starting any nutrition, supplement, or training program. Supplement statements have not been evaluated by the FDA and are not intended to diagnose, treat, cure, or prevent any disease.
            </p>
          </div>
          {col("Program", [["/how","How It Fits"],["/plan","Plan Builder"],["/meal-kits","Meal Kits"],["/supplements","Supplements"],["/training","Training"]])}
          {col("Company", [["/about","About"],["/blog","Journal"],["/stories","Stories"],["/pricing","Pricing"],["/trust","FAQ"]])}
          {col("Legal", [["/privacy","Privacy Policy"],["/terms","Terms of Service"],["/trust","Results Disclaimer"]])}
        </div>

        <div style={{ borderTop: "1px solid rgba(183,146,86,0.12)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 12, color: "rgba(245,242,235,0.28)" }}>© 2024 Fits You · fitsyou.net</span>
          <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#B79256" }}>Measured. Made for one.</span>
        </div>
      </div>
    </footer>
  );
}
