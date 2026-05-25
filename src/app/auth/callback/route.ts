import { NextResponse } from "next/server";

// Firebase OAuth is handled client-side; this route handles any legacy redirects
export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  const redirectTo = searchParams.get("redirectTo") ?? "/client/dashboard";
  return NextResponse.redirect(`${origin}${redirectTo}`);
}
