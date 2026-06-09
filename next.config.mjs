/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Self-hosted brand imagery: static assets in /public and catalog images in
    // the Fits You Supabase storage bucket. (Unsplash hotlinks removed in Phase 4.)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
