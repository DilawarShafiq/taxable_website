import { cookies } from "next/headers";
import { verifySessionCookie } from "@/lib/firebase/admin";
import { queryOne } from "@/lib/db/pool";

export const SESSION_COOKIE = "__session";

export interface SessionUser {
  uid: string;
  email: string;
  role: string;
  fullName: string;
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionCookie) return null;

  const decoded = await verifySessionCookie(sessionCookie);
  if (!decoded) return null;

  const profile = await queryOne<{ role: string; full_name: string }>(
    "SELECT role, full_name FROM profiles WHERE id = $1",
    [decoded.uid]
  );

  return {
    uid: decoded.uid,
    email: decoded.email ?? "",
    role: profile?.role ?? "client",
    fullName: profile?.full_name ?? "",
  };
}
