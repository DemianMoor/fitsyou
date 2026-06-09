import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase";
import { sendIntakeConfirmation, sendOperatorAlert } from "@/lib/email";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  email?: string;
  phone?: string;
  goals?: string[];
  diet?: string;
  allergies?: string;
  training_frequency?: string;
  training_type?: string;
  metrics?: Record<string, unknown>;
  consent_email?: boolean;
  consent_sms?: boolean;
  website?: string; // honeypot
};

export async function POST(request: NextRequest) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot — accept silently, write nothing.
  if (body.website) return NextResponse.json({ ok: true });

  const email = body.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }
  if (!body.consent_email) {
    return NextResponse.json(
      { error: "Please agree to be contacted by email." },
      { status: 400 },
    );
  }
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
    return NextResponse.json(
      { error: "This isn't available just yet." },
      { status: 503 },
    );
  }

  const now = new Date().toISOString();
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;

  const { error } = await supabase.from("intake").insert({
    email,
    phone: body.phone?.trim() || null,
    goals: Array.isArray(body.goals) ? body.goals.slice(0, 10) : [],
    diet: body.diet?.trim() || null,
    allergies: body.allergies?.trim() || null,
    training_frequency: body.training_frequency?.trim() || null,
    training_type: body.training_type?.trim() || null,
    metrics: body.metrics ?? {},
    consent_email: true,
    consent_sms: Boolean(body.consent_sms),
    email_consent_at: now,
    sms_consent_at: body.consent_sms ? now : null,
    ip_address: ip,
    user_agent: request.headers.get("user-agent") || null,
    source: "plan_builder",
    status: "new",
  });

  if (error) {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }

  // Transactional email (best-effort; never blocks the response).
  await Promise.allSettled([
    sendIntakeConfirmation(email),
    sendOperatorAlert("plan_builder", {
      email,
      phone: body.phone,
      goals: body.goals,
      diet: body.diet,
      training_frequency: body.training_frequency,
      training_type: body.training_type,
    }),
  ]);

  return NextResponse.json({ ok: true });
}
