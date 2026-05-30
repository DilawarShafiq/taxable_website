import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query, queryOne } from "@/lib/db/pool";

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName } = await req.json();

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existing = await queryOne<{ password_hash: string | null }>(
      "SELECT password_hash FROM profiles WHERE email = $1",
      [email]
    );
    if (existing?.password_hash) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);
    const adminEmail = process.env.ADMIN_EMAIL ?? "dilawar.gopang@gmail.com";
    const role = email === adminEmail ? "admin" : "client";

    // Insert new profile; if email exists with no password (Firebase migration), update it
    await query(
      `INSERT INTO profiles (id, email, full_name, role, password_hash)
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE SET
         full_name = EXCLUDED.full_name,
         password_hash = EXCLUDED.password_hash`,
      [email, fullName, role, hash]
    );

    return NextResponse.json({ success: true, role });
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
