import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/auth/login?redirectTo=/admin/dashboard");
  if (!["staff", "admin", "ceo"].includes(session.role)) redirect("/client/dashboard");

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <AdminSidebar user={{ email: session.email, fullName: session.fullName, role: session.role }} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
