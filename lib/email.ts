import "server-only";
import { Resend } from "resend";

/**
 * Transactional email for the lead-gen funnel (Resend). Lead-gen-honest:
 * confirmations set the expectation "we'll build your plan and reach out" —
 * never "order confirmed" (nothing is sold on-site). Everything degrades
 * gracefully: with no RESEND_API_KEY / EMAIL_FROM, send is skipped and the
 * lead capture still succeeds. Email failures never break the API response.
 */

const KEY = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM;        // e.g. "Fits You <hello@fitsyou.net>" (verified domain)
const NOTIFY = process.env.LEAD_NOTIFY_TO;  // operator inbox for new-lead alerts
// Replies go to the brand's real inbox — the bare address inside EMAIL_FROM
// ("hello@fitsyou.net"), so a subscriber hitting Reply reaches a human.
const REPLY_TO = FROM ? FROM.match(/<([^>]+)>/)?.[1] ?? FROM : undefined;

const resend = KEY ? new Resend(KEY) : null;
const enabled = () => Boolean(resend && FROM);

const BRASS = "#B79256", OBSIDIAN = "#101114", BONE = "#F5F2EB";
const DISCLAIMER =
  "Results vary. Individual outcomes depend on many factors. This is general information, not medical advice — consult a qualified healthcare provider before starting a nutrition, supplement, or training program. Supplement statements have not been evaluated by the FDA.";

// Email-client-safe HTML (tables + inline styles; system fonts).
function shell(bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;padding:0;background:${OBSIDIAN};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${OBSIDIAN};">
    <tr><td align="center" style="padding:40px 24px;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:480px;">
        <tr><td style="padding-bottom:8px;">
          <span style="font-family:Georgia,'Times New Roman',serif;font-size:22px;color:${BONE};letter-spacing:-0.5px;">Fits You</span>
          <span style="font-family:Arial,sans-serif;font-size:9px;font-weight:bold;letter-spacing:2px;color:${BRASS};">&nbsp;&reg;</span>
        </td></tr>
        ${bodyHtml}
        <tr><td style="padding-top:28px;margin-top:24px;border-top:1px solid rgba(183,146,86,0.25);">
          <p style="font-family:Arial,sans-serif;font-size:11px;color:rgba(245,242,235,0.40);line-height:1.6;margin:16px 0 0;">${DISCLAIMER}</p>
          <p style="font-family:Arial,sans-serif;font-size:11px;color:rgba(245,242,235,0.30);margin:12px 0 0;">Fits You · fitsyou.net</p>
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

function block(heading: string, paras: string[]): string {
  const h = `<tr><td style="padding-top:16px;"><h1 style="font-family:Georgia,serif;font-size:26px;font-weight:normal;color:${BONE};margin:0 0 16px;line-height:1.2;">${heading}</h1></td></tr>`;
  const p = paras.map((t) => `<tr><td><p style="font-family:Arial,sans-serif;font-size:15px;color:rgba(245,242,235,0.75);line-height:1.7;margin:0 0 14px;">${t}</p></td></tr>`).join("");
  return h + p;
}

async function safeSend(args: { to: string; subject: string; html: string }) {
  if (!enabled()) return;
  try {
    await resend!.emails.send({ from: FROM!, replyTo: REPLY_TO, to: args.to, subject: args.subject, html: args.html });
  } catch {
    // Never let email failure affect the lead capture.
  }
}

export async function sendSubscribeWelcome(to: string, name?: string | null) {
  await safeSend({
    to,
    subject: "You're on the list — Fits You",
    html: shell(block(`Welcome${name ? `, ${name}` : ""}.`, [
      "Thanks for joining. You'll get occasional notes on the method behind the plan — measured, made for one. No spam, no daily blasts.",
      "When you're ready, you can build your tailored plan anytime at fitsyou.net.",
    ])),
  });
}

export async function sendIntakeConfirmation(to: string) {
  await safeSend({
    to,
    subject: "We're building your plan — Fits You",
    html: shell(block("Your plan is in the works.", [
      "Thanks for completing your intake. Our team is calibrating a plan around your goals, food preferences, and training — and we'll reach out with your next steps.",
      "This isn't an order — nothing has been purchased. It's the start of a plan built to fit you.",
    ])),
  });
}

export async function sendOperatorAlert(kind: "subscriber" | "plan_builder", details: Record<string, unknown>) {
  if (!NOTIFY) return;
  const rows = Object.entries(details)
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => `<tr><td style="font-family:Arial,sans-serif;font-size:13px;color:rgba(245,242,235,0.5);padding:2px 12px 2px 0;">${k}</td><td style="font-family:Arial,sans-serif;font-size:13px;color:${BONE};padding:2px 0;">${Array.isArray(v) ? v.join(", ") : String(v)}</td></tr>`)
    .join("");
  await safeSend({
    to: NOTIFY,
    subject: `New ${kind === "plan_builder" ? "Plan Builder" : "subscriber"} lead — Fits You`,
    html: shell(block(`New ${kind === "plan_builder" ? "Plan Builder" : "subscriber"} lead`, []) +
      `<tr><td><table role="presentation" cellpadding="0" cellspacing="0">${rows}</table></td></tr>`),
  });
}
