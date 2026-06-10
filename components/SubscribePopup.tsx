"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FitMark } from "@/components/FitMark";
import { X } from "lucide-react";

const BRASS = "#B79256", OBSIDIAN = "#101114", BONE = "#F5F2EB", EMBER = "#D9603B", ASH = "#6B6A66";
const SEEN_KEY = "fy_subscribe_seen";
const DELAY_MS = 15000;

/**
 * Session-capped subscribe popup. TCPA-compliant: explicit, unchecked consent
 * boxes; SMS consent is separate from email; consent timestamps are recorded
 * server-side (app/api/subscribe). No PII is ever placed in a URL. Suppressed
 * on /plan (the conversion flow) so it never covers the Plan Builder.
 */
export function SubscribePopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (pathname === "/plan") return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SEEN_KEY)) return;
    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, [pathname]);

  const dismiss = () => {
    setOpen(false);
    try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* ignore */ }
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (!(data.get("consent_email"))) {
      setStatus("error");
      setErrorMsg("Please agree to receive emails to subscribe.");
      return;
    }
    const phone = String(data.get("phone") ?? "").trim();
    if (phone && !data.get("consent_sms")) {
      setStatus("error");
      setErrorMsg("To receive texts, please check the SMS consent box — or remove your phone number.");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          name: data.get("name"),
          phone: data.get("phone"),
          consent_email: Boolean(data.get("consent_email")),
          consent_sms: Boolean(data.get("consent_sms")),
          website: data.get("website"), // honeypot
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(json.error ?? "Something went wrong.");
        return;
      }
      setStatus("done");
      try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* ignore */ }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  if (!open) return null;

  const inputStyle: React.CSSProperties = {
    width: "100%", fontFamily: "var(--font-archivo), sans-serif", fontSize: 14, color: BONE,
    background: "rgba(245,242,235,0.06)", border: "1px solid rgba(245,242,235,0.18)",
    borderRadius: 4, padding: "12px 14px", outline: "none", marginBottom: 12,
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, color: "rgba(245,242,235,0.6)",
    lineHeight: 1.55, display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 10, cursor: "pointer",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Subscribe to Fits You"
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(16,17,20,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={dismiss}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", width: "100%", maxWidth: 440, background: OBSIDIAN, border: "1px solid rgba(183,146,86,0.3)", borderRadius: 6, padding: "40px 36px" }}
      >
        <button onClick={dismiss} aria-label="Close" style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "rgba(245,242,235,0.5)", padding: 4 }}>
          <X size={18} />
        </button>

        {status === "done" ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <FitMark size={14} />
            <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 26, fontWeight: 400, color: BONE, margin: "20px 0 10px" }}>You&apos;re on the list.</h2>
            <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 13, color: "rgba(245,242,235,0.55)", lineHeight: 1.7, margin: 0 }}>
              We&apos;ll be in touch when there&apos;s something worth your time.
            </p>
          </div>
        ) : (
          <>
            <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BRASS }}>Fits You</span>
            <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 28, fontWeight: 400, color: BONE, letterSpacing: "-0.02em", margin: "10px 0 8px", lineHeight: 1.1 }}>
              Built for one. <em style={{ fontStyle: "italic", color: BRASS }}>Maybe you.</em>
            </h2>
            <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 13, color: "rgba(245,242,235,0.55)", lineHeight: 1.65, margin: "0 0 24px" }}>
              Occasional notes on the method behind the plan. No spam, no daily blasts.
            </p>

            <form onSubmit={onSubmit}>
              {/* Honeypot — visually hidden, off-screen, not announced */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />

              <input name="email" type="email" required placeholder="your@email.com" style={inputStyle} />
              <input name="name" type="text" placeholder="First name (optional)" style={inputStyle} />
              <input name="phone" type="tel" placeholder="Mobile number (optional)" style={inputStyle} />

              <label style={labelStyle}>
                <input name="consent_email" type="checkbox" required style={{ marginTop: 2, accentColor: BRASS }} />
                <span>I agree to receive marketing emails from Fits You. I can unsubscribe anytime. See our <a href="/privacy" style={{ color: BRASS }}>Privacy Policy</a>.</span>
              </label>

              <label style={labelStyle}>
                <input name="consent_sms" type="checkbox" style={{ marginTop: 2, accentColor: BRASS }} />
                <span>
                  By providing your phone number and checking this box, you are consenting to receive marketing text messages to that number from Fits You. Message frequency varies. Message and data rates may apply. Text HELP for help. Text STOP to unsubscribe. SMS opt-in data will not be shared or sold with 3rd parties.
                </span>
              </label>

              <details style={{ marginBottom: 16, borderTop: "1px solid rgba(245,242,235,0.12)", borderBottom: "1px solid rgba(245,242,235,0.12)", padding: "10px 0" }}>
                <summary style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, color: "rgba(245,242,235,0.6)", cursor: "pointer", listStyle: "revert" }}>SMS messaging &amp; data policy</summary>
                <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, color: "rgba(245,242,235,0.5)", lineHeight: 1.6, margin: "10px 0 0" }}>
                  SMS is currently available in the United States only. By providing your phone number, checking the SMS consent box, and clicking the sign-up button, you agree to receive periodic text messages from Fits You — operated by FIT BIELSCY Sp z o.o. — at the number you submitted. These may include automated messages sent using an automatic telephone dialing system. Message and data rates may apply. Message frequency varies, typically one message per week. Messages will consist of weekly content digests, occasional content alerts, and account notifications. Consent to receive SMS is not a condition of subscribing to Fits You or accessing any of our content. Text HELP for help. Reply STOP at any time to unsubscribe — you&apos;ll get one confirmation message and then no further texts. See our <a href="/terms" style={{ color: BRASS }}>SMS Terms</a> and <a href="/privacy" style={{ color: BRASS }}>Privacy Policy</a> for full details.
                </p>
              </details>

              {status === "error" && (
                <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 12, color: EMBER, margin: "4px 0 12px" }}>{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                style={{ width: "100%", background: BRASS, color: OBSIDIAN, border: "none", cursor: status === "submitting" ? "default" : "pointer", fontFamily: "var(--font-archivo), sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "14px", borderRadius: 4, marginTop: 6, opacity: status === "submitting" ? 0.7 : 1, transition: "background 0.15s" }}
                onMouseEnter={(e) => { if (status !== "submitting") e.currentTarget.style.background = EMBER; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = BRASS; }}
              >
                {status === "submitting" ? "Joining…" : "Join the list"}
              </button>

              <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, color: ASH, lineHeight: 1.6, margin: "16px 0 0", textAlign: "center" }}>
                By signing up you agree to our <a href="/terms" style={{ color: BRASS }}>SMS Terms</a> and <a href="/privacy" style={{ color: BRASS }}>Privacy Policy</a>. Fits You is operated by FIT BIELSCY Sp z o.o. We won&apos;t sell your data.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
