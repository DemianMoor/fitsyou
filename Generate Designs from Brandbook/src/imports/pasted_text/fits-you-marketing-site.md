# V0 PROMPT — FITS YOU (paste this alongside the brand book)

You are designing the **public marketing + onboarding site** for **Fits You** (fitsyou.net) — personalized meal kits, supplements, and custom training delivered across the US. Build in Next.js + Tailwind. Do NOT design any admin/back-office UI — that is handled separately. Focus only on public-facing pages.

Follow the attached brand book exactly. Summary of the system below.

---

## CONCEPT (the thing that must come through)
Bespoke tailoring applied to the body. Every page should feel **measured, made-to-measure, and framed around one person** — like a master tailor's atelier crossed with a precision performance lab. Quietly luxurious, confident, never mass-market, never generic SaaS. The hero leads with **personal transformation and "the fit"** — food is the vehicle, not the headline.

## SIGNATURE DEVICE — "THE FIT MARK"
A pair of precision corner brackets (like tailor's fitting marks / camera crop marks) that **frame** content — the hero, food shots, stats, and every customer story. Render in Brass for premium moments. Use it as the recurring identity element throughout. It is the one unforgettable thing — use it with restraint, never cluttered.

## COLOR (CSS variables — use these exactly)
```
--obsidian:#101114;  /* primary dark base, hero/footer */
--bone:#F5F2EB;      /* primary light, warm paper-white */
--ember:#D9603B;     /* signature accent — CTAs/highlights ONLY, rare */
--brass:#B79256;     /* metallic — Fit Mark, hairlines, logo, never a fill */
--pine:#2F3A30;      /* secondary dark green, grounding */
--ash:#6B6A66;       /* muted/secondary text */
--bone-2:#E7E1D5;    /* subtle fills, hairlines */
```
Dominant relationship: **Obsidian + Bone.** Ember/Brass are sharp accents, never floods. **No gradients, no glassmorphism, no soft floaty shadows.** Depth = contrast + the Fit Mark, not blur.

## TYPOGRAPHY (Google Fonts)
- **Fraunces** — display headlines, story headlines, pull quotes (the luxury/human voice). High-contrast, optical, tight tracking on large sizes.
- **Archivo** + **Archivo Expanded** — all UI, body, labels, buttons, stats, nav (the precision/performance voice). Use Archivo Expanded UPPERCASE with wide tracking for short impact labels (MEASURED, MADE FOR ONE).
- Do NOT use Inter, Roboto, Arial, or system fonts.

## UI TOKENS
- Radii tight: 2px / 4px default / 8px only for big media. **No pill bubbles.**
- Spacing scale: 4/8/12/16/24/32/48/64/96/128.
- Hairline borders (1px). Brass hairlines for premium dividers.
- Buttons: Primary = Obsidian fill / Bone text / 4px radius / hover → Ember fill. Secondary = hairline border, fills on hover. No gradient buttons.
- Generous negative space. Asymmetry and grid-breaking welcome where it adds precision, not chaos.

## PAGES TO BUILD (public only)
1. **Home** — Obsidian hero, Fit Mark framing a confident headline ("Built to fit you"), the personalization/transformation promise up top, ONE stunning meal-kit shot, the "measured → made for you" idea, a real-stories slot, quiet credibility band. Staggered load-in animation on the hero.
2. **How it fits** — visualize the engine: intake → calibrated plan → kit + stack + training delivered. Precise, diagrammatic, premium.
3. **The Plan Builder** — the centerpiece interactive: a multi-step intake (body, goals, preferences, training) that feels satisfying and exact, ending in a sample tailored plan. This is where the bespoke feeling lives — make it the best-crafted thing on the site.
4. **Meal Kits** — the appetite page. Large, gorgeous dark food photography (see image direction). Fit Mark framing.
5. **Supplements** — the personalized stack; clinical-calm, claims-safe (no disease/cure language).
6. **Training** — custom plans tied to the kits.
7. **Stories** — story cards framed by the Fit Mark, Fraunces pull-quotes. Use clearly-labeled `SAMPLE — replace with real customer` placeholders; never present generated people as real customers or real results.
8. **Pricing** — clear, confident, no dark patterns.
9. **Trust/FAQ** — plain, compliance-friendly answers; include a "results vary" line wherever a transformation appears.

## IMAGE GENERATION (food placeholders — make them aesthetically perfect)
Generate food imagery as PLACEHOLDER until real photos exist. Match this style for every food image:
> Premium meal-kit still life on a deep near-black (#101114) or dark green background, dramatic single-source side lighting with soft falloff and real shadows, fresh raw ingredients arranged beside the prepared dish to signal a kit, warm appetizing tones, subtle steam and gloss, generous negative space, editorial fine-dining photography, shot on a 50mm at f2.8, no text, no white background, no bright fast-casual look.
People imagery: strong, capable, confident, premium athletic wear, natural light, diverse, mature in feel — not grinning stock models. Label any stand-in for a real customer as `SAMPLE`.

## COPY GUARDRAILS (write all copy this way)
- Frame around **capability and fit**, not thinness/shrinking/weight loss. No "drop pounds," "burn fat fast," "shrink."
- No guaranteed or implausible results, no "without effort," no time-bound weight promises.
- No medical/disease claims on supplements.
- No shame, fear, or body-negative language.
- Second person, short declarative lines, confident and precise.
- Never state or imply a target age anywhere.

## ANTI-GENERIC GUARDRAILS
No purple/blue gradients on white. No glassmorphism. No pill-shaped everything. No Inter/Space Grotesk. No three-column feature-card SaaS template. No floaty drop shadows. Commit fully to the tailored-precision aesthetic — restraint executed with exactness, not decoration for its own sake.