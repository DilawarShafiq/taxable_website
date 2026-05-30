import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ClientSidebar } from "@/components/client/ClientSidebar";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/auth/login?redirectTo=/client/dashboard");
  if (["staff", "admin", "ceo"].includes(session.role)) redirect("/admin/dashboard");

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <ClientSidebar user={{ email: session.email, fullName: session.fullName }} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <main className="flex-1 overflow-y-auto h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
