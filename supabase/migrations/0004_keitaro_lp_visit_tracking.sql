-- Keitaro visit tracking for /lp/[slug].
--
-- The injector already exists (app/lp/[slug]/route.ts -> injectKeitaro). It was
-- inert only because this row was missing: getLpSettings() returned "" for
-- keitaro_tracking_script, so the `if (keitaroScript)` guard skipped injection
-- and landing pages served the rewritten CTAs with no visit call. This row is
-- the whole fix; no TypeScript changes.
--
-- The stored value keeps its go.gdkn.org hosts ON PURPOSE, and is byte-identical
-- to the value GuideKin stores. TRACKING_URL in lib/tracking-rewrite.ts matches
-- go.gdkn.org literals — that is the rewriter's *input* contract, not a hardcoded
-- destination. rewriteTrackingUrls() runs last in the serve chain and resolves
-- both the host and the source tag from THIS brand's site_settings:
--
--   tracking_domain = go.fitsyou.net   tracking_source = fitsyou
--
--   R_PATH   https://go.gdkn.org/ZttBSV
--         -> https://go.fitsyou.net/ZttBSV?source=fitsyou   (1 segment -> tagged)
--   P_PATH   https://go.gdkn.org/e752675/postback
--         -> https://go.fitsyou.net/e752675/postback        (2 segments -> untagged)
--   src      https://go.gdkn.org/js/k.min.js
--         -> https://go.fitsyou.net/js/k.min.js             (3 segments -> untagged)
--
-- Pre-swapping the host here would BREAK the source tag: the regex would no
-- longer match, ?source=fitsyou would never be appended, and visits would land
-- in Keitaro untagged.
--
-- Not readable by anon — the RLS policy in 0002 allows only `features` and
-- `analytics_%`. The /lp route reads it with the service client.
insert into public.site_settings (key, value)
values (
  'keitaro_tracking_script',
  to_jsonb($ktr$<!-- Keitaro tracking script -->
<script type='application/javascript'>
if (!window.KTracking){window.KTracking={collectNonUniqueClicks: false, multiDomain: false, R_PATH: 'https://go.gdkn.org/ZttBSV', P_PATH:'https://go.gdkn.org/e752675/postback', listeners: [], reportConversion: function(){this.queued = arguments;}, getSubId: function(fn) {this.listeners.push(fn);}, ready: function(fn) {this.listeners.push(fn);} };}(function(){var a=document.createElement('script');a.type='application/javascript';a.async=true;a.src='https://go.gdkn.org/js/k.min.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(a,s)})();
</script><noscript><img height='0' width='0' alt='' src='https://go.gdkn.org/ZttBSV'/></noscript>$ktr$::text)
)
on conflict (key) do update
  set value = excluded.value,
      updated_at = now();
