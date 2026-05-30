"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/client/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signIn.email({ email, password, fetchOptions: { throw: false } });
      if ((result as any)?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }
      // Fetch session to determine role
      const res = await fetch("/api/auth/get-session");
      const session = await res.json();
      const role = session?.user?.role ?? "client";
      if (["staff", "admin", "ceo"].includes(role)) {
        router.push("/admin/dashboard");
      } else {
        router.push(redirectTo.startsWith("/client") ? redirectTo : "/client/dashboard");
      }
      router.refresh();
    } catch {
      setError("Sign-in failed");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <div className="text-center mb-8">
        <div className="text-3xl font-bold mb-1">
          Taxable<span className="text-blue-600"> AI</span>
        </div>
        <p className="text-gray-500 text-sm">Sign in to your portal</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="mt-6 text-center space-y-3">
        <p className="text-xs text-gray-400">Google / Microsoft / GitHub login coming soon</p>
        <div className="text-sm text-gray-500 space-x-3">
          <Link href="/auth/reset-password" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
          {!redirectTo.startsWith("/admin") && (
            <>
              <span>·</span>
              <Link href="/auth/register" className="text-blue-600 hover:underline">
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-md">
        <Suspense
          fallback={
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center text-gray-400 text-sm">
              Loading…
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
