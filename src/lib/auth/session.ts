import { auth } from "@/auth";

export interface SessionUser {
  uid: string;
  email: string;
  role: string;
  fullName: string;
}

export async function getSession(): Promise<SessionUser | null> {
  const session = await auth();
  if (!session?.user) return null;
  return {
    uid: session.user.uid ?? session.user.email ?? "",
    email: session.user.email ?? "",
    role: session.user.role ?? "client",
    fullName: session.user.name ?? "",
  };
}
