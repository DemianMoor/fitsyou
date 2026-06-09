/** @type {import('next').NextConfig} */
const nextConfig = {
  // Phase 1: images are still hotlinked (Unsplash) via raw <img>.
  // unoptimized lets remote <img> render without remotePatterns config.
  // Revisit in Phase 4 when migrating to next/image + self-hosted brand imagery.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
