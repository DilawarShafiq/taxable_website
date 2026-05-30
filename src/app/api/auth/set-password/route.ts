import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db/pool";
import { verifyResetToken } from "@/lib/auth/reset-token";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json().catch(() => ({ token: "", password: "" }));

  if (!token || !password || password.length < 8) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = verifyResetToken(token);
  if (!email) {
    return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 12);
  await query("UPDATE profiles SET password_hash = $1 WHERE email = $2", [hash, email]);

  return NextResponse.json({ success: true });
}
