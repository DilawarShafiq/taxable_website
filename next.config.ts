import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // For GitHub Pages deployment
  basePath: "/taxable-ai-website",
  assetPrefix: "/taxable-ai-website/",
};

export default nextConfig;
