import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fitsyou.net";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /studio (3b owner editor) and API routes are not for indexing.
        disallow: ["/studio", "/api/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
