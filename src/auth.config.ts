import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      const isProtected =
        pathname.startsWith("/client") || pathname.startsWith("/admin");
      if (isProtected && !isLoggedIn) {
        const loginUrl = new URL("/auth/login", nextUrl.origin);
        loginUrl.searchParams.set("redirectTo", pathname);
        return Response.redirect(loginUrl);
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
