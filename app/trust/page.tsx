"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FitMark } from "@/components/FitMark";
import { ChevronDown } from "lucide-react";

const BRASS = "#B79256", OBSIDIAN = "#101114", BONE = "#F5F2EB", ASH = "#6B6A66";


const SECTIONS = [
  {
    heading: "About Fits You",
    faqs: [
      ["What is Fits You?", "Fits You is a personalized nutrition and training service. We deliver weekly meal kits, monthly supplement formulations, and digital training protocols — all calibrated to your specific body, goals, and lifestyle."],
      ["Who is Fits You for?", "Anyone who wants a more precise approach to how they eat and move. We don't target a specific age, body type, or fitness level — we calibrate to whoever you are now."],
      ["Is Fits You available in my area?", "We deliver meal kits and supplements across all 50 US states. Delivery times vary by location."],
    ],
  },
  {
    heading: "Meal Kits",
    faqs: [
      ["How are the recipes personalized?", "Your recipes are built to match your macro targets — protein, carbohydrates, fat, and calories — calculated from your intake profile. As your targets change, your recipes change."],
      ["Are the ingredients fresh?", "Yes. All meal kit ingredients are fresh, never frozen. Kits are shipped in insulated packaging and designed to be cooked within 5 days of delivery."],
      ["Can I skip a week?", "Yes. Pause or skip any delivery from your account — no calls required. Changes made before Wednesday take effect the following week."],
      ["What if I have allergies?", "You specify your allergens and intolerances during intake. We build your recipes around them. We cannot guarantee a fully allergen-free facility, so please consult your physician if you have a severe allergy."],
    ],
  },
  {
    heading: "Supplements",
    faqs: [
      ["Are the supplements safe?", "Every supplement batch is third-party tested for purity and potency. Formulations are reviewed by a registered dietitian before shipping. Always consult a qualified healthcare provider before beginning any supplement regimen."],
      ["Do supplements treat or cure anything?", "No. Supplement statements have not been evaluated by the Food and Drug Administration. Our supplements are not intended to diagnose, treat, cure, or prevent any disease."],
      ["What if I'm already taking supplements?", "Note your current supplements during intake. Our dietitian team will review for interactions and adjust your formulation accordingly."],
    ],
  },
  {
    heading: "Results and expectations",
    faqs: [
      ["What results can I expect?", "Results vary significantly between individuals. Many factors affect outcomes, including adherence, starting point, health history, sleep, stress, and consistency. We do not make specific outcome promises."],
      ["How long until I notice a difference?", "This varies widely. Some people notice changes in energy and performance within a few weeks. Others take longer. Results depend on many factors we cannot fully control."],
      ["Do I need to exercise for this to work?", "No — though combining good nutrition with consistent movement will generally produce better outcomes. Your plan adapts to whatever level of activity you currently have."],
    ],
  },
  {
    heading: "Billing and cancellation",
    faqs: [
      ["How do I cancel?", "Log into your account and select Manage Plan. You can pause or cancel at any time — no phone call required."],
      ["Is there a cancellation fee?", "No. There is no cancellation fee or minimum commitment."],
      ["When am I billed?", "You are billed weekly for your plan, at the start of each delivery cycle. Supplements are billed monthly."],
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(16,17,20,0.09)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", padding: "24px 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}
      >
        <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 15, fontWeight: 600, color: OBSIDIAN, lineHeight: 1.4 }}>{q}</span>
        <ChevronDown size={16} color={BRASS} style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && (
        <div style={{ paddingBottom: 24 }}>
          <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 14, color: ASH, lineHeight: 1.75, margin: 0 }}>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function TrustFAQPage() {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const go = (path: string) => { navigate(path); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <div style={{ paddingTop: 64 }}>
      {/* Header */}
      <section style={{ background: OBSIDIAN, padding: "96px 32px 72px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: BRASS }}>Trust + FAQ</span>
          <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(44px, 5vw, 72px)", fontWeight: 400, color: BONE, letterSpacing: "-0.03em", margin: "16px 0 20px", lineHeight: 1.0 }}>
            Straight answers.<br /><em style={{ fontStyle: "italic", color: BRASS }}>No fine print traps.</em>
          </h1>
        </div>
      </section>

      {/* Trust commitments */}
      <section style={{ background: BONE, padding: "96px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BRASS }}>Our commitments</span>
          <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 44, fontWeight: 400, color: OBSIDIAN, letterSpacing: "-0.025em", margin: "14px 0 56px", lineHeight: 1.05 }}>How we operate.</h2>
          <div className="fy-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
            {[
              { label: "No dark patterns", desc: "Cancel from your account in under two minutes. No phone calls, no retention scripts, no friction." },
              { label: "Honest copy", desc: "We don't promise specific results. We don't use before-and-after imagery without clear labeling. We don't shame anyone into buying." },
              { label: "Transparent ingredients", desc: "Every supplement ingredient and dosage is disclosed. No proprietary blends that hide what's inside." },
              { label: "Dietitian oversight", desc: "Every supplement formulation is reviewed by a registered dietitian before shipping. Not an algorithm alone." },
              { label: "Third-party testing", desc: "All supplement batches are independently tested for purity and potency. Certificates of analysis available on request." },
              { label: "Results vary — always", desc: "We include a results disclaimer wherever a transformation or outcome appears. Individual results depend on many factors we don't fully control." },
            ].map(({ label, desc }, i) => (
              <div key={label} style={{ background: i % 2 === 0 ? OBSIDIAN : "#1A1E22", padding: "40px 36px" }}>
                <FitMark size={14} className="mb-4" />
                <h3 style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 13, fontWeight: 700, color: BONE, margin: "16px 0 10px", letterSpacing: "0.04em" }}>{label}</h3>
                <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 13, color: "rgba(245,242,235,0.55)", lineHeight: 1.72, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ accordion */}
      <section style={{ background: BONE, padding: "96px 32px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          {SECTIONS.map(section => (
            <div key={section.heading} style={{ marginBottom: 56 }}>
              <h2 style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BRASS, margin: "0 0 4px" }}>{section.heading}</h2>
              <div style={{ width: 32, height: 1, background: "rgba(183,146,86,0.35)", marginBottom: 24 }} />
              {section.faqs.map(([q, a]) => <FAQItem key={q} q={q} a={a} />)}
            </div>
          ))}

          {/* Results disclaimer block */}
          <div style={{ background: "#F0EDE5", border: "1px solid rgba(16,17,20,0.1)", borderRadius: 4, padding: "32px", marginTop: 16 }}>
            <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BRASS, display: "block", marginBottom: 12 }}>Results disclaimer</span>
            <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 13, color: ASH, lineHeight: 1.75, margin: 0 }}>
              Individual results vary significantly. Many factors influence outcomes, including adherence, baseline health, sleep, stress, and consistency of effort. No specific results are guaranteed or implied by Fits You or any of its representatives. Supplement statements have not been evaluated by the Food and Drug Administration and are not intended to diagnose, treat, cure, or prevent any disease.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
