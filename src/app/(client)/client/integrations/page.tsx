"use client";

import { useState } from "react";
import {
  CheckCircle2, Circle, ExternalLink, Upload, Key,
  AlertCircle, ChevronDown, ChevronUp, FileSpreadsheet, Building2,
  Link2, Zap, ArrowRight, Copy, Check, FileText, Bot,
} from "lucide-react";

type ConnectionStatus = "live" | "coming_soon" | "manual";

interface Integration {
  id: string;
  name: string;
  logo: string;
  description: string;
  category: string;
  status: ConnectionStatus;
  helpText?: string;
  connectUrl?: string;
  howToUseNow?: string[];
  features: string[];
  automationLevel: "full" | "partial" | "manual";
}

const integrations: Integration[] = [
  {
    id: "csv_excel",
    name: "CSV / Excel Import",
    logo: "📊",
    description: "Upload bank statements, transaction exports, or any spreadsheet. AI auto-reads columns, categorises transactions, and gives instant tax analysis.",
    category: "Available Now",
    status: "live",
    connectUrl: "/client/upload",
    automationLevel: "full",
    howToUseNow: [
      "Export your bank statement as CSV from your bank's online portal",
      "Go to Upload Files in the sidebar",
      "Drop the CSV file — AI reads it automatically (any column format)",
      "Go to AI Assistant and say 'Analyse my uploaded bank statement for tax'",
      "Get FBR/HMRC/IRS-specific tax breakdown in seconds",
    ],
    features: ["Any CSV or Excel format", "Auto-detects date/amount/description columns", "Instant transaction categorisation", "Tax implication analysis per jurisdiction"],
  },
  {
    id: "pdf_upload",
    name: "PDF Document Analysis",
    logo: "📄",
    description: "Upload any PDF — bank statements, invoices, payslips, P60s, FBR returns, ZATCA invoices. AI extracts structured data and analyses tax implications.",
    category: "Available Now",
    status: "live",
    connectUrl: "/client/upload",
    automationLevel: "full",
    howToUseNow: [
      "Go to Upload Files in the sidebar",
      "Upload any PDF (bank statement, invoice, payslip, tax return)",
      "AI uses Claude Vision to extract all financial data",
      "Ask the AI Assistant: 'What are the tax implications of this document?'",
      "Get a detailed breakdown with FBR/HMRC/IRS/ZATCA-specific advice",
    ],
    features: ["Bank statement PDFs", "Invoices and receipts", "Payslips and P60 / P11D", "FBR return PDFs", "Saudi ZATCA e-invoices (XML)", "US 1099 forms"],
  },
  {
    id: "ai_agentic",
    name: "AI Agentic Workflow",
    logo: "🤖",
    description: "The AI Assistant is already agentic — it auto-routes to the best specialist, remembers your jurisdiction and business type, and gives contextual follow-ups.",
    category: "Available Now",
    status: "live",
    connectUrl: "/client/assistant",
    automationLevel: "full",
    howToUseNow: [
      "Go to AI Assistant — it already knows your jurisdictions from your profile",
      "Switch agents: Tax Advisor, Document Analyzer, Compliance Monitor, Market Analyst",
      "Upload a file then ask: 'What should I declare in my FBR wealth statement?'",
      "Ask about deadlines: 'What compliance is due this quarter for Pakistan?'",
      "Get tax calculations with step-by-step working shown",
    ],
    features: ["Multi-agent routing (auto-selects best specialist)", "Jurisdiction-aware (knows your Pakistan/UK/UAE setup)", "Extended reasoning mode (toggle 'Reasoning')", "Document + chat combined analysis", "Chat history persists across sessions"],
  },
  // Automation / Webhooks
  {
    id: "zapier",
    name: "Zapier Automation",
    logo: "⚡",
    description: "Connect 6,000+ apps to Taxable AI. Auto-send invoices from Gmail, trigger tax analysis on new Xero transactions, or notify Slack when deadlines approach.",
    category: "Automation",
    status: "coming_soon",
    automationLevel: "full",
    helpText: "Webhook endpoint ready for custom integrations — Zapier native app launching soon.",
    features: ["Trigger: New invoice in Gmail → auto-analyse tax", "Trigger: Xero transaction → AI categorises for VAT", "Action: Send tax summary to WhatsApp via Twilio", "Action: Create FBR filing reminder in Google Calendar"],
  },
  {
    id: "make",
    name: "Make (Integromat)",
    logo: "🔄",
    description: "Build visual automation workflows. Connect your accounting software, bank feeds, and Taxable AI in drag-and-drop flows.",
    category: "Automation",
    status: "coming_soon",
    automationLevel: "full",
    features: ["Visual workflow builder", "Connect QuickBooks → AI tax analysis", "Auto-generate monthly tax reports", "Email + WhatsApp notifications"],
  },
  // Accounting
  {
    id: "xero",
    name: "Xero",
    logo: "🔵",
    description: "Direct OAuth connection. Pull invoices, expenses, bank feeds, and P&L automatically for continuous AI-powered tax monitoring.",
    category: "Accounting",
    status: "coming_soon",
    automationLevel: "full",
    howToUseNow: [
      "Export from Xero: Reports → Profit & Loss → Export as Excel/CSV",
      "Upload the export via Upload Files",
      "Ask AI: 'Analyse this P&L for UK corporation tax optimisation'",
    ],
    features: ["Real-time bank feed sync", "Auto-VAT return preparation", "Payroll tax calculations", "Management accounts to AI analysis"],
  },
  {
    id: "quickbooks",
    name: "QuickBooks Online",
    logo: "🟢",
    description: "OAuth integration for automatic transaction sync, invoice import, and payroll data for all jurisdictions.",
    category: "Accounting",
    status: "coming_soon",
    automationLevel: "full",
    howToUseNow: [
      "In QuickBooks: Reports → Profit & Loss → Export to Excel",
      "Or: Banking → Download transactions as CSV",
      "Upload to Taxable AI for instant FBR/IRS/HMRC analysis",
    ],
    features: ["Chart of accounts sync", "Invoice and expense import", "Payroll summary by jurisdiction", "Tax summary export"],
  },
  {
    id: "sage",
    name: "Sage Business Cloud",
    logo: "🟠",
    description: "UK-focused accounting integration — ideal for HMRC MTD and VAT return preparation.",
    category: "Accounting",
    status: "coming_soon",
    automationLevel: "partial",
    features: ["MTD-compatible VAT data", "Payroll PAYE/NIC import", "Management reports", "Financial statements sync"],
  },
  // Banking
  {
    id: "open_banking_uk",
    name: "UK Open Banking (PSD2)",
    logo: "🏦",
    description: "Direct bank connection via Open Banking API — Barclays, HSBC, Lloyds, NatWest, Monzo, Starling, and 40+ UK banks.",
    category: "Banking",
    status: "coming_soon",
    automationLevel: "full",
    howToUseNow: [
      "Download your bank statement as PDF or CSV from online banking",
      "Upload to Taxable AI for immediate analysis",
      "Most UK banks offer CSV export under 'Transaction History'",
    ],
    features: ["40+ UK banks", "Real-time transaction feed", "Auto-categorisation for VAT", "Annual transaction summary for HMRC"],
  },
  {
    id: "plaid",
    name: "Plaid (USA / Canada)",
    logo: "🇺🇸",
    description: "Connect 5,000+ US and Canadian banks via Plaid for automatic IRS transaction analysis.",
    category: "Banking",
    status: "coming_soon",
    automationLevel: "full",
    features: ["Bank of America, Chase, Wells Fargo, 5,000+ more", "Transaction history import", "Income verification", "Investment account sync"],
  },
  // Tax Portals
  {
    id: "hmrc_mtd",
    name: "HMRC Making Tax Digital",
    logo: "🇬🇧",
    description: "MTD-compatible VAT and Income Tax submissions directly through the HMRC API. Required from April 2026 for income > £50,000.",
    category: "Tax Portals",
    status: "coming_soon",
    automationLevel: "full",
    helpText: "In the meantime: upload your HMRC portal exports (PDF/CSV) for AI analysis — works now.",
    howToUseNow: [
      "Log into Government Gateway → Self Assessment → View Tax Return",
      "Download as PDF and upload here for AI analysis",
      "Or copy-paste figures into the AI Assistant for instant advice",
    ],
    features: ["Direct VAT return submission", "MTD ITSA quarterly updates (2026+)", "View obligations and deadlines", "PAYE RTI integration"],
  },
  {
    id: "fbr_iris",
    name: "FBR IRIS (Pakistan)",
    logo: "🇵🇰",
    description: "FBR IRIS doesn't have a public API, but you can upload any FBR PDF for instant AI analysis — returns, WHT statements, wealth statements, and more.",
    category: "Tax Portals",
    status: "manual",
    automationLevel: "manual",
    helpText: "FBR IRIS has no public API. Use PDF upload for analysis — works immediately.",
    howToUseNow: [
      "Log into IRIS at iris.fbr.gov.pk",
      "Download your Income Tax Return as PDF",
      "Upload the PDF here — AI extracts all figures automatically",
      "Ask: 'Reconcile my wealth statement' or 'Check my WHT calculations'",
      "For ATL status: visit atl.fbr.gov.pk and paste the result into AI chat",
    ],
    features: ["FBR return PDF analysis", "Wealth statement reconciliation (Section 116)", "WHT statement review", "Section 7E deemed income calculation", "Super tax calculation", "ATL status check guidance"],
  },
  {
    id: "zatca_saudi",
    name: "ZATCA (Saudi Arabia)",
    logo: "🇸🇦",
    description: "Upload ZATCA VAT returns, Zakat filings, and Fatoora e-invoices for AI analysis and compliance checking.",
    category: "Tax Portals",
    status: "manual",
    automationLevel: "manual",
    howToUseNow: [
      "Download VAT return PDF from zatca.gov.sa",
      "Upload here for AI review and error checking",
      "For Fatoora e-invoices: upload XML or PDF for analysis",
      "Ask: 'Check my Zakat base calculation' or 'Review my VAT return'",
    ],
    features: ["VAT return PDF review", "Zakat base calculation check", "WHT on non-residents analysis", "RETT (property) calculation", "E-invoice (Fatoora) validation"],
  },
  // Developer
  {
    id: "api_key",
    name: "REST API & Webhooks",
    logo: "⚡",
    description: "Push financial data programmatically from your ERP, custom app, or automation platform (Zapier, Make, n8n) into your Taxable AI workspace.",
    category: "Developer",
    status: "coming_soon",
    automationLevel: "full",
    features: ["REST API for transaction ingestion", "Webhook receiver for real-time events", "API key authentication", "JSON response with tax analysis", "n8n and Zapier compatible"],
  },
];

