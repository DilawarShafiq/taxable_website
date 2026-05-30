import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { queryOne } from "@/lib/db/pool";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        if (!email || !password) return null;

        const user = await queryOne<{
          id: string;
          email: string;
          full_name: string;
          role: string;
          password_hash: string;
        }>(
          "SELECT id, email, full_name, role, password_hash FROM profiles WHERE email = $1",
          [email]
        );

        if (!user?.password_hash) return null;

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.full_name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "client";
        token.uid = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = (token.role as string) ?? "client";
      session.user.uid = (token.uid as string) ?? "";
      return session;
    },
    authorized: authConfig.callbacks!.authorized!,
  },
  session: { strategy: "jwt" },
});
