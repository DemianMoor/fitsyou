# Phase 0 — Recon Findings (read-only; no writes made)

Recon was run against the admin repo (`c:\AFF\aff-admin`) and the local workspace.
**The plan's working assumption is materially wrong on the data layer.** Everything
below corrects it and feeds Phases 1–3.

---

## 0. The one correction that changes the plan

> **Plan assumed:** one Supabase backend *shared across brands*, rows discriminated by
> a `brand_id` column, isolated by RLS.
>
> **Reality:** **Plan B — central admin + per-brand SEPARATE databases** (control-plane
> pattern, `unified-admin-MASTER-SPEC.md` §2). There is **no shared content DB and no
> `brand_id` discriminator column.** Each brand has its **own Supabase project**.

What this means for Fits You:

- Fits You needs its **own new Supabase project**, with the §5 canonical migrations
  applied, registered as one row in the admin **Brands** screen (`brand_id = 'fitsyou'`).
- The cross-cutting "brand scoping is the #1 rule / a missing filter leaks another
  brand's content" concern **largely evaporates** — brands are physically isolated in
  different databases. No sibling data lives in the Fits You DB to leak.
- **Drop from the plan:** `NEXT_PUBLIC_BRAND_ID` → `getBrandId()`, the `brandScoped()`
  query wrapper, and the Phase 2 "seed sibling row, confirm no leak" test. They solve a
  multi-tenant problem this architecture doesn't have.
- **Keep, but reframe:** RLS on the Fits You DB is still required — but it's
  *single-tenant* RLS (anon reads only `status='published'` rows), not a brand filter.

---

## 1. Topology

| Piece | Location | Notes |
|---|---|---|
| Central admin (one deploy, all brands) | `c:\AFF\aff-admin\tool` | Next 16 + webpack, `proxy.ts`, three SB factories, `supabase/`. Domain `admin.guidekn.com`. |
| Public brand sites | `c:\AFF\Websites\<Brand>\<brand>_code` | FitsYou→`fy_code`, GuideKin→`gdkn_code`, LumZen→`lz_code`, VigorCals→`vc_code`, WiseShape→`ws_code`. |
| Control-plane DB ("Admin Panel") | Supabase project | Holds `sites`, `editors`, `audit_log` only. |
| Per-brand DBs | one Supabase project each | Holds `articles`, `subscribers`, `landing_pages`, `site_settings`, `picks`/`pick_products`. |

- Separate repos, not a monorepo. The admin is standalone (no co-located public site).
- **GAP:** every sibling public-site code dir (`gdkn_code`, `lz_code`, `vc_code`,
  `ws_code`) is **empty locally**. We have the admin's conventions but **not** a
  reference public site's read code (how it builds its own SB client, reads published
  content, renders the subscribe popup). We'll mirror admin conventions and design the
  public-read layer fresh, or pull a populated `gdkn_code` first.

## 2. Supabase / brand discrimination

- **Brands are discriminated by separate databases**, selected in the admin via
  `getBrandClient(brandId)` (`lib/control-plane.ts`): looks up the `sites` row,
  decrypts the AES-256-GCM service key (`lib/crypto.ts` + `BRAND_KEY_SECRET`), returns a
  brand-scoped admin client. Service keys are **never** plaintext, never sent to browser.
- Control-plane schema (`supabase/migrations/0001_control_plane.sql`, spec §3):
  `sites(brand_id PK, name, supabase_url, service_role_key ciphertext, anon_key,
  storage_bucket default 'landing-pages', brand_config jsonb, is_active)`,
  `editors(role owner|editor, brand_access jsonb null=all)`, `audit_log`.
- Registered brands today: **GuideKin + LumZen**. **No `fitsyou` row exists yet** (grep
  clean across `supabase/`).
- RLS: control-plane `editors` is deny-all (read via service role only). Per-brand
  content-table RLS is **not in the canonical contract** — declared a per-brand concern
  (contract header: "RLS policies … per-brand concerns NOT defined here"). So Fits You
  authors its own published-read RLS.

## 3. Existing content model (canonical contract — `supabase/contract/0001_canonical_contract.sql`)