const categories = ["All", "Available Now", "Automation", "Accounting", "Banking", "Tax Portals", "Developer"];

const automationBadge: Record<string, { label: string; cls: string }> = {
  full: { label: "Full Automation", cls: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  partial: { label: "Partial", cls: "text-amber-600 bg-amber-50 border-amber-200" },
  manual: { label: "Manual + AI", cls: "text-blue-600 bg-blue-50 border-blue-200" },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function StatusBadge({ status }: { status: ConnectionStatus }) {
  if (status === "live") return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
      <CheckCircle2 className="h-3 w-3" /> Live
    </span>
  );
  if (status === "manual") return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
      <Upload className="h-3 w-3" /> Upload-based
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
      <Circle className="h-3 w-3" /> Coming Soon
    </span>
  );
}

function IntegrationCard({ integration }: { integration: Integration }) {
  const [expanded, setExpanded] = useState(false);
  const ab = automationBadge[integration.automationLevel];

  return (
    <div className={`bg-slate-800/40 border rounded-xl overflow-hidden transition-all ${
      integration.status === "live" ? "border-emerald-500/20 hover:border-emerald-500/40" : "border-slate-700/50 hover:border-slate-600"
    }`}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl leading-none select-none">{integration.logo}</div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-white">{integration.name}</h3>
                <StatusBadge status={integration.status} />
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${ab.cls}`}>{ab.label}</span>
              </div>
            </div>
          </div>

          {integration.status === "live" && integration.connectUrl && (
            <a href={integration.connectUrl}
              className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-3 py-1.5 rounded-lg transition-all flex-shrink-0">
              <ArrowRight className="h-3 w-3" /> Open
            </a>
          )}
          {integration.status === "manual" && integration.connectUrl && (
            <a href={integration.connectUrl}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg transition-all flex-shrink-0">
              <Upload className="h-3 w-3" /> Upload
            </a>
          )}
        </div>

        <p className="text-sm text-slate-400 leading-relaxed">{integration.description}</p>

        {integration.helpText && (
          <div className="mt-3 flex items-start gap-2 text-xs text-amber-400 bg-amber-500/5 border border-amber-500/10 rounded-lg p-2.5">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
            <span>{integration.helpText}</span>
          </div>
        )}

        <button onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors">
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {expanded ? "Hide" : "Show"} details
        </button>
      </div>

      {expanded && (
        <div className="px-5 pb-5 pt-0 space-y-4">
          {integration.howToUseNow && (
            <div className="border-t border-slate-700/50 pt-3">
              <p className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1">
                <Zap className="h-3 w-3" /> How to use RIGHT NOW:
              </p>
              <ol className="space-y-1.5">
                {integration.howToUseNow.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-full bg-slate-700 text-[9px] font-bold text-slate-400 mt-0.5">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
          <div className={integration.howToUseNow ? "" : "border-t border-slate-700/50 pt-3"}>
            <p className="text-xs font-medium text-slate-400 mb-2">Capabilities:</p>
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

  const liveCount = integrations.filter((i) => i.status === "live" || i.status === "manual").length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Integrations & Automation</h1>
        <p className="text-slate-400 mt-1">
          Connect your financial data to unlock AI-powered agentic tax analysis and compliance monitoring.
        </p>
      </div>

      {/* What works RIGHT NOW callout */}
      <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Bot className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-emerald-300 mb-2">Working right now — no setup needed</p>
            <div className="grid sm:grid-cols-3 gap-3">
              <a href="/client/upload" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-lg p-3 transition-colors border border-white/5">
                <FileSpreadsheet className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Upload CSV / Excel</p>
                  <p className="text-[10px] text-slate-400">Any bank export format</p>
                </div>
              </a>
              <a href="/client/upload" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-lg p-3 transition-colors border border-white/5">
                <FileText className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Upload PDF</p>
                  <p className="text-[10px] text-slate-400">Bank statements, FBR returns, payslips</p>
                </div>
              </a>
              <a href="/client/assistant" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-lg p-3 transition-colors border border-white/5">
                <Bot className="h-4 w-4 text-violet-400 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">AI Tax Assistant</p>
                  <p className="text-[10px] text-slate-400">FBR, HMRC, IRS, ZATCA expert</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{liveCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Live / Available</p>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{integrations.length - liveCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Coming Soon</p>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{integrations.length}</p>
          <p className="text-xs text-slate-400 mt-0.5">Total Planned</p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
              activeCategory === cat
                ? "bg-blue-600/20 text-blue-300 border-blue-600/40"
                : "text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200 bg-slate-800/30"
            }`}>
            {cat}
            {cat !== "All" && (
              <span className="ml-1.5 text-slate-500">
                ({integrations.filter((i) => i.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>

      {/* API section */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Key className="h-4 w-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-white">REST API — Agentic Automation</h3>
          <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">Coming Soon</span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Trigger AI tax analysis programmatically. Push transaction data from your ERP, receive categorised analysis via webhook, and automate compliance monitoring.
        </p>
        <div className="bg-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500"># Agentic: push transactions, get AI tax analysis</span>
            <CopyButton text={`POST https://taxablewebsite.vercel.app/api/v1/analyse
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "jurisdiction": "pakistan",
  "transactions": [
    { "date": "2025-06-01", "amount": 500000, "description": "Client invoice", "type": "income" },
    { "date": "2025-06-03", "amount": -45000, "description": "Office rent", "type": "expense" }
  ],
  "analysis_type": "fbr_compliance"
}`} />
          </div>
          <span className="text-blue-400">POST</span> /api/v1/analyse{"\n"}
          <span className="text-slate-500">Authorization:</span> Bearer YOUR_KEY{"\n\n"}
          {`{
  "jurisdiction": "pakistan",
  "transactions": [
    { "date": "2025-06-01", "amount": 500000,
      "description": "Client invoice", "type": "income" }
  ],
  "analysis_type": "fbr_compliance"
}`}
        </div>
        <p className="text-[10px] text-slate-500 mt-2">Response includes WHT obligations, advance tax calculations, and filing recommendations.</p>
      </div>

      {/* Request integration */}
      <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-6 text-center">
        <Building2 className="h-7 w-7 text-slate-500 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-white mb-1">Need a specific integration?</h3>
        <p className="text-xs text-slate-400 mb-4">
          Tell us what accounting software, bank, or ERP system you use — we prioritise based on demand from Pakistani, UK, Saudi, and UAE CA firms.
        </p>
        <a href="/client/messages"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-4 py-2 rounded-lg transition-all">
          <Link2 className="h-4 w-4" />
          Request an integration
        </a>
      </div>
    </div>
  );
}
