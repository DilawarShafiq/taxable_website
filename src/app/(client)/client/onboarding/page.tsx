"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import { JURISDICTION_OPTIONS } from "@/lib/constants";

const BUSINESS_TYPES = [
  { value: "individual", label: "Individual" },
  { value: "sole_trader", label: "Sole Trader" },
  { value: "partnership", label: "Partnership" },
  { value: "limited_company", label: "Limited Company" },
  { value: "llc", label: "LLC" },
  { value: "corporation", label: "Corporation" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    companyName: "",
    businessType: "",
    jurisdictions: [] as string[],
    phone: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleJurisdiction = (value: string) => {
    setForm((prev) => ({
      ...prev,
      jurisdictions: prev.jurisdictions.includes(value)
        ? prev.jurisdictions.filter((j) => j !== value)
        : [...prev.jurisdictions, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.businessType) { setError("Please select your business type"); return; }
    if (!form.jurisdictions.length) { setError("Please select at least one jurisdiction"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/client/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to save profile"); setLoading(false); return; }
      router.push("/client/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Complete your profile</h1>
            <p className="text-gray-500 text-sm mt-1">
              Tell us about your business so we can set up your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company / Trading name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company / Trading name <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                placeholder="e.g. Acme Ltd"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+44 7700 000000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Business type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business type <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {BUSINESS_TYPES.map((bt) => (
                  <button
                    key={bt.value}
                    type="button"
                    onClick={() => setForm({ ...form, businessType: bt.value })}
                    className={`border rounded-lg px-3 py-2.5 text-sm font-medium transition text-left ${
                      form.businessType === bt.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {bt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Jurisdictions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Which countries do you need help with? <span className="text-red-400">*</span>
              </label>
              <div className="space-y-2">
                {JURISDICTION_OPTIONS.map((j) => {
                  const selected = form.jurisdictions.includes(j.value);
                  return (
                    <button
                      key={j.value}
                      type="button"
                      onClick={() => toggleJurisdiction(j.value)}
                      className={`w-full flex items-center justify-between border rounded-lg px-4 py-3 text-sm transition ${
                        selected
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <span>
                        {j.label}{" "}
                        <span className="text-xs opacity-60">{j.sub}</span>
                      </span>
                      {selected && <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-lg py-3 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </span>
              ) : (
                "Complete Setup"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
