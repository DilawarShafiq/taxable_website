"use client";

import { useState } from "react";
import {
  CheckCircle2, Circle, ExternalLink, Upload, RefreshCw, Key,
  AlertCircle, ChevronDown, ChevronUp, FileSpreadsheet, Building2,
  Link2,
} from "lucide-react";

type ConnectionStatus = "connected" | "disconnected" | "coming_soon";

interface Integration {
  id: string;
  name: string;
  logo: string;
  description: string;
  category: string;
  status: ConnectionStatus;
  helpText?: string;
  connectUrl?: string;
  features: string[];
}

const integrations: Integration[] = [
  // Accounting
  {
    id: "xero",
    name: "Xero",
    logo: "🔵",
    description: "Sync your Xero accounting data — invoices, expenses, bank transactions, and P&L — for AI-powered tax analysis.",
    category: "Accounting",
    status: "coming_soon",
    features: ["Import transactions", "Sync P&L and balance sheet", "Auto-categorise expenses", "VAT return prep"],
  },
  {
    id: "quickbooks",
    name: "QuickBooks Online",
    logo: "🟢",
    description: "Connect QuickBooks to automatically pull your financial data for tax filing and advisory.",
    category: "Accounting",
    status: "coming_soon",
    features: ["Import chart of accounts", "Sync invoices and bills", "Payroll data import", "Tax summary export"],
  },
  {
    id: "sage",
    name: "Sage Business Cloud",
    logo: "🟠",
    description: "Integrate Sage accounts for seamless data flow to your tax advisor.",
    category: "Accounting",
    status: "coming_soon",
    features: ["Financial statements import", "VAT data sync", "Payroll summary", "Management reports"],
  },
  {
    id: "freshbooks",
    name: "FreshBooks",
    logo: "🔴",
    description: "Sync FreshBooks invoices, expenses, and time tracking for freelancers and consultants.",
    category: "Accounting",
    status: "coming_soon",
    features: ["Invoice and payment sync", "Expense categorisation", "Profit/loss reports", "Client billing data"],
  },
  // Banking
  {
    id: "open_banking_uk",
    name: "UK Open Banking",
    logo: "🏦",
    description: "Connect your UK bank account via Open Banking (PSD2) to automatically import transactions.",
    category: "Banking",
    status: "coming_soon",
    features: ["Barclays, HSBC, Lloyds, NatWest, Monzo, Starling", "Auto-import statements", "Categorise transactions", "Real-time balance"],
  },
  {
    id: "plaid",
    name: "Plaid (USA)",
    logo: "🇺🇸",
    description: "Connect US bank accounts via Plaid to import transactions for IRS reporting.",
    category: "Banking",
    status: "coming_soon",
    features: ["5,000+ US banks supported", "Transaction history", "Balance information", "Income verification"],
  },
  // Tax Portals
  {
    id: "hmrc_mtd",
    name: "HMRC Making Tax Digital",
    logo: "🇬🇧",
    description: "Connect your MTD for VAT and Income Tax submissions directly through the HMRC API.",
    category: "Tax Portals",
    status: "coming_soon",
    helpText: "Requires HMRC Government Gateway credentials and MTD-compatible software registration.",
    features: ["Submit VAT returns", "View MTD obligations", "Payment deadlines", "Self Assessment (2026+)"],
  },
  {
    id: "fbr_iris",
    name: "FBR IRIS (Pakistan)",
    logo: "🇵🇰",
    description: "Import your FBR tax data — returns, payments, and ATL status.",
    category: "Tax Portals",
    status: "coming_soon",
    helpText: "FBR IRIS does not have a public API. Upload exported FBR PDFs or CSVs for AI analysis.",
    features: ["Upload return PDFs", "WHT statement analysis", "ATL status check", "Wealth reconciliation"],
  },
  {
    id: "zatca",
    name: "ZATCA (Saudi Arabia)",
    logo: "🇸🇦",
    description: "Connect to ZATCA for Zakat, CIT, VAT, and e-invoicing (Fatoora) data.",
    category: "Tax Portals",
    status: "coming_soon",
    features: ["Zakat computation aid", "VAT return data", "E-invoice status", "WHT remittance tracking"],
  },
  // File Import
  {
    id: "csv_excel",
    name: "CSV / Excel Import",
    logo: "📊",
    description: "Upload any CSV or Excel file — bank statements, transaction lists, payroll summaries — for instant AI analysis.",
    category: "Manual Import",
    status: "connected",
    connectUrl: "/client/upload",
    features: ["Any CSV or Excel format", "AI reads column headers automatically", "Supports bank exports from all banks", "Instant tax analysis"],
  },
  {
    id: "pdf_upload",
    name: "PDF Document Upload",
    logo: "📄",
    description: "Upload PDF bank statements, invoices, payslips, or tax documents for AI extraction and analysis.",
    category: "Manual Import",
    status: "connected",
    connectUrl: "/client/upload",
    features: ["Bank statements", "Invoices and receipts", "Payslips and P60s", "Tax returns"],
  },
  // API
  {
    id: "api_key",
    name: "API / Webhook",
    logo: "⚡",
    description: "Use the Taxable AI API to push financial data programmatically from your own systems.",
    category: "Developer",
    status: "coming_soon",
    features: ["REST API access", "Webhook data ingestion", "Custom ERP integration", "Zapier / Make compatible"],
  },
];

