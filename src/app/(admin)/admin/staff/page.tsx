import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { query } from "@/lib/db/pool";
import { UserCog, Shield } from "lucide-react";

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-violet-100 text-violet-700",
  ceo: "bg-amber-100 text-amber-700",
  staff: "bg-emerald-100 text-emerald-700",
};

export default async function AdminStaffPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");
  if (!["admin", "ceo"].includes(session.role)) redirect("/admin/dashboard");

  let staff: { id: string; email: string; full_name: string; role: string; created_at: string }[] = [];
  try {
    staff = await query(
      "SELECT id, email, full_name, role, created_at FROM profiles WHERE role IN ('staff','admin','ceo') ORDER BY created_at ASC"
    );
  } catch { /* no staff yet */ }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
          <p className="text-gray-500 text-sm mt-1">Internal team members</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-violet-50 text-violet-600 border border-violet-100 rounded-lg px-3 py-2">
          <Shield className="h-3.5 w-3.5" />
          Staff accounts are added directly in the database
        </div>
      </div>

      {staff.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center">
          <UserCog className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No staff members found</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staff.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white text-xs font-bold flex-shrink-0">
                        {s.full_name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <span className="font-medium text-gray-900">{s.full_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{s.email}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${ROLE_COLORS[s.role] ?? "bg-gray-100 text-gray-500"}`}>
                      {s.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {new Date(s.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
