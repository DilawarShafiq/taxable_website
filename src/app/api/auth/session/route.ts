// Kept for backwards compatibility — sign-out is now handled by NextAuth via /api/auth/signout
import { NextResponse } from "next/server";
import { signOut } from "@/auth";

export async function DELETE() {
  await signOut({ redirect: false });
  return NextResponse.json({ success: true });
}
