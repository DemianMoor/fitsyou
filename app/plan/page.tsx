"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FitMark } from "@/components/FitMark";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

const BRASS = "#B79256", OBSIDIAN = "#101114", BONE = "#F5F2EB", EMBER = "#D9603B";


const STEPS = [
  { id: "body", label: "Body", sub: "Your metrics" },
  { id: "goals", label: "Goals", sub: "What you're after" },
  { id: "food", label: "Food", sub: "Preferences" },
  { id: "training", label: "Training", sub: "Your movement" },
  { id: "result", label: "Your Plan", sub: "Calibrated" },
];

const GOALS = ["Build functional strength","Improve endurance","Optimize body composition","Increase daily energy","Improve recovery","Support long-term health"];
const FOOD_PREFS = ["No restrictions","Pescatarian","Vegetarian","Vegan","Gluten-free","Dairy-free","Low FODMAP","Nut-free"];
const FREQS = [{ l: "1–2×", s: "Light" }, { l: "3–4×", s: "Active" }, { l: "5–6×", s: "Committed" }, { l: "Daily+", s: "Athlete" }];

type Form = {
  age: string; weight: string; heightFt: string; heightIn: string; sex: string;
  goals: string[]; diet: string; allergies: string; freq: string; type: string;
};

const initForm: Form = { age:"", weight:"", heightFt:"", heightIn:"", sex:"", goals:[], diet:"", allergies:"", freq:"", type:"" };

const inputSt: React.CSSProperties = {
  fontFamily: "var(--font-archivo), sans-serif", fontSize: 15,
  color: BONE, background: "rgba(245,242,235,0.06)",
  border: "1px solid rgba(245,242,235,0.14)", borderRadius: 4,
  padding: "14px 16px", width: "100%", outline: "none", boxSizing: "border-box",
};

// Option popup renders on the OS-native (white) background in some browsers, so
// the inherited near-white text would be invisible — force dark-theme colors.
const optionSt: React.CSSProperties = { background: OBSIDIAN, color: BONE };

