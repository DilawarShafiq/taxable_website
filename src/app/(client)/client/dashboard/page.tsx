import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { query, queryOne } from "@/lib/db/pool";
import { CalendarDays, FileText, FolderKanban, Receipt, ArrowRight, AlertCircle } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  open: "Open", in_review: "In Review", pending_docs: "Awaiting Documents", filed: "Filed", closed: "Closed",
};
const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-100 text-blue-700", in_review: "bg-yellow-100 text-yellow-700",
  pending_docs: "bg-orange-100 text-orange-700", filed: "bg-green-100 text-green-700", closed: "bg-gray-100 text-gray-600",
};
const JURISDICTION_FLAGS: Record<string, string> = { usa: "🇺🇸", uk: "🇬🇧", saudi: "🇸🇦", pakistan: "🇵🇰" };

export default async function ClientDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const client = await queryOne<{ id: string; company_name: string | null; onboarded_at: string | null; jurisdictions: string[] }>(
    "SELECT id, company_name, onboarded_at, jurisdictions FROM clients WHERE profile_id = $1",
    [session.uid]
  );

  if (!client || !client.onboarded_at) return <OnboardingPrompt />;

  const [cases, pendingDocsRow, nextAppointment, invoices] = await Promise.all([
    query<{ id: string; title: string; status: string; jurisdiction: string; due_date: string | null }>(
      "SELECT id, title, status, jurisdiction, due_date FROM cases WHERE client_id = $1 AND status != 'closed' ORDER BY updated_at DESC LIMIT 5",
      [client.id]
    ),
    queryOne<{ count: string }>("SELECT COUNT(*)::text AS count FROM documents WHERE client_id = $1 AND processing_status = 'pending'", [client.id]),
    queryOne<{ id: string; starts_at: string; type: string | null }>(
      "SELECT id, starts_at, type FROM appointments WHERE client_id = $1 AND status = 'scheduled' AND starts_at >= NOW() ORDER BY starts_at LIMIT 1",
      [client.id]
    ),
    query<{ amount_usd: number }>("SELECT amount_usd FROM invoices WHERE client_id = $1 AND status IN ('sent','overdue')", [client.id]),
  ]);

  const pendingDocsCount = parseInt(pendingDocsRow?.count ?? "0");
  const outstandingBalance = invoices.reduce((sum, inv) => sum + Number(inv.amount_usd), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {client.company_name ? `${client.company_name}` : "Dashboard"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {(client.jurisdictions ?? []).map((j: string) => JURISDICTION_FLAGS[j] ?? j).join(" ")} — Here&apos;s your overview
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={<FolderKanban className="h-5 w-5 text-blue-600" />}
          label="Active Cases"
          value={cases.length.toString()}
          href="/client/cases"
          color="blue"
        />
        <KPICard
          icon={<FileText className="h-5 w-5 text-orange-600" />}
          label="Docs Pending"
          value={pendingDocsCount.toString()}
          href="/client/documents"
          color="orange"
          alert={pendingDocsCount > 0}
        />
        <KPICard
          icon={<CalendarDays className="h-5 w-5 text-green-600" />}
          label="Next Appointment"
          value={nextAppointment ? new Date(nextAppointment.starts_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "None"}

          href="/client/appointments"
          color="green"
        />
        <KPICard
          icon={<Receipt className="h-5 w-5 text-red-600" />}
          label="Outstanding"
          value={outstandingBalance > 0 ? `$${outstandingBalance.toFixed(0)}` : "Clear"}
          href="/client/billing"
          color={outstandingBalance > 0 ? "red" : "gray"}
          alert={outstandingBalance > 0}
        />
      </div>

      {/* Active cases */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Active Cases</h2>
          <Link href="/client/cases" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {cases.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400">
            <FolderKanban className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No active cases. Our team will create one for you shortly.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cases.map((c) => (
              <Link key={c.id} href={`/client/cases/${c.id}`}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-blue-300 hover:shadow-sm transition group">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{JURISDICTION_FLAGS[c.jurisdiction] ?? "📁"}</span>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-blue-700 text-sm">{c.title}</p>
                    {c.due_date && (
                      <p className="text-xs text-gray-400">Due {new Date(c.due_date).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[c.status]}`}>
                  {STATUS_LABELS[c.status]}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function KPICard({ icon, label, value, href, color, alert }: {
  icon: React.ReactNode; label: string; value: string; href: string;
  color: string; alert?: boolean;
}) {
  const borderColor = alert ? "border-orange-200" : "border-gray-200";
  return (
    <Link href={href}
      className={`bg-white border ${borderColor} rounded-xl p-4 hover:shadow-sm transition block relative`}>
      {alert && (
        <AlertCircle className="h-3.5 w-3.5 text-orange-500 absolute top-3 right-3" />
      )}
      <div className="mb-3">{icon}</div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </Link>
  );
}

function OnboardingPrompt() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md text-center">
        <div className="text-5xl mb-4">👋</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Taxable AI</h1>
        <p className="text-gray-500 text-sm mb-8">
          Complete your profile so our team can set up your account and start working on your cases.
        </p>
        <Link href="/client/onboarding"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-blue-700 transition">
          Complete Setup
        </Link>
      </div>
    </div>
  );
}
