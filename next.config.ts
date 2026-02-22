import type { NextConfig } from "next";

const supabaseHost =
  process.env.NEXT_PUBLIC_SUPABASE_URL != null
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
    : "";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      ...(supabaseHost
        ? [
            {
              protocol: "https",
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
