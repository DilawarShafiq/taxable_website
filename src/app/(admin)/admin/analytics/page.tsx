import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { queryOne } from "@/lib/db/pool";
import { BarChart3, Users, FolderKanban, FileText, Receipt } from "lucide-react";

export default async function AdminAnalyticsPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");
  if (!["admin", "ceo"].includes(session.role)) redirect("/admin/dashboard");

  const stats = { clients: 0, cases: 0, documents: 0, revenue: 0 };
  try {
    const [c, cs, d, r] = await Promise.all([
      queryOne<{ count: string }>("SELECT COUNT(*)::text AS count FROM clients"),
      queryOne<{ count: string }>("SELECT COUNT(*)::text AS count FROM cases WHERE status != 'closed'"),
      queryOne<{ count: string }>("SELECT COUNT(*)::text AS count FROM documents"),
      queryOne<{ total: string }>("SELECT COALESCE(SUM(amount_usd), 0)::text AS total FROM invoices WHERE status = 'paid'"),
    ]);
    stats.clients = parseInt(c?.count ?? "0");
    stats.cases = parseInt(cs?.count ?? "0");
    stats.documents = parseInt(d?.count ?? "0");
    stats.revenue = parseFloat(r?.total ?? "0");
  } catch { /* tables may not exist yet */ }

  const cards = [
    { label: "Total Clients", value: stats.clients.toString(), icon: <Users className="h-5 w-5 text-blue-500" />, color: "blue" },
    { label: "Active Cases", value: stats.cases.toString(), icon: <FolderKanban className="h-5 w-5 text-violet-500" />, color: "violet" },
    { label: "Documents", value: stats.documents.toString(), icon: <FileText className="h-5 w-5 text-orange-500" />, color: "orange" },
    { label: "Revenue Collected", value: `$${stats.revenue.toFixed(2)}`, icon: <Receipt className="h-5 w-5 text-green-500" />, color: "green" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Platform performance overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="mb-3">{card.icon}</div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <BarChart3 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-500">Detailed charts coming soon</p>
        <p className="text-xs text-gray-400 mt-1">Revenue trends, client growth, case completion rates</p>
      </div>
    </div>
  );
}
