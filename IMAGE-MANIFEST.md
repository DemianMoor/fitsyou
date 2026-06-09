# Fits You — Image Slot Manifest (Phase 4)

Every image slot the site references. Produce assets per the recipes below and drop
them at the exact paths. Until a file exists, `BrandImage` shows a tasteful obsidian +
Fit Mark placeholder (the page never breaks). `next/image` optimizes everything.

**Food recipe (all food shots):** Premium meal-kit still life on a deep near-black
(#101114) or dark Pine (#2F3A30) background; dramatic single-source side light with soft
falloff and real shadows; fresh raw ingredients beside the prepared dish to signal a kit;
warm appetizing tones; subtle steam/gloss; generous negative space; editorial fine-dining
feel; ~50mm f2.8. No text, no white background, no bright fast-casual look.

**People recipe (Stories / Training / About):** strong, capable, confident; premium
athletic wear; natural light; diverse; mature in feel — never grinning stock. People who
stand in for real customers/clients MUST stay labeled `SAMPLE` until a real, consented
(Stories) or licensed person is used. Generated/stock people are never captioned as real.

---

## A. Static assets → `public/...` (versioned with code)

| Path | Source dims (≈2×) | Where | Subject | Notes |
|---|---|---|---|---|
| `public/images/home/hero-portrait.jpg` | 1200 × 1500 (4:5) | Home hero | Food still life | **LCP — `priority`.** The first impression. |
| `public/images/home/editorial-band.jpg` | 2000 × 760 (~21:8) | Home full-bleed quote band | Plated dish | Dark left side (text overlays at left). |
| `public/images/home/meal-kits.jpg` | 900 × 1200 (3:4) | Home "Three parts" card | Food | Renders at 0.55 opacity over obsidian. |
| `public/images/home/supplements.jpg` | 900 × 1200 (3:4) | Home card | Supplement still life | " |
| `public/images/home/training.jpg` | 900 × 1200 (3:4) | Home card | Person training | People recipe. |
| `public/images/supplements/hero.jpg` | 1000 × 1000 (1:1) | Supplements page hero | Supplement still life | Clinical-calm, dark. |
| `public/images/training/hero.jpg` | 1000 × 1250 (4:5) | Training page hero | Person training | **Labeled `SAMPLE — not a real client`** until licensed. |
| `public/images/about/team.jpg` | 1400 × 1200 (7:6) | About header | People | Natural light, working together. |
| `public/images/og-default.jpg` | 1200 × 630 | OG / social share | Brand | Default Open Graph card. |
| `app/icon.svg` | 32 × 32 | Favicon | Fit Mark | **Done** — authored in brand (brass on obsidian). |

## B. Managed catalog images → Fits You `catalog` storage bucket

Uploaded via the 3b editor (or now via Supabase Studio); the seed script sets the row's
`image_url` to these public paths. `remotePatterns` already allows `*.supabase.co/storage`.

| Bucket path | Source dims (≈) | Where | Subject |
|---|---|---|---|
| `catalog/meal-kits/<slug>.jpg` | 900 × 1200 (3:4) | Meal Kits grid cards | Food recipe |
| `catalog/supplements/<slug>.jpg` | 800 × 800 (1:1) | Supplements catalog thumbs | Product on dark |
| `catalog/training/<slug>.jpg` | 1000 × 1250 | (seeded; not rendered on the Training page yet — protocol cards are text) | Person training |

## C. Admin-managed editorial images → bucket via `articles.image_url`

Produced/managed in the admin (already in the bucket); no static slot.

| Used by | Aspect | Subject |
|---|---|---|
| Blog featured + cards (`/blog`) | 16:9 | Editorial / food / training |
| Blog article hero (`/blog/[slug]`) | 16:9 (priority) | Article hero |
| Stories cards (`/stories`, real `pillar='stories'`) | 4:3 | Real consented customer (people recipe) |

---

## Coverage check
- All former Unsplash hotlinks are removed; every `<img>` is now `BrandImage`/`next/image`.
- Static marketing slots: **9 files + 1 icon (done)**.
- Catalog/editorial images flow from the bucket (no static files needed).
- Missing assets degrade to the brand placeholder — ship-safe before production photography.
