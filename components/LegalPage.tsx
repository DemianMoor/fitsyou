import Link from "next/link";
import { FitMark } from "@/components/FitMark";

const BRASS = "#B79256", OBSIDIAN = "#101114", BONE = "#F5F2EB", ASH = "#6B6A66";

export type LegalSection = { h: string; p?: string[]; list?: string[] };

/**
 * On-brand scaffold for legal pages. Copy is a starting draft for counsel —
 * the DRAFT banner makes that explicit on-page.
 */
export function LegalPage({
  title,
  updated,
  intro,
  sections,
  bodyHtml,
}: {
  title: string;
  updated?: string;
  intro?: string;
  sections?: LegalSection[];
  /** Admin-managed HTML body. When set, renders in place of intro/sections and
   *  hides the draft banner (this is final, edited content). */
  bodyHtml?: string;
}) {
  return (
    <div style={{ paddingTop: 64 }}>
      <section style={{ background: OBSIDIAN, padding: "72px 32px 56px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <FitMark size={12} />
          <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(36px, 4.5vw, 60px)", fontWeight: 400, color: BONE, letterSpacing: "-0.025em", margin: "20px 0 12px", lineHeight: 1.05 }}>{title}</h1>
          <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 12, color: ASH, margin: 0 }}>{updated}</p>
        </div>
      </section>

      {/* Draft banner — only for the built-in fallback copy, not admin content. */}
      {!bodyHtml && (
        <section style={{ background: "#1A1E23", borderBottom: "1px solid rgba(183,146,86,0.15)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto", padding: "14px 32px" }}>
            <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, color: "rgba(245,242,235,0.5)", margin: 0, lineHeight: 1.6 }}>
              <strong style={{ color: BRASS, fontWeight: 700 }}>DRAFT · COUNSEL COPY HERE</strong> — starting language for counsel to finalize before launch. Not yet final legal advice.
            </p>
          </div>
        </section>
      )}

      <section style={{ background: BONE, padding: "64px 32px 112px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {bodyHtml ? (
            <div className="fy-legal-prose" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          ) : (
            <>
              {intro && <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 16, color: OBSIDIAN, lineHeight: 1.8, margin: "0 0 40px" }}>{intro}</p>}
              {sections?.map((s) => (
                <div key={s.h} style={{ marginBottom: 36 }}>
                  <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 24, fontWeight: 400, color: OBSIDIAN, letterSpacing: "-0.015em", margin: "0 0 14px" }}>{s.h}</h2>
                  {s.p?.map((t, i) => (
                    <p key={i} style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 15, color: ASH, lineHeight: 1.78, margin: "0 0 12px" }}>{t}</p>
                  ))}
                  {s.list && (
                    <ul style={{ margin: "8px 0 0", paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                      {s.list.map((t) => (
                        <li key={t} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <span style={{ width: 6, height: 1, background: BRASS, marginTop: 12, flexShrink: 0 }} />
                          <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 15, color: ASH, lineHeight: 1.78 }}>{t}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </>
          )}
          <div style={{ borderTop: "1px solid rgba(16,17,20,0.1)", paddingTop: 24, marginTop: 8 }}>
            <Link href="/" style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: BRASS, textDecoration: "none" }}>← Back home</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
