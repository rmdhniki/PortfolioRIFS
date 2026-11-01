import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Files upload straight from the browser to Supabase Storage, so Server
      // Actions only receive form fields + URLs. Keep well under Vercel's 4.5MB cap.
      bodySizeLimit: "1mb",
    },
  },
};

export default nextConfig;
