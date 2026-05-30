import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.in" },
    ],
  },
  serverExternalPackages: ["pdf-parse", "pg", "bcryptjs", "@google-cloud/storage", "@google-cloud/cloud-sql-connector", "nodemailer", "better-auth", "@better-auth/kysely-adapter", "kysely"],
};

export default nextConfig;
