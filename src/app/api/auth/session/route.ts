// Sign-out is handled by Better Auth via DELETE /api/auth/sign-out
// This route kept for backwards compatibility with any existing clients
import { NextResponse } from "next/server";

export async function DELETE() {
  return NextResponse.json({ success: true });
}
