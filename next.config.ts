import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "40mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tlvauvrzigfxywnnfkfo.supabase.co",
      },
    ],
  },
};

export default nextConfig;
