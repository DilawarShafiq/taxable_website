import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth(function proxy(req) {
  const { pathname } = req.nextUrl;

  if (
    (pathname.startsWith("/client") || pathname.startsWith("/admin")) &&
    !req.auth
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
