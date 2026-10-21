import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceClient, getLpSettings } from "@/lib/supabase";
import {
  backstopScript,
  pickSubIds,
  resolveTrackingHost,
  rewriteTrackingUrls,
  routeScriptsThroughPassthrough,
} from "@/lib/subid-guarantee/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Proxies a landing-page bundle stored in Supabase Storage (bucket:
 * landing-pages, public). Ported from GuideKin's route — see
 * docs/superpowers/specs/2026-08-17-serve-time-tracking-rewriter-design.md in
 * the admin panel repo for the deltas.
 *
 * Limitation, same as the other brands: asset path rewriting is regex-based.
 * URLs built at runtime inside JS bundles (e.g. fetch(`/assets/${name}`)) are
 * NOT rewritten — those landing pages must use absolute paths.
 */
const STORAGE_PUBLIC_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/landing-pages`;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  if (!/^[a-z0-9][a-z0-9-]{0,80}$/.test(slug)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const supabase = createSupabaseServiceClient();
  const { data: page } = await supabase
    .from("landing_pages")
    .select("slug, entry_file, is_active, gtm_id")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!page) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const entry = page.entry_file || "index.html";
  const entryUrl = `${STORAGE_PUBLIC_BASE}/${slug}/${entry}`;

  let html: string;
  try {
    const res = await fetch(entryUrl, { cache: "no-store" });
    if (!res.ok) {
      return new NextResponse("Landing page bundle missing", { status: 502 });
    }
    html = await res.text();
  } catch {
    return new NextResponse("Failed to load landing page", { status: 502 });
  }

  // Asset rewrite first, so the partner's own `src=`/`href=` get pointed at
  // Supabase Storage before anything else touches the markup.
  //
  // No serve-time chrome swap here: site chrome ships as a derived entry file
  // written by the admin panel (basename + ".__chrome__"), which this route
  // serves as an ordinary entry_file with no special handling.
  html = rewriteAssetPaths(html, slug);

  // The visitor's sub_id* go into every tracker URL on the page (lib/subid-guarantee).
  // Safe to cache: the edge keys on the full URL, query included.
  const subIds = pickSubIds(req.nextUrl.searchParams);

  // The page's own .js files go through /lp/<slug>/~js/ so tracker URLs inside
  // them get the same rewrite.
  html = routeScriptsThroughPassthrough(html, {
    storageBase: STORAGE_PUBLIC_BASE,
    slug,
    lpPath: "/lp/",
    subIds,
  });

  const { gtmId, clarityId, keitaroScript, tracking } = await getLpSettings();

  // Per-page GTM container wins over the site-wide one.
  const gtm = page.gtm_id || gtmId;
  if (gtm) {
    html = injectGtm(html, gtm);
  }

  if (clarityId) {
    html = injectClarity(html, clarityId);
  }

  if (keitaroScript) {
    html = injectKeitaro(html, keitaroScript);
  }

  html = injectUtmForwarder(html);

  // Runs last so it covers every injected block. Points every known tracker host
  // (lib/subid-guarantee/core.ts) at this brand's tracking domain and tags
  // campaign clicks with its source and the request's sub_id*; the injected
  // visit script is host-swapped only. With tracking_domain unset this is a
  // no-op and the output is byte-identical.
  html = rewriteTrackingUrls(html, { ...tracking, subIds });

  // Runtime backstop for tracker URLs a page builds from scratch. Only when the
  // request carries sub_id*.
  const trackingHost = resolveTrackingHost(tracking.domain);
  if (subIds.length && trackingHost) {
    html = injectAfterHead(html, backstopScript(trackingHost));
  }

  // Injected last so the hints land first in <head>, ahead of the asset refs.
  html = injectResourceHints(html);

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // LP content changes rarely. 5 min fresh at the edge, then serve stale
      // instantly while revalidating in the background — keeps origin hits
      // (DB + Storage fetch) off the visitor's critical path. Edits propagate
      // within ~max-age; deactivation within max-age + one revalidation.
      "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function injectAfterHead(html: string, block: string): string {
  const headMatch = html.match(/<head[^>]*>/i);
  if (!headMatch) return html;
  const at = headMatch.index! + headMatch[0].length;
  return html.substring(0, at) + block + html.substring(at);
}

/**
 * Opens the connection to Supabase Storage (where every rewritten asset lives)
 * and warms DNS for GTM before the parser reaches those URLs in the body — so
 * the cross-origin DNS+TLS handshake overlaps with HTML parsing instead of
 * blocking the first asset fetch.
 */
function injectResourceHints(html: string): string {
  const storageOrigin = new URL(STORAGE_PUBLIC_BASE).origin;
  const tags =
    `<link rel="preconnect" href="${storageOrigin}" crossorigin>` +
    `<link rel="dns-prefetch" href="//www.googletagmanager.com">`;

  const headMatch = html.match(/<head[^>]*>/i);
  if (headMatch) {
    const at = headMatch.index! + headMatch[0].length;
    return html.substring(0, at) + tags + html.substring(at);
  }
  return html;
}

/**
 * Rewrites relative asset paths (href, src, srcset, url() in inline styles)
 * to absolute Supabase Storage URLs.
 */
function rewriteAssetPaths(html: string, slug: string): string {
  const baseUrl = `${STORAGE_PUBLIC_BASE}/${slug}/`;

  function isRelative(url: string): boolean {
    if (!url) return false;
    if (/^https?:\/\//i.test(url)) return false;
    if (url.startsWith("//")) return false;
    if (url.startsWith("#")) return false;
    if (url.startsWith("mailto:")) return false;
    if (url.startsWith("tel:")) return false;
    if (url.startsWith("data:")) return false;
    if (url.startsWith("javascript:")) return false;
    return true;
  }

  function resolveUrl(url: string): string {
    if (!isRelative(url)) return url;
    const cleaned = url.replace(/^\.\//, "").replace(/^\//, "");
    return baseUrl + cleaned;
  }

  html = html.replace(
    /\b(href|src)=(["'])([^"']+)(["'])/gi,
    (_match, attr, q1, url, q2) => {
      const abs = resolveUrl(url);
      const out =
        attr.toLowerCase() === "src" && isStorageRaster(abs)
          ? optimizeImage(abs)
          : abs;
      return `${attr}=${q1}${out}${q2}`;
    },
  );

  html = html.replace(
    /\bsrcset=(["'])([^"']+)(["'])/gi,
    (_match, q1, value, q2) => {
      const rewritten = value
        .split(",")
        .map((part: string) => {
          const trimmed = part.trim();
          const spaceIdx = trimmed.search(/\s/);
          if (spaceIdx === -1) {
            return resolveUrl(trimmed);
          }
          const url = trimmed.substring(0, spaceIdx);
          const descriptor = trimmed.substring(spaceIdx);
          return resolveUrl(url) + descriptor;
        })
        .join(", ");
      return `srcset=${q1}${rewritten}${q2}`;
    },
  );

  html = html.replace(
    /url\((["']?)([^)"']+)(["']?)\)/gi,
    (_match, q1, url, q2) => {
      const abs = resolveUrl(url);
      const out = isStorageRaster(abs) ? optimizeImage(abs) : abs;
      return `url(${q1}${out}${q2})`;
    },
  );

  return html;
}

// Raster images Vercel's optimizer can shrink (WebP/AVIF + resize). Only images
// that resolved to our Storage origin are wrapped, so next.config's
// remotePatterns covers them. gif is excluded (optimizer passes animated GIFs
// through unchanged) and svg is excluded (vector, already tiny).
function isStorageRaster(url: string): boolean {
  return (
    url.startsWith(STORAGE_PUBLIC_BASE) && /\.(png|jpe?g|webp)(\?|$)/i.test(url)
  );
}

function optimizeImage(url: string): string {
  return `/_next/image?url=${encodeURIComponent(url)}&w=2048&q=75`;
}

/**
 * Forwards the landing page's incoming query string (utm_*, sub_id*, fbclid,
 * gclid, anything else marketing puts on the ad URL) to every anchor on the
 * page. Anchor's own params win on conflict so the merchant's existing
 * tracking is preserved. Runs once on DOMContentLoaded and watches for any
 * anchors added later by a framework or analytics tag.
 */
function injectUtmForwarder(html: string): string {
  const script = `<script>(function(){try{var src=new URLSearchParams(window.location.search);if(!src.toString())return;function decorate(a){var h=a.getAttribute('href');if(!h)return;if(/^(mailto:|tel:|javascript:|data:|#)/i.test(h))return;var u;try{u=new URL(h,window.location.href);}catch(e){return;}if(u.protocol!=='http:'&&u.protocol!=='https:')return;src.forEach(function(v,k){if(!u.searchParams.has(k))u.searchParams.set(k,v);});a.setAttribute('href',u.toString());}function all(r){var n=(r||document).querySelectorAll('a[href]');for(var i=0;i<n.length;i++)decorate(n[i]);}if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){all();});}else{all();}new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var ad=ms[i].addedNodes;for(var j=0;j<ad.length;j++){var nd=ad[j];if(nd.nodeType!==1)continue;if(nd.tagName==='A')decorate(nd);else if(nd.querySelectorAll)all(nd);}}}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}})();</script>`;

  const bodyClose = html.search(/<\/body\s*>/i);
  if (bodyClose !== -1) {
    return html.substring(0, bodyClose) + script + html.substring(bodyClose);
  }
  return html + script;
}

/**
 * Loads Microsoft Clarity directly on every LP rather than relying on the
 * GTM-side Clarity tag, whose trigger is easy to misconfigure (e.g. "Some
 * Pages" with a URL filter that excludes /lp/*). The window.clarity guard makes
 * this snippet a no-op if the GTM-side tag already fired first.
 */
function injectClarity(html: string, clarityId: string): string {
  const script = `<script>(function(c,l,a,r,i,t,y){if(c[a])return;c[a]=function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");</script>`;

  const headMatch = html.match(/<head[^>]*>/i);
  if (headMatch) {
    const insertAt = headMatch.index! + headMatch[0].length;
    return html.substring(0, insertAt) + script + html.substring(insertAt);
  }
  return html;
}

/**
 * Direct-mode Keitaro capture for landing pages. Fires UNCONDITIONALLY on every
 * /lp/[slug] load — every visitor registers a visit/click in Keitaro regardless
 * of which URL or params they arrive with. The brand's stored Keitaro script is
 * parked in an inert <template> (its <script> does not execute on parse), and a
 * small script recreates each <script> as a live DOM node so it executes. This
 * handles both inline scripts and <script src> tags. Wrapped in try/catch so a
 * malformed value never breaks the page. GTM is untouched.
 *
 * It also adds the page slug to the click as sub_id_4 (a click-only reporting
 * dimension) via KTracking.update — keyed off the click token, so it never
 * touches the URL and never round-trips to the affiliate. The ready() callback is
 * queued before the async k.min.js initialises, so it fires once the token exists.
 */
function injectKeitaro(html: string, keitaroScript: string): string {
  const block =
    `<template id="keitaro-direct">${keitaroScript}</template>` +
    `<script>(function(){try{var t=document.getElementById('keitaro-direct');if(!t)return;var ss=t.content.querySelectorAll('script');for(var i=0;i<ss.length;i++){var o=ss[i],n=document.createElement('script');for(var j=0;j<o.attributes.length;j++){n.setAttribute(o.attributes[j].name,o.attributes[j].value);}if(o.src){n.src=o.src;}else{n.textContent=o.textContent;}document.head.appendChild(n);}var p=window.location.pathname,slug;if(p.indexOf('/lp/')===0){slug=p.slice(4).split('/')[0];}else{var sg=p.split('/').filter(Boolean);slug=sg[sg.length-1]||'';}if(slug&&window.KTracking&&window.KTracking.ready){window.KTracking.ready(function(){try{window.KTracking.update({sub_id_4:slug});}catch(e){}});}}catch(e){}})();</script>`;

  const headMatch = html.match(/<head[^>]*>/i);
  if (headMatch) {
    const insertAt = headMatch.index! + headMatch[0].length;
    return html.substring(0, insertAt) + block + html.substring(insertAt);
  }
  return html;
}

/**
 * Injects GTM head script after <head> and noscript iframe after <body>.
 * If either tag is missing, that injection is skipped rather than guessed.
 */
function injectGtm(html: string, gtmId: string): string {
  const headScript = `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');</script>`;

  const bodyNoscript = `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`;

  const headMatch = html.match(/<head[^>]*>/i);
  if (headMatch) {
    const insertAt = headMatch.index! + headMatch[0].length;
    html = html.substring(0, insertAt) + headScript + html.substring(insertAt);
  }

  const bodyMatch = html.match(/<body[^>]*>/i);
  if (bodyMatch) {
    const insertAt = bodyMatch.index! + bodyMatch[0].length;
    html = html.substring(0, insertAt) + bodyNoscript + html.substring(insertAt);
  }

  return html;
}
