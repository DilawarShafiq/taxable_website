import Link from "next/link";

export default function AssetsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-lg">
            Taxable<span className="text-indigo-400"> AI</span>
            <span className="text-gray-500 text-sm font-normal ml-2">Asset Dashboard</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition">
              Talk to our advisors →
            </Link>
            <Link href="/auth/login"
              className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-500 transition">
              Client Portal
            </Link>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
