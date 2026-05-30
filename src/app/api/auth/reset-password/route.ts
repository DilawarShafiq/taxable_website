import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db/pool";
import { sendPasswordResetEmail } from "@/lib/email/gmail";
import { createResetToken } from "@/lib/auth/reset-token";

export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({ email: "" }));

  // Always return success to avoid email enumeration
  if (!email || !email.includes("@")) {
    return NextResponse.json({ success: true });
  }

  try {
    const user = await queryOne<{ id: string; full_name: string }>(
      "SELECT id, full_name FROM profiles WHERE email = $1",
      [email]
    );

    if (user) {
      const token = createResetToken(email);
      const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://taxable.ai"}/auth/set-password?token=${token}`;
      await sendPasswordResetEmail(email, user.full_name, resetUrl).catch(console.error);
    }
  } catch {
    // Silently fail — don't reveal errors to the client
  }

  return NextResponse.json({ success: true });
}
