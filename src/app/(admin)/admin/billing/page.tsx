import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { query } from "@/lib/db/pool";
import { Receipt, AlertCircle, CheckCircle, Clock, DollarSign } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-500", icon: <Clock className="h-3 w-3" /> },
  sent: { label: "Due", color: "bg-yellow-100 text-yellow-700", icon: <AlertCircle className="h-3 w-3" /> },
  paid: { label: "Paid", color: "bg-green-100 text-green-700", icon: <CheckCircle className="h-3 w-3" /> },
  overdue: { label: "Overdue", color: "bg-red-100 text-red-700", icon: <AlertCircle className="h-3 w-3" /> },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-400", icon: <Clock className="h-3 w-3" /> },
};

export default async function AdminBillingPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  let invoices: { id: string; amount_usd: number; status: string; due_date: string | null; created_at: string; client_name: string }[] = [];
  try {
    invoices = await query(
      `SELECT i.id, i.amount_usd, i.status, i.due_date, i.created_at,
       COALESCE(p.full_name, cl.company_name, 'Unknown') AS client_name
       FROM invoices i
       JOIN clients cl ON cl.id = i.client_id
       JOIN profiles p ON p.id = cl.profile_id
       ORDER BY i.created_at DESC LIMIT 100`
    );
  } catch { /* no invoices yet */ }

  const totalOutstanding = invoices.filter((i) => ["sent", "overdue"].includes(i.status)).reduce((s, i) => s + Number(i.amount_usd), 0);
  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.amount_usd), 0);
  const overdue = invoices.filter((i) => i.status === "overdue").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-500 text-sm mt-1">Client invoices and revenue overview</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2"><DollarSign className="h-4 w-4 text-yellow-500" /><p className="text-xs text-gray-500">Outstanding</p></div>
          <p className={`text-2xl font-bold ${totalOutstanding > 0 ? "text-yellow-600" : "text-gray-400"}`}>${totalOutstanding.toFixed(2)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2"><CheckCircle className="h-4 w-4 text-green-500" /><p className="text-xs text-gray-500">Total Collected</p></div>
          <p className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2"><AlertCircle className="h-4 w-4 text-red-500" /><p className="text-xs text-gray-500">Overdue</p></div>
          <p className={`text-2xl font-bold ${overdue > 0 ? "text-red-600" : "text-gray-400"}`}>{overdue}</p>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center">
          <Receipt className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No invoices yet</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Invoice</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Client</th>
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
                    <td className="py-3 px-4 font-mono text-xs text-gray-900">{inv.id.slice(0, 8).toUpperCase()}</td>
                    <td className="py-3 px-4 text-gray-600">{inv.client_name}</td>
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
