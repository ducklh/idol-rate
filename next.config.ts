import type { NextConfig } from "next";

function getSupabaseHost(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || typeof url !== "string") return "";
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      ...(getSupabaseHost()
        ? [
            {
              protocol: "https" as const,
              hostname: getSupabaseHost(),
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
