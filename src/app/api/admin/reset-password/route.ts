import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { query, queryOne } from "@/lib/db/pool";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const role = (session.user as { role?: string }).role ?? "client";
  if (!["admin", "ceo"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email, newPassword } = await req.json().catch(() => ({}));
  if (!email || !newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: "Email and password (min 8 chars) required" }, { status: 400 });
  }

  const user = await queryOne<{ id: string }>(
    `SELECT id FROM "user" WHERE email = $1`,
    [email]
  );
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Hash with Better Auth's own hasher and write to the credential account,
  // so the new password works with Better Auth sign-in (single auth system).
  const ctx = await auth.$context;
  const hash = await ctx.password.hash(newPassword);
  await query(
    `UPDATE account SET password = $1, updated_at = now()
     WHERE user_id = $2 AND provider_id = 'credential'`,
    [hash, user.id]
  );

  return NextResponse.json({ success: true });
}
