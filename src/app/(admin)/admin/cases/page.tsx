import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { query } from "@/lib/db/pool";
import { FolderKanban, AlertCircle } from "lucide-react";
import Link from "next/link";
import { JURISDICTION_FLAGS, CASE_STATUS_COLORS } from "@/lib/constants";

export default async function AdminCasesPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  let cases: { id: string; title: string; status: string; jurisdiction: string; due_date: string | null; client_name: string }[] = [];
  try {
    cases = await query(
      `SELECT c.id, c.title, c.status, c.jurisdiction, c.due_date,
       COALESCE(p.full_name, cl.company_name, 'Unknown') AS client_name
       FROM cases c
       JOIN clients cl ON cl.id = c.client_id
       JOIN profiles p ON p.id = cl.profile_id
       ORDER BY c.updated_at DESC LIMIT 50`
    );
  } catch { /* no cases yet */ }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cases</h1>
          <p className="text-gray-500 text-sm mt-1">All active client cases</p>
        </div>
      </div>

      {cases.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center">
          <FolderKanban className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No cases yet</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Case</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Client</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Jurisdiction</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{c.title}</td>
                  <td className="py-3 px-4 text-gray-600">{c.client_name}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${CASE_STATUS_COLORS[c.status] ?? "bg-gray-100 text-gray-500"}`}>
                      {c.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{JURISDICTION_FLAGS[c.jurisdiction] ?? ""} {c.jurisdiction}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {c.due_date ? (
                      <span className={new Date(c.due_date) < new Date() ? "text-red-600 font-medium" : ""}>
                        {new Date(c.due_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        {new Date(c.due_date) < new Date() && <AlertCircle className="inline h-3 w-3 ml-1" />}
                      </span>
                    ) : "—"}
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
