# Fits You — Phase 5: Compliance Audit + Launch Readiness

Two tracks. **Claude Code wired the technical surfaces and audited the code; it does NOT
self-certify legal language.** Items marked 🔴 are hard gates owned by operator/counsel.

---

## TRACK A — COMPLIANCE AUDIT (code surfaces)

| # | Area | Status | Evidence / gap |
|---|---|---|---|
| A1 | Testimonials / Stories | ✅ code-correct | `StoriesView` renders real cards only when published `pillar='stories'` rows exist; otherwise labeled `SAMPLE`. No stock people on testimonial cards (Phase 4 replaced them with the brand placeholder). `results vary` on every card + header + footer. |
| A2 | Supplements (FDA/FTC) | ✅ code-correct / 🔴 substantiation | All seed `benefit_statement`s are structure/function ("Supports…"); zero disease verbs. DSHEA disclaimer renders **always** (page band) **and per-product** when `requires_dshea_disclaimer` (confirmed it drives rendering in `SupplementsView`). 🔴 Ingredient/benefit **substantiation files** are operator/counsel. |
| A3 | Results / weight claims | ✅ code-correct (pending copy review) | Grep across pages/components: every "guaranteed/cure/treat/prevent" hit is inside a **disclaimer** (negating context). No loss-rate, "without effort", or time-bound weight promises. Plan Builder output is non-promissory ("Sample targets… finalized by our dietitian team. Results vary…"). 🟡 Awaiting your Plan Builder copy review (screenshots attached). |
| A4 | TCPA (subscribe + intake) | ✅ code-correct / 🔴 live write | Both paths: separate email/SMS opt-in, explicit unchecked boxes, privacy link, honeypot; server stores `consent_*` booleans + `*_consent_at` timestamps + ip/user-agent. 🔴 Verify one real write per path **post-provision**. |
| A5 | Privacy + cookies | 🔴 counsel | `/trust` is a FAQ (carries a results disclaimer), **not** the privacy policy/terms. Needs a real Privacy Policy adapted from GuideKin + counsel that **discloses the intake `metrics` as sensitive personal information (CPRA + peer states)** — collection, purpose, consent basis, retention, opt-out/limit. Plus analytics (GA4/GTM/Clarity) + cookie disclosure and a retention policy for `subscribers`/`intake`. Footer "Privacy Policy / Terms / Results Disclaimer" links currently all point at `/trust` — wire to real docs once written. |
| A6 | Commerce terms | 🔴 counsel | New surface vs GuideKin: ToS, shipping, returns/refunds, billing — **US auto-renewal disclosure rules** if subscriptions auto-renew. None exist yet. |

**Net:** the app *enforces* the compliance posture in code (labeling, disclaimers, consent capture,
results-vary). The remaining A5/A6 items are **legal documents** — flagged, not self-certified.

---

## TRACK B — TECHNICAL LAUNCH

### B1. SEO / metadata — ✅ done
- Per-page metadata: server pages (`blog`, `meal-kits`, `supplements`, `training`, `stories`) +
  new metadata `layout.tsx` for client pages (`how`, `about`, `pricing`, `trust`, `plan`); home via
  root. `blog/[slug]` has `generateMetadata` from `seo_*`.
- `app/sitemap.ts` — static routes + published articles (catalog has no detail routes, so not listed).
- `app/robots.ts` — allow `/`, disallow `/studio` + `/api/`, sitemap reference.
- OG: root default (`og-default.jpg`) + per-article images; `metadataBase` set.
- Structured data: Organization + WebSite (root), Article (blog detail).
  🟡 **Product schema deferred** — meals/supplements have no detail routes or reliable price yet;
  add once catalog has prices + detail pages.
- 404: on-brand `app/not-found.tsx`. Favicon: `app/icon.svg` (brand Fit Mark).

### B2. Performance
- Hero (`home`) and article hero use `priority` (LCP). Card grids use fixed aspect-ratio
  containers → no layout shift. 🔴 Confirm **zero `/_next/image` 400s** once the 9 static assets
  (see IMAGE-MANIFEST.md) are dropped; run Lighthouse/CWV on the staged URL.

### B3. Deploy — 🔴 operator
- Vercel project for `fy_code`. Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY` (server-only), `NEXT_PUBLIC_SITE_URL=https://fitsyou.net`, Resend key.
  **Never** set `BRAND_KEY_SECRET` here (control-plane only).
- `next build` (webpack) — typecheck currently clean.
- Bind **fitsyou.net**; Cloudflare DNS + SSL + the GuideKin WAF/bot posture.
- Register the `fitsyou` brand row in the admin so the **central hourly publish cron** publishes
  scheduled Fits You articles (no per-site cron).

### B4. Production smoke test — 🔴 post-deploy
- All routes 200; published shows, draft/scheduled hidden (RLS on live DB).
- Subscribe + intake each write one consented row.
- Analytics fire only when IDs present (verified absent→clean locally).
- No service key in client bundle (verified locally: service client imported only by API routes).

---

## PRE-LAUNCH GATE (do not launch until all true)
1. 🔴 Operator: provision Fits You Supabase project, apply `0001_fitsyou_catalog.sql` + RLS,
   set `.env.local`, run `node --env-file=.env.local scripts/seed-catalog.mjs`, register the
   `fitsyou` brand row.
2. 🔴 Produce + drop the 9 static images (IMAGE-MANIFEST.md) → confirm zero `/_next/image` 400s.
3. 🟡 Plan Builder + sample-plan copy review closed (screenshots provided).
4. 🔴 DSHEA disclaimer renders against real supplement rows (verify post-seed).
5. 🔴 Counsel clears Privacy Policy (incl. sensitive `metrics` disclosure) + Commerce terms.
6. 🔴 Run the 3a DB gates (publish→shows / draft→hidden) + one real write on subscribe & intake.
