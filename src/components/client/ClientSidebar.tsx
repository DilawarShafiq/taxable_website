"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Receipt, LogOut, Menu, X, Bot, TrendingUp,
  FolderKanban, FileText, MessageSquare, CalendarDays, Upload, Plug,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";

const navSections = [
  {
    label: "Overview",
    items: [
      { href: "/client/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { href: "/client/assistant", label: "AI Assistant", icon: Bot, badge: "Pro" },
      { href: "/client/assets", label: "Investments", icon: TrendingUp },
    ],
  },
  {
    label: "Work",
    items: [
      { href: "/client/cases", label: "My Cases", icon: FolderKanban },
      { href: "/client/documents", label: "Documents", icon: FileText },
      { href: "/client/upload", label: "Upload Files", icon: Upload },
      { href: "/client/messages", label: "Messages", icon: MessageSquare },
      { href: "/client/appointments", label: "Appointments", icon: CalendarDays },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/client/integrations", label: "Integrations", icon: Plug },
      { href: "/client/billing", label: "Billing", icon: Receipt },
    ],
  },
];

interface ClientSidebarProps {
  user: { email: string; fullName: string };
}

function NavContent({
  user,
  onClose,
}: {
  user: ClientSidebarProps["user"];
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 border-r border-slate-800/60">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-800/60">
        <Link href="/" className="block group">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 shadow-sm">
              <span className="text-white text-xs font-bold">T</span>
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              Taxable<span className="text-blue-400"> AI</span>
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase mt-1.5 block">
            Client Portal
          </span>
        </Link>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-2 mb-1.5 text-[9px] font-semibold tracking-widest text-slate-600 uppercase">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? "bg-blue-600/15 text-blue-300 border border-blue-600/25 shadow-sm"
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <item.icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-blue-400" : "group-hover:text-slate-300"}`} />
                      {item.label}
                    </span>
                    <span className="flex items-center gap-1">
                      {"badge" in item && item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-600/20">
                          {item.badge}
                        </span>
                      )}
                      {active && <ChevronRight className="h-3 w-3 text-blue-400" />}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 pt-3 border-t border-slate-800/60">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg bg-slate-800/30">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white flex-shrink-0 shadow-sm">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-100 truncate">{user.fullName}</p>
            <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-500 hover:bg-slate-800/50 hover:text-slate-300 w-full transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function ClientSidebar({ user }: ClientSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0">
        <NavContent user={user} />
      </aside>

      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-slate-900 border border-slate-700 rounded-lg p-2 shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-64 z-50 shadow-2xl lg:hidden">
            <NavContent user={user} onClose={() => setMobileOpen(false)} />
          </aside>
        </>
      )}
    </>
  );
}
