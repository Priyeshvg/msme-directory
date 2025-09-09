import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/msme',
  assetPrefix: '/msme',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
