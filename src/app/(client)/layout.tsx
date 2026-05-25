import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ClientSidebar } from "@/components/client/ClientSidebar";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/auth/login?redirectTo=/client/dashboard");
  if (["staff", "admin", "ceo"].includes(session.role)) redirect("/admin/dashboard");

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <ClientSidebar user={{ email: session.email, fullName: session.fullName }} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
