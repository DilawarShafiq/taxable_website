import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { queryOne } from "@/lib/db/pool";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  if (!["admin", "ceo"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email, newPassword } = await req.json().catch(() => ({}));
  if (!email || !newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: "Email and password (min 8 chars) required" }, { status: 400 });
  }

  const user = await queryOne<{ id: string }>(
    "SELECT id FROM profiles WHERE email = $1",
    [email]
  );
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const hash = await bcrypt.hash(newPassword, 12);
  await queryOne(
    "UPDATE profiles SET password_hash = $1 WHERE email = $2",
    [hash, email]
  );

  return NextResponse.json({ success: true });
}
