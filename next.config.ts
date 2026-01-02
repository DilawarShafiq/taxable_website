import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // For GitHub Pages, uncomment and set your repo name:
  // basePath: "/taxable",
  // assetPrefix: "/taxable/",
};

export default nextConfig;
