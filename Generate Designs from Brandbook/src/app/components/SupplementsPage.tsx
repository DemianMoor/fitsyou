import { useNavigate } from "react-router";
import { FitMark } from "./FitMark";
import { ArrowRight } from "lucide-react";

const BRASS = "#B79256", OBSIDIAN = "#101114", BONE = "#F5F2EB", ASH = "#6B6A66", PINE = "#2F3A30";


const STACK = [
  { name: "Foundation", label: "Daily baseline", items: ["Vitamin D3 + K2","Magnesium glycinate","Omega-3 (EPA/DHA)","Zinc + Copper"], note: "Included in all plans" },
  { name: "Performance", label: "Training support", items: ["Creatine monohydrate","Electrolyte complex","Beta-alanine","L-Carnitine"], note: "Added based on training profile" },
  { name: "Recovery", label: "Rest and repair", items: ["Ashwagandha (KSM-66)","Tart cherry extract","L-Glycine","Phosphatidylserine"], note: "Added based on recovery data" },
  { name: "Gaps", label: "Your specific needs", items: ["Iron (if indicated)","B12 (plant-forward plans)","Iodine","Personalized additions"], note: "Derived from your intake and goals" },
];

export function SupplementsPage() {
  const navigate = useNavigate();
  const go = (path: string) => { navigate(path); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <div style={{ paddingTop: 64 }}>
      {/* Header */}
      <section style={{ background: OBSIDIAN, padding: "96px 32px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: BRASS }}>Supplements</span>
            <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(44px, 5vw, 76px)", fontWeight: 400, color: BONE, letterSpacing: "-0.03em", margin: "16px 0 24px", lineHeight: 0.97 }}>
              A stack<br /><em style={{ fontStyle: "italic", color: BRASS }}>built for you.</em>
            </h1>
            <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 16, color: "rgba(245,242,235,0.6)", lineHeight: 1.78, margin: "0 0 32px", maxWidth: 440 }}>
              Not a shelf multivitamin. A personalized formulation — derived from your intake, your gaps, your training load, your goals.
            </p>
            <button onClick={() => navigate("/plan")} style={{ background: BONE, color: OBSIDIAN, border: "none", cursor: "pointer", fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "14px 28px", borderRadius: 4, display: "inline-flex", alignItems: "center", gap: 8, transition: "background 0.15s, color 0.15s" }} onMouseEnter={e => { e.currentTarget.style.background = "#D9603B"; e.currentTarget.style.color = BONE; }} onMouseLeave={e => { e.currentTarget.style.background = BONE; e.currentTarget.style.color = OBSIDIAN; }}>
              Build your stack <ArrowRight size={13} />
            </button>
          </div>
          <div>
            <FitMark size={28} padded={false}>
              <div style={{ padding: 20 }}>
                <img src="https://images.unsplash.com/photo-1585830812369-b88fce3bee22?w=700&h=700&fit=crop&auto=format" alt="Supplement capsules on dark surface — clinical and clean" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: 6, display: "block", opacity: 0.75 }} />
              </div>
            </FitMark>
          </div>
        </div>
      </section>

      {/* Disclaimer band */}
      <section style={{ background: PINE, borderTop: "1px solid rgba(183,146,86,0.15)", borderBottom: "1px solid rgba(183,146,86,0.15)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "18px 32px" }}>
          <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 11, color: "rgba(245,242,235,0.5)", margin: 0, lineHeight: 1.6 }}>
            These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare provider before beginning any supplement program.
          </p>
        </div>
      </section>

      {/* Stack breakdown */}
      <section style={{ background: OBSIDIAN, padding: "96px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: BRASS }}>The formulation</span>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 48, fontWeight: 400, color: BONE, letterSpacing: "-0.025em", margin: "14px 0 0", lineHeight: 1.05 }}>
              Four layers.<br /><em style={{ fontStyle: "italic", color: "rgba(245,242,235,0.4)" }}>One precise stack.</em>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {STACK.map((layer, i) => (
              <div key={layer.name} style={{ background: i % 2 === 0 ? "#141719" : "#161B1C", padding: "48px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                  <div>
                    <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BRASS }}>{layer.label}</span>
                    <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 32, fontWeight: 400, color: BONE, margin: "8px 0 0", letterSpacing: "-0.02em" }}>{layer.name}</h3>
                  </div>
                  <FitMark size={14} />
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {layer.items.map(item => (
                    <li key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ width: 6, height: 1, background: BRASS, flexShrink: 0 }} />
                      <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 14, color: "rgba(245,242,235,0.72)" }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ borderTop: "1px solid rgba(183,146,86,0.14)", paddingTop: 16 }}>
                  <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 11, color: "rgba(183,146,86,0.65)", letterSpacing: "0.06em" }}>{layer.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it's formulated */}
      <section style={{ background: BONE, padding: "128px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 96, alignItems: "center" }}>
          <div>
            <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BRASS }}>The process</span>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 48, fontWeight: 400, color: OBSIDIAN, letterSpacing: "-0.025em", margin: "16px 0 24px", lineHeight: 1.05 }}>
              No guessing.<br /><em style={{ fontStyle: "italic", color: ASH }}>No fads.</em>
            </h2>
            <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 15, color: ASH, lineHeight: 1.78, margin: "0 0 32px" }}>
              Your supplement formulation is derived from your intake data — not from a quiz about symptoms. Our registered dietitians review each stack before it ships. Everything is third-party tested.
            </p>
            <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: "rgba(16,17,20,0.4)", lineHeight: 1.65 }}>
              Results vary. Individual outcomes depend on many factors including adherence, baseline health, and lifestyle. Supplement statements have not been evaluated by the FDA.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              ["Intake analysis", "Your responses reveal nutrient gaps and performance needs specific to you."],
              ["Dietitian review", "A registered dietitian reviews your profile and confirms the formulation."],
              ["Third-party testing", "Every batch is independently tested for purity and potency."],
              ["Monthly delivery", "Your stack ships monthly in a single, clearly labeled pack."],
              ["Ongoing calibration", "As your plan evolves, your stack evolves. Re-formulated quarterly."],
            ].map(([label, desc], i, arr) => (
              <div key={label} style={{ padding: "26px 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(16,17,20,0.09)" : "none", display: "flex", gap: 22 }}>
                <span style={{ fontFamily: "Fraunces, serif", fontSize: 32, fontWeight: 300, color: BRASS, opacity: 0.38, minWidth: 48, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, fontWeight: 600, color: OBSIDIAN, marginBottom: 5 }}>{label}</div>
                  <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: ASH, lineHeight: 1.65, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
