import type { NextConfig } from "next";
import "./lib/env";

const nextConfig: NextConfig = {
  cacheComponents: true,
  typedRoutes: true,
  experimental: {
    typedEnv: true,
  },
  images: {
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "cdn.sanity.io",
    //     pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/**`,
    //   },
    // ],
    formats: ["image/webp", "image/avif"],
    qualities: [100, 80],
  },
};

export default nextConfig;
