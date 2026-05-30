import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.in" },
    ],
  },
  serverExternalPackages: ["pdf-parse", "pg", "bcryptjs", "@google-cloud/storage", "@google-cloud/cloud-sql-connector", "nodemailer"],
};

export default nextConfig;
