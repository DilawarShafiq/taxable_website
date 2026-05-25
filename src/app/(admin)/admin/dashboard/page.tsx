import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { query, queryOne } from "@/lib/db/pool";
import { Users, FolderKanban, FileText, AlertTriangle, ArrowRight, Clock } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-100 text-blue-700", in_review: "bg-yellow-100 text-yellow-700",
  pending_docs: "bg-orange-100 text-orange-700", filed: "bg-green-100 text-green-700", closed: "bg-gray-100 text-gray-600",
};
const FLAGS: Record<string, string> = { usa: "🇺🇸", uk: "🇬🇧", saudi: "🇸🇦", pakistan: "🇵🇰" };

type CaseRow = { id: string; title: string; status: string; jurisdiction: string; due_date: string | null; client_name: string | null };
type LeadRow = { id: string; name: string; email: string; jurisdiction: string | null; created_at: string };

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");
  if (!["staff", "admin", "ceo"].includes(session.role)) redirect("/client/dashboard");

  const isAdmin = ["admin", "ceo"].includes(session.role);

  const [cases, clientCount, pendingDocs, leads] = await Promise.all([
    isAdmin
      ? query<CaseRow>(
          `SELECT c.id, c.title, c.status, c.jurisdiction, c.due_date,
            COALESCE(cl.company_name, p.full_name) AS client_name
           FROM cases c
           LEFT JOIN clients cl ON cl.id = c.client_id
           LEFT JOIN profiles p ON p.id = cl.profile_id
           WHERE c.status NOT IN ('filed','closed')
           ORDER BY c.due_date ASC NULLS LAST LIMIT 10`
        )
      : query<CaseRow>(
          `SELECT c.id, c.title, c.status, c.jurisdiction, c.due_date,
            COALESCE(cl.company_name, p.full_name) AS client_name
           FROM cases c
           LEFT JOIN clients cl ON cl.id = c.client_id
           LEFT JOIN profiles p ON p.id = cl.profile_id
           WHERE c.status NOT IN ('filed','closed') AND c.assigned_staff_id = $1
           ORDER BY c.due_date ASC NULLS LAST LIMIT 10`,
          [session.uid]
        ),
    queryOne<{ count: string }>("SELECT COUNT(*)::text AS count FROM clients"),
    queryOne<{ count: string }>("SELECT COUNT(*)::text AS count FROM documents WHERE processing_status = 'pending'"),
    query<LeadRow>("SELECT id, name, email, jurisdiction, created_at FROM leads ORDER BY created_at DESC LIMIT 5"),
  ]);

  const clientTotal = parseInt(clientCount?.count ?? "0");
  const pendingDocsTotal = parseInt(pendingDocs?.count ?? "0");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {session.role === "ceo" ? "Executive Overview" : `Welcome back, ${session.fullName.split(" ")[0]}`}
        </h1>
        <p className="text-gray-500 text-sm mt-1">Internal Operations Portal — {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="h-5 w-5 text-indigo-600" />} label="Total Clients" value={clientTotal.toString()} href="/admin/clients" />
        <StatCard icon={<FolderKanban className="h-5 w-5 text-blue-600" />} label="Active Cases" value={cases.length.toString()} href="/admin/cases" />
        <StatCard icon={<FileText className="h-5 w-5 text-orange-500" />} label="Docs to Review" value={pendingDocsTotal.toString()} href="/admin/documents" alert={pendingDocsTotal > 0} />
        <StatCard icon={<AlertTriangle className="h-5 w-5 text-yellow-500" />} label="New Leads" value={leads.length.toString()} href="/admin/clients" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{isAdmin ? "All Active Cases" : "My Case Queue"}</h2>
            <Link href="/admin/cases" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">Manage <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="space-y-2">
            {cases.length === 0 ? <p className="text-sm text-gray-400 italic">No active cases.</p> : cases.map((c) => (
              <Link key={c.id} href={`/admin/cases/${c.id}`}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-indigo-300 hover:shadow-sm transition group">
                <div className="flex items-center gap-3">
                  <span>{FLAGS[c.jurisdiction] ?? "📁"}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800 group-hover:text-indigo-700">{c.title}</p>
                    <p className="text-xs text-gray-400">{c.client_name ?? "—"}{c.due_date ? ` · Due ${new Date(c.due_date).toLocaleDateString("en-GB")}` : ""}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[c.status]}`}>{c.status.replace("_", " ")}</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
            <Link href="/admin/clients?tab=leads" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="space-y-2">
            {leads.length === 0 ? <p className="text-sm text-gray-400 italic">No recent leads.</p> : leads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">{lead.name}</p>
                  <p className="text-xs text-gray-400">{lead.email} · {FLAGS[lead.jurisdiction ?? ""] ?? ""} {lead.jurisdiction?.toUpperCase() ?? "Unknown"}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  {new Date(lead.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, href, alert }: { icon: React.ReactNode; label: string; value: string; href: string; alert?: boolean }) {
  return (
    <Link href={href} className={`bg-white border ${alert ? "border-orange-200" : "border-gray-200"} rounded-xl p-4 hover:shadow-sm transition block`}>
      <div className="mb-3">{icon}</div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </Link>
  );
}