const categories = ["All", "Accounting", "Banking", "Tax Portals", "Manual Import", "Developer"];

function StatusBadge({ status }: { status: ConnectionStatus }) {
  if (status === "connected") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
        <CheckCircle2 className="h-3 w-3" /> Connected
      </span>
    );
  }
  if (status === "coming_soon") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
        <Circle className="h-3 w-3" /> Coming Soon
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-700/40 px-2 py-0.5 rounded-full border border-slate-700">
      <Circle className="h-3 w-3" /> Not Connected
    </span>
  );
}

function IntegrationCard({ integration }: { integration: Integration }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl overflow-hidden hover:border-slate-600 transition-all">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl leading-none">{integration.logo}</div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">{integration.name}</h3>
                <StatusBadge status={integration.status} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{integration.category}</p>
            </div>
          </div>

          {integration.status === "connected" && integration.connectUrl && (
            <a
              href={integration.connectUrl}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-3 py-1.5 rounded-lg transition-all flex-shrink-0"
            >
              <Upload className="h-3 w-3" />
              Open
            </a>
          )}

          {integration.status === "coming_soon" && (
            <button
              disabled
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-700/40 border border-slate-600/40 px-3 py-1.5 rounded-lg flex-shrink-0 cursor-not-allowed"
            >
              <Link2 className="h-3 w-3" />
              Connect
            </button>
          )}
        </div>

        <p className="text-sm text-slate-400 leading-relaxed">{integration.description}</p>

        {integration.helpText && (
          <div className="mt-3 flex items-start gap-2 text-xs text-amber-400 bg-amber-500/5 border border-amber-500/10 rounded-lg p-2.5">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
            <span>{integration.helpText}</span>
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {expanded ? "Hide" : "Show"} features
        </button>
      </div>

      {expanded && (
        <div className="px-5 pb-5 pt-0">
          <div className="border-t border-slate-700/50 pt-3">
            <p className="text-xs font-medium text-slate-400 mb-2">What this integration does:</p>
            <ul className="space-y-1">
              {integration.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function IntegrationsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? integrations
    : integrations.filter((i) => i.category === activeCategory);

  const connectedCount = integrations.filter((i) => i.status === "connected").length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Integrations</h1>
        <p className="text-slate-400 mt-1">
          Connect your accounting software, bank accounts, and tax portals to unlock AI-powered financial analysis.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{connectedCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Connected</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{integrations.length - connectedCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Available Soon</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{integrations.length}</p>
          <p className="text-xs text-slate-400 mt-0.5">Total</p>
        </div>
      </div>

      {/* Manual import callout */}
      <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
        <FileSpreadsheet className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-300">Available now: Upload any file for AI analysis</p>
          <p className="text-xs text-slate-400 mt-1">
            While accounting software integrations are in development, you can upload CSV exports, bank statement PDFs,
            Excel files, payslips, and any financial document for instant AI-powered analysis.
          </p>
          <a
            href="/client/upload"
            className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-blue-400 hover:text-blue-300"
          >
            Go to Upload <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
              activeCategory === cat
                ? "bg-blue-600/20 text-blue-300 border-blue-600/40"
                : "text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200 bg-slate-800/30"
            }`}
          >
            {cat}
            {cat !== "All" && (
              <span className="ml-1.5 text-slate-500">
                ({integrations.filter((i) => i.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Integration cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>

      {/* Request integration */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 text-center">
        <Building2 className="h-8 w-8 text-slate-500 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-white mb-1">Need a specific integration?</h3>
        <p className="text-xs text-slate-400 mb-4">
          We&apos;re building integrations based on client demand. Let us know what accounting software,
          bank, or tax portal you use and we&apos;ll prioritise it.
        </p>
        <a
          href="/client/messages"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-4 py-2 rounded-lg transition-all"
        >
          Request an integration
        </a>
      </div>

      {/* API section */}
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Key className="h-4 w-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-white">Developer API (Coming Soon)</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Build your own integration using the Taxable AI API. Push financial data from your ERP,
          custom systems, or automation tools (Zapier, Make, n8n) directly into your client portal.
        </p>
        <div className="bg-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto">
          <span className="text-slate-500"># Example: Push transactions via API</span>
          {"\n"}
          <span className="text-blue-400">POST</span> https://taxable.ai/api/v1/transactions{"\n"}
          <span className="text-slate-500">Authorization:</span> Bearer YOUR_API_KEY{"\n"}
          <span className="text-slate-500">Content-Type:</span> application/json{"\n\n"}
          {`{
  "transactions": [
    { "date": "2025-06-01", "amount": 5000, "description": "Client invoice", "type": "income" },
    { "date": "2025-06-03", "amount": -450, "description": "Office supplies", "type": "expense" }
  ]
}`}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <RefreshCw className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-xs text-amber-400">API documentation launching with Pro plan</span>
        </div>
      </div>
    </div>
  );
}
