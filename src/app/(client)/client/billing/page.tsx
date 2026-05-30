import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { query, queryOne } from "@/lib/db/pool";
import { Receipt, AlertCircle, CheckCircle, Clock } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-500", icon: <Clock className="h-3 w-3" /> },
  sent: { label: "Due", color: "bg-yellow-100 text-yellow-700", icon: <AlertCircle className="h-3 w-3" /> },
  paid: { label: "Paid", color: "bg-green-100 text-green-700", icon: <CheckCircle className="h-3 w-3" /> },
  overdue: { label: "Overdue", color: "bg-red-100 text-red-700", icon: <AlertCircle className="h-3 w-3" /> },
};

export default async function ClientBillingPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  let invoices: { id: string; amount_usd: number; status: string; due_date: string | null; created_at: string }[] = [];
  try {
    const clientRow = await queryOne<{ id: string }>("SELECT id FROM clients WHERE profile_id = $1", [session.uid]);
    if (clientRow) {
      invoices = await query(
        "SELECT id, amount_usd, status, due_date, created_at FROM invoices WHERE client_id = $1 ORDER BY created_at DESC LIMIT 30",
        [clientRow.id]
      );
    }
  } catch { /* no invoices yet */ }

  const outstanding = invoices.filter((i) => ["sent", "overdue"].includes(i.status)).reduce((s, i) => s + Number(i.amount_usd), 0);
  const paid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.amount_usd), 0);

  return (
    <div className="space-y-8 max-w-4xl px-6 py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-500 text-sm mt-1">Your invoices and payment history</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs text-gray-500 mb-1">Outstanding Balance</p>
          <p className={`text-2xl font-bold ${outstanding > 0 ? "text-red-600" : "text-gray-400"}`}>
            {outstanding > 0 ? `$${outstanding.toFixed(2)}` : "All Clear"}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs text-gray-500 mb-1">Total Paid</p>
          <p className="text-2xl font-bold text-green-600">${paid.toFixed(2)}</p>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center">
          <Receipt className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500 mb-1">No invoices yet</p>
          <p className="text-xs text-gray-400">Invoices from your accountant will appear here</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Invoice</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Due</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((inv) => {
                const cfg = STATUS_CONFIG[inv.status] ?? STATUS_CONFIG.draft;
                return (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900 font-mono text-xs">
                      {inv.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${cfg.color}`}>
                        {cfg.icon}{cfg.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">
                      {inv.due_date ? new Date(inv.due_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </td>
                    <td className={`py-3 px-4 text-right font-semibold ${inv.status === "overdue" ? "text-red-600" : "text-gray-900"}`}>
                      ${Number(inv.amount_usd).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
