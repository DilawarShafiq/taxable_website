import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { sendPasswordResetEmail } from "@/lib/email/gmail";

function makePool() {
  const url = process.env.DATABASE_URL;
  if (url) {
    return new Pool({
      connectionString: url,
      ssl: { rejectUnauthorized: false },
      max: 3,
    });
  }
  // Cloud SQL Unix socket (Cloud Run)
  return new Pool({
    host: process.env.DB_HOST ?? "34.122.204.241",
    port: 5432,
    database: process.env.DB_NAME ?? "taxable_ai",
    user: process.env.DB_USER ?? "postgres",
    password: process.env.DB_PASS,
    ssl: false,
    max: 3,
  });
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "dilawar.gopang@gmail.com";

export const auth = betterAuth({
  database: makePool(),
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (user.email === ADMIN_EMAIL) {
            return { data: { ...user, role: "admin" } };
          }
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail(
        user.email,
        user.name ?? "there",
        url
      ).catch((err) => console.error("[auth] reset email failed:", err));
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "client",
        input: false,
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 min cache on cookie
    },
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://taxablewebsite.vercel.app",
    "http://localhost:3000",
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
