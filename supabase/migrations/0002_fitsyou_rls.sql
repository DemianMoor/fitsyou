-- ============================================================================
-- FITS YOU — single-tenant RLS for the canonical contract tables
-- ============================================================================
-- PREREQUISITE: apply the admin's canonical contract FIRST (creates articles,
-- subscribers, site_settings, landing_pages, picks) — file:
--   aff-admin/tool/supabase/contract/0001_canonical_contract.sql
-- Then apply this, then 0001_fitsyou_catalog.sql (catalog + intake, has its own
-- RLS), then seed. The contract intentionally leaves RLS as a per-brand concern;
-- this is Fits You's published-read posture (mirrors 0001_fitsyou_catalog.sql).
--
-- Public site reads with the ANON key (published only). Writes (subscribers,
-- intake) go through the server-only SERVICE-ROLE client, which bypasses RLS.
-- ============================================================================

-- articles: anon may read ONLY published rows (blog + pillar='stories').
alter table public.articles enable row level security;
drop policy if exists "articles public read published" on public.articles;
create policy "articles public read published"
  on public.articles for select to anon, authenticated
  using (status = 'published');

-- subscribers: NO anon access (contains PII + consent records). Inserts happen
-- via the service-role client only (app/api/subscribe), which bypasses RLS.
alter table public.subscribers enable row level security;

-- site_settings: anon may read ONLY public-safe keys — analytics IDs and the
-- feature flags the public site renders. Everything else stays admin-only.
alter table public.site_settings enable row level security;
drop policy if exists "site_settings public read safe keys" on public.site_settings;
create policy "site_settings public read safe keys"
  on public.site_settings for select to anon, authenticated
  using (key = 'features' or key like 'analytics_%');
