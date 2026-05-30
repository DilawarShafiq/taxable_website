import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export interface SessionUser {
  uid: string;
  email: string;
  role: string;
  fullName: string;
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) return null;
    return {
      uid: session.user.id,
      email: session.user.email ?? "",
      role: (session.user as { role?: string }).role ?? "client",
      fullName: session.user.name ?? "",
    };
  } catch {
    return null;
  }
}