Fully documented, applies to every brand DB:
- **articles** — slug, title, subtitle, excerpt, body, pillar (validated vs
  `brand_config.voice.pillars`, no CHECK), tags[], byline, author_id (loose),
  image_url/_alt/_credit, seo_*, `status in (draft|scheduled|published|archived)`,
  `scheduled_for`, `published_at`. Slug uniqueness is per-brand.
- **subscribers** — email, name, phone, pillars[], `consent_email`/`consent_sms` +
  `email_consent_at`/`sms_consent_at` (TCPA evidence kept), `ip_address`, `user_agent`,
  `source`, `status in (active|unsubscribed|bounced)`.
- **landing_pages**, **site_settings** (`value jsonb`; analytics keys
  `analytics_ga4_id`/`_gtm_id`/`_clarity_id` live here), **picks**/**pick_products**
  (the admin "Categories" module; opt-out via `brand_config.features.has_categories`).
- **Publish cron is CENTRAL**, not per-site: `tool/app/api/cron/publish-scheduled`,
  Vercel schedule **`0 * * * *` (hourly, not 6AM)**; iterates active sites, publishes
  `status='scheduled' AND scheduled_for <= now()` per brand in try/catch.

## 4. Client + auth conventions (to mirror in the public site)

- Three control-plane factories in `lib/supabase.ts`: `createSupabaseBrowserClient`,
  `createSupabaseServerClient` (dynamic `import('next/headers')`), `createSupabaseAdmin`
  (service role, server-only). Plus the 4th, `getBrandClient` (admin-only).
- `getCurrentEditor()` (`lib/auth.ts`) → `{ user, editor }`, roles `owner|editor`.
- Session refresh in `proxy.ts` (Next 16 native), matcher excludes `_next`/`api`.
- Env names (admin): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`, `BRAND_KEY_SECRET`. The **Fits You public site** uses its
  own project's `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon read),
  and a server-only service key only if it needs privileged writes (e.g. subscribe).
- Storage bucket naming: `sites.storage_bucket` default `'landing-pages'`, per brand.

## 5. Gaps for Fits You

The four Fits-You content types are **net-new** — none exist in the canonical contract
or as admin modules:
- **Meal Kits**, **Supplements**, **Training Plans** — no tables, no admin modules.
- **Plan Builder intake** (leads/intake) — no table.

Two ways to handle them (a real architecture decision — see below):

- **Path A — brand-specific tables (low blast radius).** Treat them like LumZen's
  tarot/audiobooks: Fits-You-only tables in the Fits You DB that the central admin
  **ignores**. Public site reads them directly. Zero shared-admin change, zero risk to
  siblings. Trade-off: no central admin UI — content managed via Supabase Studio or a
  small Fits-You-local editor.
- **Path B — admin-managed modules (high blast radius = the plan's Phase 3).** Add
  canonical tables + new admin modules following the Articles pattern. Every brand's
  admin inherits them. More work; touches shared admin; must verify GuideKin/LumZen
  unaffected.

## 6. Proposed brand_id + additive plan

- **brand_id: `fitsyou`**, storage bucket `fitsyou` (or default `landing-pages`).
- Additive setup (no in-place changes to siblings):
  1. Create the Fits You Supabase project; apply §5 canonical migrations.
  2. Add published-read RLS for anon (single-tenant) on `articles` (+ any public tables).
  3. Add the `fitsyou` row via the admin Brands screen (encrypted service key,
     `brand_config.voice.pillars`, `features.has_categories` as desired).
  4. Decide Path A vs B for meal-kits/supplements/training/plan-builder before Phase 3.

---

## What's confirmed in the plan (unchanged)

- Fits You public site = new standalone Next 16 app, like the siblings. ✓
- Admin is a separate codebase/deploy. ✓
- Conventions: `next dev --webpack`, `next/headers` dynamic import, `proxy.ts`,
  three+one SB factories, clear `.next` after route changes, additive migrations. ✓
- Phase 1 (framework port of the Make export) is unaffected by the correction — it's
  pure front-end and can proceed once approved.
