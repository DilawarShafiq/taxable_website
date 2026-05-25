import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { query } from "@/lib/db/pool";

const FLAGS: Record<string, string> = { usa: "🇺🇸", uk: "🇬🇧", saudi: "🇸🇦", pakistan: "🇵🇰" };

type ClientRow = {
  id: string; company_name: string | null; full_name: string; status: string;
  jurisdictions: string[]; staff_name: string | null;
};

export default async function AdminClientsPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");
  if (!["staff", "admin", "ceo"].includes(session.role)) redirect("/client/dashboard");

  const clients = await query<ClientRow>(
    `SELECT c.id, c.company_name, c.status, c.jurisdictions,
       p.full_name, s.full_name AS staff_name
     FROM clients c
     JOIN profiles p ON p.id = c.profile_id
     LEFT JOIN profiles s ON s.id = c.assigned_staff_id
     ORDER BY c.created_at DESC`
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 text-sm mt-1">{clients.length} total clients</p>
        </div>
        <Link href="/admin/clients/new"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">
          <Plus className="h-4 w-4" /> Add Client
        </Link>
      </div>

      <input placeholder="Search clients… (coming soon)" disabled
        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-400 bg-gray-50" />

      <div className="space-y-2">
        {clients.map((client) => (
          <Link key={client.id} href={`/admin/clients/${client.id}`}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-indigo-300 hover:shadow-sm transition group">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
                {(client.company_name ?? client.full_name ?? "?")[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm group-hover:text-indigo-700">
                  {client.company_name ?? client.full_name ?? "Unnamed Client"}
                </p>
                <p className="text-xs text-gray-400">
                  {(client.jurisdictions ?? []).map((j) => FLAGS[j] ?? j).join(" ")}
                  {client.staff_name ? ` · ${client.staff_name}` : " · Unassigned"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                client.status === "active" ? "bg-green-100 text-green-700" :
                client.status === "onboarding" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"
              }`}>{client.status}</span>
              <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-indigo-500" />
            </div>
          </Link>
        ))}
        {clients.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">No clients yet. Add your first client to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
