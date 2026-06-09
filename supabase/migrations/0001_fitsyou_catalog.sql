-- ============================================================================
-- FITS YOU — brand-specific catalog + intake (Phase 3a, Path A)
-- ============================================================================
-- Applied to the FITS YOU Supabase project only. These are brand-specific
-- tables the central admin ignores (like LumZen's tarot/audiobooks) — see
-- PHASE-0-RECON.md §5. They are deliberately CANONICAL-CLEAN and B-ready:
-- generic, brand-agnostic columns following the `articles` conventions, so they
-- can be promoted to shared admin modules later with minimal change.
--
-- Single-tenant RLS: anon may SELECT only published rows. The Fits You site
-- reads its own DB; there is no brand_id filter (brands are isolated at the DB
-- level). The `intake` table is write-only (no anon read).
-- ============================================================================

-- updated_at helper -----------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── meal_kits ───────────────────────────────────────────────────────────────
create table public.meal_kits (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  tagline       text,
  description   text,
  servings      integer,
  prep_minutes  integer,
  dietary_tags  text[] not null default '{}',
  -- Product nutrition facts ONLY (e.g. {"calories":520,"protein_g":46,...}).
  -- Never framed as a personal deficit/target — see compliance note below.
  nutrition     jsonb not null default '{}',
  price_cents   integer,
  featured      boolean not null default false,
  -- B-ready base columns (mirror articles)
  status        text not null default 'draft'
                check (status in ('draft','scheduled','published','archived')),
  scheduled_for timestamptz,
  published_at  timestamptz,
  seo_title     text,
  seo_description text,
  image_url     text,
  image_alt     text,
  image_credit  text,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── supplements ───────────────────────────────────────────────────────────--
create table public.supplements (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  -- Structure/function statements ONLY. No disease (treat/cure/prevent) claims.
  benefit_statement text,
  description   text,
  ingredients   jsonb not null default '[]',
  serving_size  text,
  price_cents   integer,
  category      text,
  requires_dshea_disclaimer boolean not null default true,
  -- B-ready base columns
  status        text not null default 'draft'
                check (status in ('draft','scheduled','published','archived')),
  scheduled_for timestamptz,
  published_at  timestamptz,
  seo_title     text,
  seo_description text,
  image_url     text,
  image_alt     text,
  image_credit  text,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── training_plans ──────────────────────────────────────────────────────────
create table public.training_plans (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  focus         text check (focus in ('strength','conditioning','mobility','hybrid')),
  level         text,
  weeks         integer,
  sessions_per_week integer,
  equipment     text[] not null default '{}',
  description   text,
  -- B-ready base columns
  status        text not null default 'draft'
                check (status in ('draft','scheduled','published','archived')),
  scheduled_for timestamptz,
  published_at  timestamptz,
  seo_title     text,
  seo_description text,
  image_url     text,
  image_alt     text,
  image_credit  text,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── intake (Plan Builder leads) — WRITE-ONLY ──────────────────────────────────
-- Capability-framed quiz inputs + contact + explicit consent. No anon read.
create table public.intake (
  id                 uuid primary key default gen_random_uuid(),
  email              text not null,
  phone              text,
  -- Quiz inputs (capability-framed; collect only what's needed)
  goals              text[] not null default '{}',
  diet               text,
  allergies          text,
  training_frequency text,
  training_type      text,
  -- Optional body metrics the quiz already collects (age/weight/height/sex)
  metrics            jsonb not null default '{}',
  -- Consent (TCPA evidence)
  consent_email      boolean not null default false,
  consent_sms        boolean not null default false,
  email_consent_at   timestamptz,
  sms_consent_at     timestamptz,
  ip_address         text,
  user_agent         text,
  source             text not null default 'plan_builder',
  status             text not null default 'new'
                     check (status in ('new','contacted','converted','archived')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- Indexes for the common public read (published, ordered) -----------------------
create index meal_kits_published_idx     on public.meal_kits (status, sort_order, published_at desc);
create index supplements_published_idx   on public.supplements (status, sort_order, published_at desc);
create index training_plans_published_idx on public.training_plans (status, sort_order, published_at desc);

-- updated_at triggers ----------------------------------------------------------
create trigger meal_kits_set_updated_at      before update on public.meal_kits      for each row execute function public.set_updated_at();
create trigger supplements_set_updated_at    before update on public.supplements    for each row execute function public.set_updated_at();
create trigger training_plans_set_updated_at before update on public.training_plans for each row execute function public.set_updated_at();
create trigger intake_set_updated_at         before update on public.intake         for each row execute function public.set_updated_at();

-- ── RLS ───────────────────────────────────────────────────────────────────--
alter table public.meal_kits      enable row level security;
alter table public.supplements    enable row level security;
alter table public.training_plans enable row level security;
alter table public.intake         enable row level security;

-- Catalog: anon (and authenticated) may read ONLY published rows.
create policy "meal_kits public read published"
  on public.meal_kits for select to anon, authenticated
  using (status = 'published');

create policy "supplements public read published"
  on public.supplements for select to anon, authenticated
  using (status = 'published');

create policy "training_plans public read published"
  on public.training_plans for select to anon, authenticated
  using (status = 'published');

-- intake: NO anon/authenticated policies → all client access denied.
-- Inserts happen exclusively via the server-only service-role client
-- (app/api/intake), which bypasses RLS. The 3b /studio editor reads it
-- through an owner-gated service path, not anon.
