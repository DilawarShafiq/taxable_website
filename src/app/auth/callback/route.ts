import { NextResponse } from "next/server";

// Firebase OAuth is handled client-side; this route handles any legacy redirects
export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  const raw = searchParams.get("redirectTo") ?? "/client/dashboard";
  // Only allow relative paths to prevent open redirect attacks
  const safe = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/client/dashboard";
  return NextResponse.redirect(`${origin}${safe}`);
}
