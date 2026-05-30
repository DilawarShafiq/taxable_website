import type { NextConfig } from "next";
import path from "path";

const kyselyShim = path.resolve("./src/lib/stubs/kysely-shim.js");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.in" },
    ],
  },
  serverExternalPackages: ["pdf-parse", "pg", "bcryptjs", "@google-cloud/storage", "@google-cloud/cloud-sql-connector", "nodemailer"],
  experimental: {
    turbo: {
      resolveAlias: {
        // Shim adds missing DEFAULT_MIGRATION_* constants removed in kysely 0.27+
        // @better-auth/kysely-adapter references them but we only use pg
        kysely: kyselyShim,
      },
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      kysely: kyselyShim,
    };
    return config;
  },
};

export default nextConfig;
