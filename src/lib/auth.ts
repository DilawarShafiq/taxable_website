import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { sendPasswordResetEmail } from "@/lib/email/gmail";
import { query } from "@/lib/db/pool";

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
        // Mirror every new user into the domain `profiles` table, keyed by the
        // Better Auth user id. The rest of the app links clients/cases/messages
        // on profiles.id = session.user.id, so this row must exist for the
        // client portal (onboarding, chat, etc.) to work.
        after: async (user) => {
          const role = (user as { role?: string }).role ?? "client";
          await query(
            `INSERT INTO profiles (id, email, full_name, role)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (email) DO UPDATE SET
               full_name = EXCLUDED.full_name,
               role = EXCLUDED.role,
               updated_at = now()`,
            [user.id, user.email, user.name ?? "", role]
          ).catch((err) => console.error("[auth] profile sync failed:", err));
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
  // The existing database tables use snake_case columns (created under the
  // previous NextAuth-based schema). Map Better Auth's camelCase field names to
  // those real column names so signups read/write the existing schema.
  user: {
    modelName: "user",
    fields: {
      emailVerified: "email_verified",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "client",
        input: false,
      },
    },
  },
  session: {
    modelName: "session",
    fields: {
      expiresAt: "expires_at",
      ipAddress: "ip_address",
      userAgent: "user_agent",
      userId: "user_id",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 min cache on cookie
    },
  },
  account: {
    modelName: "account",
    fields: {
      accountId: "account_id",
      providerId: "provider_id",
      userId: "user_id",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      idToken: "id_token",
      accessTokenExpiresAt: "access_token_expires_at",
      refreshTokenExpiresAt: "refresh_token_expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  verification: {
    modelName: "verification",
    fields: {
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://taxablewebsite.vercel.app",
    "http://localhost:3000",
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
