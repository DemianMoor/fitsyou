import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase";
import { sendSubscribeWelcome, sendOperatorAlert } from "@/lib/email";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  email?: string;
  name?: string;
  phone?: string;
  consent_email?: boolean;
  consent_sms?: boolean;
  website?: string; // honeypot — real users never fill this
};

export async function POST(request: NextRequest) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: a filled field means a bot. Accept silently, write nothing.
  if (body.website) return NextResponse.json({ ok: true });

  const email = body.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }
  // Email opt-in is required to subscribe (explicit TCPA consent).
  if (!body.consent_email) {
    return NextResponse.json(
      { error: "Email consent is required to subscribe." },
      { status: 400 },
    );
  }
  // If SMS opt-in is checked, a phone number is required.
  if (body.consent_sms && !body.phone?.trim()) {
    return NextResponse.json(
      { error: "A phone number is required for text updates." },
      { status: 400 },
    );
  }

  let supabase;
  try {
    supabase = createSupabaseServiceClient();
  } catch {
    // Pre-provisioning: env not set. Fail softly so the UI shows a friendly message.
    return NextResponse.json(
      { error: "Subscriptions are temporarily unavailable." },
      { status: 503 },
    );
  }

  const now = new Date().toISOString();
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;

  const row = {
    email,
    name: body.name?.trim() || null,
    phone: body.phone?.trim() || null,
    pillars: [] as string[],
    consent_email: true,
    consent_sms: Boolean(body.consent_sms),
    email_consent_at: now,
    sms_consent_at: body.consent_sms ? now : null,
    ip_address: ip,
    user_agent: request.headers.get("user-agent") || null,
    source: "fitsyou_popup",
    status: "active" as const,
  };

  const { error } = await supabase.from("subscribers").insert(row);

  if (error) {
    // Unique email → already subscribed. Treat as success, don't overwrite consent.
    if (error.code === "23505") return NextResponse.json({ ok: true, already: true });
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }

  // Transactional email (best-effort; never blocks the response).
  await Promise.allSettled([
    sendSubscribeWelcome(email, row.name),
    sendOperatorAlert("subscriber", { email, name: row.name, consent_sms: row.consent_sms, source: row.source }),
  ]);

  return NextResponse.json({ ok: true });
}