export default function PlanBuilderPage() {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const go = (path: string) => { navigate(path); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(initForm);

  // Plan Builder intake capture (Phase 3a). Non-promissory: we capture the lead
  // and show an illustrative plan shape — no guaranteed results, no loss rates.
  const [contact, setContact] = useState({ email: "", phone: "", consentEmail: false, consentSms: false, website: "" });
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [submitErr, setSubmitErr] = useState("");

  async function submitIntake() {
    if (!contact.consentEmail) { setSubmitState("error"); setSubmitErr("Please agree to be contacted by email."); return; }
    setSubmitState("submitting"); setSubmitErr("");
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: contact.email,
          phone: contact.phone,
          goals: form.goals,
          diet: form.diet,
          allergies: form.allergies,
          training_frequency: form.freq,
          training_type: form.type,
          metrics: { age: form.age, weight_lbs: form.weight, height_ft: form.heightFt, height_in: form.heightIn, sex: form.sex },
          consent_email: contact.consentEmail,
          consent_sms: contact.consentSms,
          website: contact.website, // honeypot
        }),
      });
      const json = await res.json();
      if (!res.ok) { setSubmitState("error"); setSubmitErr(json.error ?? "Something went wrong."); return; }
      setSubmitState("done");
    } catch {
      setSubmitState("error"); setSubmitErr("Network error. Please try again.");
    }
  }

  const canContinue = () => {
    if (step === 0) return form.age && form.weight && form.sex;
    if (step === 1) return form.goals.length > 0;
    if (step === 2) return form.diet;
    if (step === 3) return form.freq;
    return true;
  };

  const toggleGoal = (g: string) => setForm(f => ({
    ...f,
    goals: f.goals.includes(g) ? f.goals.filter(x => x !== g) : f.goals.length < 3 ? [...f.goals, g] : f.goals,
  }));

  const labelSt: React.CSSProperties = {
    fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700,
    letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(245,242,235,0.45)",
    display: "block", marginBottom: 8,
  };

  const stepHead = (n: string, title: React.ReactNode, sub: string) => (
    <div style={{ marginBottom: 40 }}>
      <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: BRASS }}>Step {n}</span>
      <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 44, fontWeight: 400, color: BONE, margin: "12px 0 8px", letterSpacing: "-0.025em", lineHeight: 1.0 }}>{title}</h2>
      <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 14, color: "rgba(245,242,235,0.45)", margin: 0, lineHeight: 1.6 }}>{sub}</p>
    </div>
  );

  const optBtn = (label: string, selected: boolean, onClick: () => void, extraStyle: React.CSSProperties = {}) => (
    <button key={label} onClick={onClick} style={{ background: selected ? "rgba(183,146,86,0.12)" : "rgba(245,242,235,0.04)", border: `1px solid ${selected ? BRASS : "rgba(245,242,235,0.12)"}`, borderRadius: 4, cursor: "pointer", fontFamily: "var(--font-archivo), sans-serif", fontSize: 14, color: selected ? BONE : "rgba(245,242,235,0.6)", fontWeight: selected ? 500 : 400, transition: "all 0.15s", ...extraStyle }}>
      {label}
    </button>
  );

  return (
    <div style={{ background: OBSIDIAN, minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ maxWidth: 740, margin: "0 auto", padding: "64px 32px 96px" }}>

        {/* Progress */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            {STEPS.map((s, i) => (
              <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", border: `1px solid ${i <= step ? BRASS : "rgba(183,146,86,0.2)"}`, background: i < step ? BRASS : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}>
                  {i < step
                    ? <Check size={12} color={OBSIDIAN} />
                    : <span style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 12, color: i <= step ? BRASS : "rgba(183,146,86,0.3)" }}>{i + 1}</span>
                  }
                </div>
                <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: i <= step ? BRASS : "rgba(183,146,86,0.3)", textAlign: "center" }}>{s.label}</span>
              </div>
            ))}
          </div>
          <div style={{ height: 1, background: "rgba(183,146,86,0.12)", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(step / (STEPS.length - 1)) * 100}%`, background: BRASS, transition: "width 0.4s ease" }} />
          </div>
        </div>

        {/* Step 0 — Body */}
        {step === 0 && (
          <div>
            {stepHead("01", <>Tell us about<br /><em style={{ fontStyle: "italic", color: BRASS }}>your body.</em></>, "These measurements shape everything that follows.")}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="fy-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div><label style={labelSt}>Age</label><input type="number" placeholder="35" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} style={inputSt} /></div>
                <div><label style={labelSt}>Weight (lbs)</label><input type="number" placeholder="175" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} style={inputSt} /></div>
              </div>
              <div className="fy-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <div style={{ gridColumn: "1/3" }}>
                  <label style={labelSt}>Height</label>
                  <div className="fy-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <input type="number" placeholder="5 ft" value={form.heightFt} onChange={e => setForm(f => ({ ...f, heightFt: e.target.value }))} style={inputSt} />
                    <input type="number" placeholder="10 in" value={form.heightIn} onChange={e => setForm(f => ({ ...f, heightIn: e.target.value }))} style={inputSt} />
                  </div>
                </div>
                <div>
                  <label style={labelSt}>Biological sex</label>
                  <select value={form.sex} onChange={e => setForm(f => ({ ...f, sex: e.target.value }))} style={{ ...inputSt, cursor: "pointer" }}>
                    <option value="" style={optionSt}>Select</option>
                    <option style={optionSt}>Male</option>
                    <option style={optionSt}>Female</option>
                    <option style={optionSt}>Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1 — Goals */}
        {step === 1 && (
          <div>
            {stepHead("02", <>What are you<br /><em style={{ fontStyle: "italic", color: BRASS }}>working toward?</em></>, "Choose up to three. Honest answers produce the best plan.")}
            <div className="fy-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {GOALS.map(g => {
                const sel = form.goals.includes(g);
                return (
                  <button key={g} onClick={() => toggleGoal(g)} style={{ background: sel ? "rgba(183,146,86,0.1)" : "rgba(245,242,235,0.04)", border: `1px solid ${sel ? BRASS : "rgba(245,242,235,0.12)"}`, borderRadius: 4, padding: "20px 22px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 12, transition: "all 0.15s" }}>
                    <div style={{ width: 18, height: 18, border: `1px solid ${sel ? BRASS : "rgba(183,146,86,0.3)"}`, borderRadius: 2, background: sel ? BRASS : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                      {sel && <Check size={10} color={OBSIDIAN} />}
                    </div>
                    <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 14, color: sel ? BONE : "rgba(245,242,235,0.6)", fontWeight: sel ? 500 : 400 }}>{g}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2 — Food */}
        {step === 2 && (
          <div>
            {stepHead("03", <>How do you<br /><em style={{ fontStyle: "italic", color: BRASS }}>eat?</em></>, "Your dietary framework shapes every recipe.")}
            <div className="fy-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
              {FOOD_PREFS.map(p => optBtn(p, form.diet === p, () => setForm(f => ({ ...f, diet: p })), { padding: "18px 22px", textAlign: "left" as const }))}
            </div>
            <div>
              <label style={labelSt}>Allergies or ingredients to avoid (optional)</label>
              <input type="text" placeholder="e.g. shellfish, sesame" value={form.allergies} onChange={e => setForm(f => ({ ...f, allergies: e.target.value }))} style={inputSt} />
            </div>
          </div>
        )}

        {/* Step 3 — Training */}
        {step === 3 && (
          <div>
            {stepHead("04", <>How do you<br /><em style={{ fontStyle: "italic", color: BRASS }}>move?</em></>, "Training frequency directly affects your caloric and macro targets.")}
            <div style={{ marginBottom: 28 }}>
              <label style={labelSt}>Sessions per week</label>
              <div className="fy-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                {FREQS.map(tf => {
                  const sel = form.freq === tf.l;
                  return (
                    <button key={tf.l} onClick={() => setForm(f => ({ ...f, freq: tf.l }))} style={{ background: sel ? "rgba(183,146,86,0.1)" : "rgba(245,242,235,0.04)", border: `1px solid ${sel ? BRASS : "rgba(245,242,235,0.12)"}`, borderRadius: 4, padding: "20px 10px", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
                      <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 28, fontWeight: 300, color: sel ? BRASS : "rgba(245,242,235,0.45)", lineHeight: 1, marginBottom: 6 }}>{tf.l}</div>
                      <div style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: sel ? "rgba(245,242,235,0.8)" : "rgba(245,242,235,0.3)" }}>{tf.s}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label style={labelSt}>Primary training type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ ...inputSt, cursor: "pointer" }}>
                <option value="" style={optionSt}>Select your focus</option>
                <option style={optionSt}>Strength / Powerlifting</option>
                <option style={optionSt}>Running / Endurance</option>
                <option style={optionSt}>CrossFit / HIIT</option>
                <option style={optionSt}>Yoga / Mobility</option>
                <option style={optionSt}>Cycling</option>
                <option style={optionSt}>Mixed / General fitness</option>
                <option style={optionSt}>Just starting out</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 4 — Result */}
        {step === 4 && (
          <div>
            <FitMark size={24} padded={false}>
              <div style={{ padding: "52px", background: "rgba(183,146,86,0.06)", border: "1px solid rgba(183,146,86,0.2)", borderRadius: 8 }}>
                <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: BRASS, display: "block", marginBottom: 20 }}>Your calibrated plan</span>
                <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 44, fontWeight: 400, color: BONE, margin: "0 0 36px", letterSpacing: "-0.025em", lineHeight: 1.0 }}>
                  Measured.<br /><em style={{ fontStyle: "italic", color: BRASS }}>Made for you.</em>
                </h2>
                {/* Input-reflective plan shape — NO calorie/macro/weight targets (those
                    are set by the dietitian team post-join). Personalized from real answers. */}
                <div className="fy-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 28 }}>
                  {[
                    { v: form.goals[0] ?? "Balanced approach", k: "Primary focus" },
                    { v: form.diet || "No restrictions", k: "Food framework" },
                    { v: form.freq ? `${form.freq} / week${form.type ? ` · ${form.type}` : ""}` : (form.type || "Flexible cadence"), k: "Training" },
                  ].map(({ v, k }) => (
                    <div key={k} style={{ background: "rgba(245,242,235,0.04)", border: "1px solid rgba(183,146,86,0.14)", borderRadius: 4, padding: "18px" }}>
                      <div style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 15, fontWeight: 500, color: BONE, lineHeight: 1.3, marginBottom: 8 }}>{v}</div>
                      <div style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(245,242,235,0.38)" }}>{k}</div>
                    </div>
                  ))}
                </div>
                {(form.goals.length > 1 || form.allergies) && (
                  <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 12, color: "rgba(245,242,235,0.5)", lineHeight: 1.6, margin: "0 0 20px" }}>
                    {form.goals.length > 1 && <>Also working toward: {form.goals.slice(1).join(", ")}. </>}
                    {form.allergies && <>Avoiding: {form.allergies}.</>}
                  </p>
                )}
                <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, color: "rgba(245,242,235,0.3)", lineHeight: 1.7, margin: "0 0 32px" }}>
                  This is the shape of your plan. Your exact recipes, supplement stack, and training are calibrated by our registered dietitian team after you join. Results vary — individual outcomes depend on many factors including adherence, health history, and lifestyle.
                </p>
                {submitState === "done" ? (
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 22, fontStyle: "italic", color: BONE, margin: "0 0 8px" }}>Your plan is saved.</p>
                    <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 13, color: "rgba(245,242,235,0.55)", margin: "0 0 24px", lineHeight: 1.7 }}>
                      A registered dietitian finalizes your targets. Check your email for next steps.
                    </p>
                    <button onClick={() => navigate("/pricing")} style={{ background: EMBER, color: BONE, border: "none", cursor: "pointer", fontFamily: "var(--font-archivo), sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "18px 32px", borderRadius: 4, display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center", transition: "background 0.15s" }} onMouseEnter={e => { e.currentTarget.style.background = "#C04F2A"; }} onMouseLeave={e => { e.currentTarget.style.background = EMBER; }}>
                      See plans &amp; pricing <ArrowRight size={13} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={e => { e.preventDefault(); submitIntake(); }}>
                    {/* Honeypot */}
                    <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={contact.website} onChange={e => setContact(c => ({ ...c, website: e.target.value }))} style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
                    <label style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,242,235,0.5)", display: "block", marginBottom: 10 }}>
                      Save your plan — we&apos;ll send the next steps
                    </label>
                    <input type="email" required placeholder="your@email.com" value={contact.email} onChange={e => setContact(c => ({ ...c, email: e.target.value }))} style={{ ...inputSt, marginBottom: 12 }} />
                    {contact.consentSms && (
                      <input type="tel" placeholder="Mobile number" value={contact.phone} onChange={e => setContact(c => ({ ...c, phone: e.target.value }))} style={{ ...inputSt, marginBottom: 12 }} />
                    )}
                    <label style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, color: "rgba(245,242,235,0.6)", lineHeight: 1.55, display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 10, cursor: "pointer" }}>
                      <input type="checkbox" required checked={contact.consentEmail} onChange={e => setContact(c => ({ ...c, consentEmail: e.target.checked }))} style={{ marginTop: 2, accentColor: BRASS }} />
                      <span>I agree to be contacted by email about my plan. I can unsubscribe anytime. See our <a href="/privacy" style={{ color: BRASS }}>Privacy Policy</a>.</span>
                    </label>
                    <label style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, color: "rgba(245,242,235,0.6)", lineHeight: 1.55, display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 14, cursor: "pointer" }}>
                      <input type="checkbox" checked={contact.consentSms} onChange={e => setContact(c => ({ ...c, consentSms: e.target.checked }))} style={{ marginTop: 2, accentColor: BRASS }} />
                      <span>(Optional) Text me updates. By checking this box I consent to receive recurring automated marketing texts from Fits You at the number provided. Consent is not a condition of purchase. Msg &amp; data rates may apply. Reply STOP to opt out.</span>
                    </label>
                    {submitState === "error" && (
                      <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 12, color: EMBER, margin: "0 0 12px" }}>{submitErr}</p>
                    )}
                    <button type="submit" disabled={submitState === "submitting"} style={{ background: EMBER, color: BONE, border: "none", cursor: submitState === "submitting" ? "default" : "pointer", fontFamily: "var(--font-archivo), sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "18px 32px", borderRadius: 4, display: "flex", alignItems: "center", gap: 8, width: "100%", justifyContent: "center", opacity: submitState === "submitting" ? 0.7 : 1, transition: "background 0.15s" }} onMouseEnter={e => { if (submitState !== "submitting") e.currentTarget.style.background = "#C04F2A"; }} onMouseLeave={e => { e.currentTarget.style.background = EMBER; }}>
                      {submitState === "submitting" ? "Saving…" : "Get my tailored plan"} <ArrowRight size={13} />
                    </button>
                  </form>
                )}
              </div>
            </FitMark>
          </div>
        )}

        {/* Nav buttons */}
        {step < 4 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48 }}>
            {step > 0 ? (
              <button onClick={() => setStep(s => s - 1)} style={{ background: "none", border: "1px solid rgba(245,242,235,0.14)", color: "rgba(245,242,235,0.45)", cursor: "pointer", fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "14px 22px", borderRadius: 4, display: "flex", alignItems: "center", gap: 8 }}>
                <ArrowLeft size={12} /> Back
              </button>
            ) : <div />}
            <button
              onClick={() => { if (canContinue()) setStep(s => s + 1); }}
              disabled={!canContinue()}
              style={{ background: canContinue() ? BRASS : "rgba(183,146,86,0.18)", color: canContinue() ? OBSIDIAN : "rgba(183,146,86,0.38)", border: "none", cursor: canContinue() ? "pointer" : "not-allowed", fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "16px 32px", borderRadius: 4, display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s" }}
            >
              {step === 3 ? "See my plan" : "Continue"} <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
