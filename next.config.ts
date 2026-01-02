import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // For GitHub Pages deployment
  basePath: "/taxable_website",
  assetPrefix: "/taxable_website/",
};

export default nextConfig;
