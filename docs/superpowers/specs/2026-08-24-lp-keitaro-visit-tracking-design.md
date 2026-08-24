# Keitaro visit tracking on /lp/[slug]

**Date:** 2026-08-24
**Status:** implemented, verified in production

## Problem

Landing pages served from `www.fitsyou.net/lp/[slug]` rewrote their CTA anchors to
`go.fitsyou.net` but never registered a visit in Keitaro. Measured live on
`/lp/wlr` before the change: 41 rewritten `go.fitsyou.net` CTAs, zero `k.min.js`,
zero visit call.

## Root cause

Not a missing feature — a missing config row.

`injectKeitaro()` already exists in `app/lp/[slug]/route.ts`, at full parity with
GuideKin's: it parks the brand's stored script in an inert `<template>`, revives
each `<script>` as a live DOM node, and queues `KTracking.update({sub_id_4: slug})`.
It is called from the serve chain and guarded by `if (keitaroScript)`.

fy's `site_settings` had `tracking_domain` and `tracking_source` but **no
`keitaro_tracking_script` row**. `getLpSettings()` therefore returned `""`, the
guard skipped injection, and the "skip cleanly when unset" behaviour the brief
asked for was already in effect — that was the bug's mechanism, not a gap.

## Design

One migration, `supabase/migrations/0004_keitaro_lp_visit_tracking.sql`, upserting
`keitaro_tracking_script` with GuideKin's Keitaro visit script **verbatim**.
No TypeScript changes.

### Why the stored value keeps `go.gdkn.org`

`TRACKING_URL` in `lib/tracking-rewrite.ts` is hardcoded to match `go.gdkn.org`
literals. That is the rewriter's *input* contract, not a hardcoded destination —
the output host and source tag are both resolved from this brand's `site_settings`
at serve time.

Pre-swapping the stored script to `go.fitsyou.net` would **break** the source tag:
the regex would stop matching and `?source=fitsyou` would never be appended,
landing visits in Keitaro untagged. Keeping the stored value byte-identical across
brands is what makes the brand-agnostic rewriter work.

Serve-time result, with `tracking_domain=go.fitsyou.net` / `tracking_source=fitsyou`:

| stored | served | why |
|---|---|---|
| `go.gdkn.org/ZttBSV` | `go.fitsyou.net/ZttBSV?source=fitsyou` | 1 segment → alias → tagged |
| `go.gdkn.org/e752675/postback` | `go.fitsyou.net/e752675/postback` | 2 segments → infrastructure → untagged |
| `go.gdkn.org/js/k.min.js` | `go.fitsyou.net/js/k.min.js` | 3 segments → infrastructure → untagged |

Keitaro aliases are tracker-wide, so `go.fitsyou.net/ZttBSV` reaches the same
campaign as `go.gdkn.org/ZttBSV`, distinguished by `source=fitsyou`.

### Parameters

- `sub_id3` — needs no code. `k.min.js` reads it off the page URL itself.
- `sub_id_4` — set to the slug by the existing `KTracking.update` call.
- `landing_url` — set by `k.min.js` to the page URL it loaded on.
- `se_referrer` / `default_keyword` — populated by `k.min.js` automatically.

### Rejected alternative

The Keitaro **offer-link** snippet (`<span id="…">` + `innerHTML = '<a href="…/llx13759?…">'`)
was considered and rejected. It renders an anchor; it never loads `k.min.js` and
never registers a visit, so it cannot satisfy the goal. It is also incompatible
with the rewriter: `TRACKING_URL` stops at the `'`, capturing `/llx13759?&se_referrer=`,
matches `ALIAS_PATH`, and appends `&source=fitsyou` mid-JS-concatenation —
corrupting both the referrer and the source value. (`llx13759` / `lld13531` are
per-LP CTA links, matching slugs `llx` / `lld` — not the visits campaign.)

## Security / RLS

`keitaro_tracking_script` is outside the anon-read allowlist in `0002_fitsyou_rls.sql`
(`features` and `analytics_%` only). The `/lp` route reads it with the service
client, so RLS is unaffected. aff-admin has no Keitaro field, so this row is the
sole source of truth.

## Verification

Offline, against the real `rewriteTrackingUrls` compiled from source:

- migration file value == GuideKin's stored value (md5 `9319cb4935e0c1ba4dbdd9ec82b6bcae`, 739 B)
- all four URLs rewrite as tabled above; zero surviving `go.gdkn.org`
- exactly 2 `source=` occurrences — no double-append
- second pass is a no-op (idempotent)
- `domain` unset → byte-identical passthrough

In production on `/lp/wlr`:

- rest of page byte-identical to the pre-change capture; the entire delta is the
  1543-byte injected block
- 404s (`/lp/bs`, `/lp/lvl`) unchanged — they return before any injector runs
- real browser visit fired:
  - `GET go.fitsyou.net/js/k.min.js` → 200
  - `GET go.fitsyou.net/ZttBSV?source=fitsyou&…&sub_id3=fyverify824&…&landing_url=www.fitsyou.net%2Flp%2Fwlr` → 200
  - `GET go.fitsyou.net/ZttBSV?source=fitsyou&_update_tokens=1&sub_id=2h0erc2.d.3ejs&sub_id_4=wlr` → 200
