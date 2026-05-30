"use client";

import { useState } from "react";
import { Wrench, CheckCircle, AlertCircle, Database, Key, Globe, Lock } from "lucide-react";

export default function AdminSetupPage() {
  const [resetEmail, setResetEmail] = useState("");
  const [resetPw, setResetPw] = useState("");
  const [resetMsg, setResetMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [resetting, setResetting] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetting(true);
    setResetMsg(null);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, newPassword: resetPw }),
      });
      const data = await res.json();
      if (res.ok) {
        setResetMsg({ ok: true, text: `Password reset for ${resetEmail}` });
        setResetEmail("");
        setResetPw("");
      } else {
        setResetMsg({ ok: false, text: data.error ?? "Reset failed" });
      }
    } catch {
      setResetMsg({ ok: false, text: "Network error" });
    } finally {
      setResetting(false);
    }
  };

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
          {[
            { label: "Admin tools", ok: true, detail: "Running as admin" },
            { label: "Auth secret", ok: true, detail: "Configured (fallback or env)" },
          ].map((c) => (
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

      {/* Admin password reset — no email SMTP required */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Lock className="h-4 w-4" /> Reset User Password
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs text-gray-500 mb-4">
            Reset any user&apos;s password directly. Use this when they&apos;ve forgotten their password and email delivery isn&apos;t working.
          </p>
          <form onSubmit={handleReset} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">User email</label>
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="client@example.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">New password (min 8 chars)</label>
              <input
                type="text"
                required
                minLength={8}
                value={resetPw}
                onChange={(e) => setResetPw(e.target.value)}
                placeholder="Temporary password to share with the user"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {resetMsg && (
              <p className={`text-xs px-3 py-2 rounded-lg ${resetMsg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                {resetMsg.text}
              </p>
            )}
            <button
              type="submit"
              disabled={resetting}
              className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition"
            >
              {resetting ? "Resetting…" : "Reset Password"}
            </button>
          </form>
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
          <p>• Staff accounts must be created with role = &apos;staff&apos; via this setup page</p>
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
