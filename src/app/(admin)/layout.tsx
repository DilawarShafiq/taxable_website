import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/auth/login?redirectTo=/admin/dashboard");
  if (!["staff", "admin", "ceo"].includes(session.role)) redirect("/client/dashboard");

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar user={{ email: session.email, fullName: session.fullName, role: session.role }} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
