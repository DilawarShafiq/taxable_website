import { NextRequest, NextResponse } from "next/server";
import { createSessionCookie, adminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { query, queryOne } from "@/lib/db/pool";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    if (!idToken) return NextResponse.json({ error: "Missing token" }, { status: 400 });

    const decoded = await adminAuth().verifyIdToken(idToken);

    // Upsert profile
    await query(
      `INSERT INTO profiles (id, email, full_name, role)
       VALUES ($1, $2, $3, 'client')
       ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email`,
      [decoded.uid, decoded.email ?? "", decoded.name ?? ""]
    );

    const profile = await queryOne<{ role: string }>(
      "SELECT role FROM profiles WHERE id = $1",
      [decoded.uid]
    );

    const sessionCookie = await createSessionCookie(idToken);
    const response = NextResponse.json({ role: profile?.role ?? "client" });
    response.cookies.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 14,
      path: "/",
    });
    return response;
  } catch (err) {
    console.error("[auth/session]", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
  return response;
}
