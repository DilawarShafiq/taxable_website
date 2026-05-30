import { redirect } from "next/navigation";
import Link from "next/link";

import { getSession } from "@/lib/auth/session";
import { queryOne } from "@/lib/db/pool";
import { Bot, ArrowRight, FileText, Receipt, Shield } from "lucide-react";
import { JURISDICTION_FLAGS, JURISDICTION_NAMES } from "@/lib/constants";

export default async function ClientDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const client = await queryOne<{
    id: string;
    company_name: string | null;
    onboarded_at: string | null;
    jurisdictions: string[];
    business_type: string | null;
  }>(
    "SELECT id, company_name, onboarded_at, jurisdictions, business_type FROM clients WHERE profile_id = $1",
    [session.uid]
  ).catch(() => null);

  const firstName = session.fullName?.split(" ")[0] ?? "there";

  // Not onboarded — redirect immediately
  if (!client || !client.onboarded_at) {
    redirect("/client/onboarding");
  }

  const jurisdictions = client.jurisdictions ?? [];

  return (
    <div className="space-y-8 max-w-4xl px-6 py-8 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {firstName}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {jurisdictions.map((j) => `${JURISDICTION_FLAGS[j] ?? ""} ${JURISDICTION_NAMES[j] ?? j}`).join(" · ")}
          {client.company_name ? ` · ${client.company_name}` : ""}
        </p>
      </div>

      {/* Primary CTA — AI Assistant */}
      <Link
        href="/client/assistant"
        className="group block bg-gradient-to-br from-slate-900 via-slate-800 to-violet-900 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Bot className="h-5 w-5 text-violet-300" />
            </div>
            <div>
              <p className="font-semibold">AI Tax Assistant</p>
              <p className="text-xs text-white/60">Powered by Claude</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </div>
        <p className="text-sm text-white/70 mb-4 leading-relaxed">
          Ask tax questions, upload documents for instant analysis, get jurisdiction-specific advice.
          Available 24/7 with extended AI reasoning.
        </p>
        <div className="flex flex-wrap gap-2">
          {jurisdictions.slice(0, 3).map((j) => (
            <span key={j} className="text-[11px] bg-white/10 rounded-lg px-2.5 py-1">
              {JURISDICTION_FLAGS[j]} {JURISDICTION_NAMES[j] ?? j} tax
            </span>
          ))}
          <span className="text-[11px] bg-white/10 rounded-lg px-2.5 py-1">+ document analysis</span>
        </div>
      </Link>

      {/* Secondary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition">
          <FileText className="h-5 w-5 text-blue-500 mb-3" />
          <p className="text-sm font-semibold text-gray-900 mb-1">Document Analysis</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Upload bank statements, invoices, or Excel files inside the AI assistant for instant extraction and insights.
          </p>
          <Link href="/client/assistant" className="text-xs text-blue-600 mt-3 inline-flex items-center gap-1 hover:gap-2 transition-all">
            Open assistant <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition">
          <Receipt className="h-5 w-5 text-green-500 mb-3" />
          <p className="text-sm font-semibold text-gray-900 mb-1">Billing</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            View invoices from your accountant and track your payment history.
          </p>
          <Link href="/client/billing" className="text-xs text-blue-600 mt-3 inline-flex items-center gap-1 hover:gap-2 transition-all">
            View billing <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition">
          <Shield className="h-5 w-5 text-violet-500 mb-3" />
          <p className="text-sm font-semibold text-gray-900 mb-1">Your Account</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            {client.business_type ? `${client.business_type.replace("_", " ")} · ` : ""}
            {jurisdictions.map((j) => JURISDICTION_FLAGS[j]).join(" ")} coverage.
            {" "}Our team will reach out within 24 hours.
          </p>
          <p className="text-xs text-green-600 mt-3 font-medium">● Account active</p>
        </div>
      </div>

      {/* Quick prompts */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick questions to ask your AI</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            ...jurisdictions.slice(0, 2).map((j) => `What are my key tax deadlines in ${JURISDICTION_NAMES[j] ?? j}?`),
            "How do I reduce my tax bill legally?",
            "Can you explain my options for business structure?",
          ].map((q) => (
            <Link
              key={q}
              href={`/client/assistant`}
              className="text-sm text-gray-600 bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-blue-300 hover:text-gray-900 transition truncate"
            >
              {q}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
