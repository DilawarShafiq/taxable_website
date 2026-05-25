import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { query, queryOne } from "@/lib/db/pool";

const STATUS_LABELS: Record<string, string> = {
  open: "Open", in_review: "In Review", pending_docs: "Awaiting Docs", filed: "Filed", closed: "Closed",
};
const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-100 text-blue-700", in_review: "bg-yellow-100 text-yellow-700",
  pending_docs: "bg-orange-100 text-orange-700", filed: "bg-green-100 text-green-700", closed: "bg-gray-100 text-gray-600",
};
const FLAGS: Record<string, string> = { usa: "🇺🇸", uk: "🇬🇧", saudi: "🇸🇦", pakistan: "🇵🇰" };
const TYPE_LABELS: Record<string, string> = {
  tax_filing: "Tax Filing", audit: "Audit", accounting: "Accounting", consultation: "Consultation",
};

type CaseRow = { id: string; title: string; type: string; status: string; jurisdiction: string; tax_year: string | null; due_date: string | null };

export default async function ClientCasesPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const client = await queryOne<{ id: string }>("SELECT id FROM clients WHERE profile_id = $1", [session.uid]);
  if (!client) redirect("/client/dashboard");

  const cases = await query<CaseRow>(
    "SELECT id, title, type, status, jurisdiction, tax_year, due_date FROM cases WHERE client_id = $1 ORDER BY updated_at DESC",
    [client.id]
  );

  const grouped = {
    active: cases.filter((c) => !["filed", "closed"].includes(c.status)),
    completed: cases.filter((c) => ["filed", "closed"].includes(c.status)),
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">My Cases</h1>
      {[{ title: "Active Cases", items: grouped.active }, { title: "Completed", items: grouped.completed }].map(({ title, items }) => (
        <section key={title}>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{title} ({items.length})</h2>
          {items.length === 0 ? <p className="text-sm text-gray-400 italic">None</p> : (
            <div className="space-y-2">
              {items.map((c) => (
                <Link key={c.id} href={`/client/cases/${c.id}`}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-blue-300 hover:shadow-sm transition group">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{FLAGS[c.jurisdiction] ?? "📁"}</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-700">{c.title}</p>
                      <p className="text-xs text-gray-400">
                        {TYPE_LABELS[c.type] ?? c.type} · {c.tax_year ?? "—"}{c.due_date ? ` · Due ${new Date(c.due_date).toLocaleDateString()}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[c.status]}`}>{STATUS_LABELS[c.status]}</span>
                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
