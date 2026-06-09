"use client";

import { useRouter } from "next/navigation";
import { FitMark } from "@/components/FitMark";
import { BrandImage } from "@/components/BrandImage";
import { ArrowRight } from "lucide-react";

const BRASS = "#B79256", OBSIDIAN = "#101114", BONE = "#F5F2EB", ASH = "#6B6A66", PINE = "#2F3A30", EMBER = "#D9603B";

export default function AboutPage() {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const go = (path: string) => { navigate(path); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const team = [
    { name: "Nadia Reyes", role: "Co-founder & CEO", bio: "Former head of product at a precision diagnostics company. Has been obsessed with what personalization actually means — not just in tech, but in how we feed ourselves." },
    { name: "Dr. Marcus Webb", role: "Co-founder & Chief Dietitian", bio: "Registered dietitian and exercise physiologist. Spent twelve years in clinical sports nutrition before deciding the tools for everyday people were too generic to be useful." },
    { name: "Priya Anand", role: "Head of Culinary", bio: "Trained at the CIA. Worked in fine-dining kitchens in New York and Copenhagen before joining Fits You to prove that precision nutrition doesn't have to taste like discipline." },
    { name: "Jonah Kim", role: "Head of Engineering", bio: "Built two previous companies in health-data infrastructure. Joined because he believes the gap between what we know about nutrition and what we actually eat is a software problem." },
  ];

  return (
    <div style={{ paddingTop: 64 }}>
      {/* Header */}
      <section style={{ background: OBSIDIAN, padding: "96px 32px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: BRASS }}>About</span>
            <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(44px, 5.5vw, 80px)", fontWeight: 400, color: BONE, letterSpacing: "-0.03em", margin: "16px 0 24px", lineHeight: 0.97 }}>
              We got tired of<br /><em style={{ fontStyle: "italic", color: BRASS }}>generic.</em>
            </h1>
            <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 16, color: "rgba(245,242,235,0.62)", lineHeight: 1.78, margin: 0, maxWidth: 460 }}>
              Fits You started from a simple frustration: the gap between what we know about nutrition science and what actually reaches the kitchen is enormous. Generic meal plans, shelf multivitamins, and one-size training programs exist because personalization is hard — not because it's impossible.
            </p>
          </div>
          <div>
            <FitMark size={28} padded={false}>
              <div style={{ padding: 16 }}>
                <div style={{ position: "relative", aspectRatio: "7/6", overflow: "hidden", borderRadius: 6 }}>
                  <BrandImage
                    src="/images/about/team.jpg"
                    alt="The Fits You team working together — natural light"
                    fill
                    sizes="(max-width: 900px) 100vw, 45vw"
                    style={{ objectFit: "cover", opacity: 0.78 }}
                  />
                </div>
              </div>
            </FitMark>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section style={{ background: BONE, padding: "128px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 2fr", gap: 96, alignItems: "start" }}>
          <div>
            <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BRASS }}>Mission</span>
            <div style={{ width: 32, height: 1, background: "rgba(183,146,86,0.4)", marginTop: 12 }} />
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 400, color: OBSIDIAN, lineHeight: 1.35, letterSpacing: "-0.015em", margin: "0 0 32px" }}>
              "The tools to eat and move precisely exist. The science is there. What's been missing is a system that brings it all the way to your door — calibrated to you, not to a demographic."
            </p>
            <div style={{ width: 40, height: 1, background: BRASS, marginBottom: 24 }} />
            <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 15, color: ASH, lineHeight: 1.78, maxWidth: 560 }}>
              We built Fits You to close that gap. Not a wellness app, not a subscription box with aspirational packaging. A precision system — intake, calibration, delivery — that actually accounts for who you are.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: PINE, padding: "96px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BRASS }}>How we operate</span>
          <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 44, fontWeight: 400, color: BONE, letterSpacing: "-0.025em", margin: "14px 0 56px", lineHeight: 1.05 }}>Four commitments.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {[
              { n: "01", label: "Precision over simplicity", desc: "We don't round down to make the numbers easier. Every plan reflects the actual complexity of your biology and goals." },
              { n: "02", label: "Honesty about outcomes", desc: "Results vary. We say that everywhere it matters, and we mean it. No implied guarantees, no before-and-after theatre." },
              { n: "03", label: "Dietitian-led, not algorithm-only", desc: "Every formulation is reviewed by a human. The system surfaces the data; a registered dietitian interprets it." },
              { n: "04", label: "No dark patterns", desc: "Cancel in under two minutes. No retention calls. No manufactured urgency. You stay because it works for you, or you don't." },
            ].map((v, i) => (
              <div key={v.n} style={{ background: i % 2 === 0 ? "rgba(245,242,235,0.05)" : "rgba(245,242,235,0.03)", padding: "48px", border: "1px solid rgba(183,146,86,0.1)" }}>
                <span style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 52, fontWeight: 300, color: BRASS, opacity: 0.28, lineHeight: 1, display: "block", marginBottom: 16 }}>{v.n}</span>
                <h3 style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 14, fontWeight: 700, color: BONE, margin: "0 0 12px", letterSpacing: "0.03em" }}>{v.label}</h3>
                <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 14, color: "rgba(245,242,235,0.6)", lineHeight: 1.72, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ background: BONE, padding: "128px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BRASS }}>The team</span>
          <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 44, fontWeight: 400, color: OBSIDIAN, letterSpacing: "-0.025em", margin: "14px 0 56px", lineHeight: 1.05 }}>
            Built by people who<br /><em style={{ fontStyle: "italic", color: ASH }}>felt the gap.</em>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {team.map((member, i) => (
              <div key={member.name} style={{ background: i % 2 === 0 ? OBSIDIAN : "#1A1E22", padding: "48px" }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(183,146,86,0.15)", border: "1px solid rgba(183,146,86,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <span style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 18, fontWeight: 400, color: BRASS }}>
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 22, fontWeight: 400, color: BONE, margin: "0 0 4px" }}>{member.name}</h3>
                  <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: BRASS }}>{member.role}</span>
                </div>
                <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 14, color: "rgba(245,242,235,0.6)", lineHeight: 1.75, margin: 0 }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: EMBER, padding: "96px 32px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 48, fontWeight: 400, color: BONE, letterSpacing: "-0.025em", margin: "0 0 18px" }}>Ready to start?</h2>
          <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 15, color: "rgba(245,242,235,0.8)", lineHeight: 1.72, margin: "0 0 36px" }}>Ten minutes to a plan that's actually yours.</p>
          <button onClick={() => go("/plan")} style={{ background: BONE, color: OBSIDIAN, border: "none", cursor: "pointer", fontFamily: "var(--font-archivo), sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "18px 40px", borderRadius: 4, display: "inline-flex", alignItems: "center", gap: 8, transition: "background 0.15s, color 0.15s" }} onMouseEnter={e => { e.currentTarget.style.background = OBSIDIAN; e.currentTarget.style.color = BONE; }} onMouseLeave={e => { e.currentTarget.style.background = BONE; e.currentTarget.style.color = OBSIDIAN; }}>
            Build your plan <ArrowRight size={13} />
          </button>
        </div>
      </section>
    </div>
  );
}
