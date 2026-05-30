import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { Wrench, CheckCircle, AlertCircle, Database, Key, Globe } from "lucide-react";

export default async function AdminSetupPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");
  if (!["admin", "ceo"].includes(session.role)) redirect("/admin/dashboard");

  const checks = [
    { label: "Database connection", ok: !!process.env.DATABASE_URL, detail: process.env.DATABASE_URL ? "Connected" : "DATABASE_URL not set" },
    { label: "Anthropic AI (Claude)", ok: !!process.env.ANTHROPIC_API_KEY, detail: process.env.ANTHROPIC_API_KEY ? "API key configured" : "ANTHROPIC_API_KEY not set — AI features disabled" },
    { label: "Auth secret", ok: !!process.env.AUTH_SECRET, detail: process.env.AUTH_SECRET ? "Configured" : "AUTH_SECRET not set" },
    { label: "Auth URL", ok: !!process.env.AUTH_URL, detail: process.env.AUTH_URL ?? "Not set" },
    { label: "Admin email", ok: !!process.env.ADMIN_EMAIL, detail: process.env.ADMIN_EMAIL ?? "Not set" },
  ];

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Setup</h1>
        <p className="text-gray-500 text-sm mt-1">Platform configuration and health checks</p>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Database className="h-4 w-4" /> Environment Checks
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {checks.map((c) => (
            <div key={c.label} className="flex items-center gap-3 px-4 py-3">
              {c.ok
                ? <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                : <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{c.label}</p>
                <p className={`text-xs mt-0.5 ${c.ok ? "text-gray-400" : "text-red-500"}`}>{c.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Globe className="h-4 w-4" /> Supported Regions
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            {["🇵🇰 Pakistan (FBR)", "🇬🇧 United Kingdom (HMRC)", "🇺🇸 United States (IRS)", "🇸🇦 Saudi Arabia (ZATCA)", "🇦🇪 UAE (FTA)"].map((r) => (
              <div key={r} className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                {r}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Key className="h-4 w-4" /> Access Control
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-600 space-y-2">
          <p>• Public registration creates <strong>client</strong> accounts only</p>
          <p>• Admin access is restricted to the configured ADMIN_EMAIL</p>
          <p>• Staff accounts must be created directly in the database with role = &apos;staff&apos;</p>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Wrench className="h-4 w-4" /> File Processing
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            {["PDF (bank statements, invoices)", "Excel (.xlsx, .xls)", "CSV / Plain text", "Images (JPG, PNG, WebP)"].map((f) => (
              <div key={f} className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
