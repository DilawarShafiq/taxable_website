"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, FolderKanban, FileText,
  UserCog, Receipt, LogOut, Menu, X, BarChart3, Wrench,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["staff", "admin", "ceo"] },
  { href: "/admin/clients", label: "Clients", icon: Users, roles: ["staff", "admin", "ceo"] },
  { href: "/admin/cases", label: "Cases", icon: FolderKanban, roles: ["staff", "admin", "ceo"] },
  { href: "/admin/documents", label: "Documents", icon: FileText, roles: ["staff", "admin", "ceo"] },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare, roles: ["staff", "admin", "ceo"] },
  { href: "/admin/billing", label: "Billing", icon: Receipt, roles: ["admin", "ceo"] },
  { href: "/admin/staff", label: "Staff", icon: UserCog, roles: ["admin", "ceo"] },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, roles: ["admin", "ceo"] },
  { href: "/admin/setup", label: "Setup", icon: Wrench, roles: ["admin", "ceo"] },
];

const roleLabels: Record<string, string> = {
  staff: "Staff",
  admin: "Administrator",
  ceo: "CEO",
};

const roleBadgeColors: Record<string, string> = {
  staff: "text-emerald-400",
  admin: "text-violet-400",
  ceo: "text-amber-400",
};

interface AdminSidebarProps {
  user: { email: string; fullName: string; role: string };
}

function NavContent({
  user,
  onClose,
}: {
  user: AdminSidebarProps["user"];
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const visibleItems = navItems.filter((item) => item.roles.includes(user.role));
  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-800">
        <Link href="/" className="block">
          <span className="text-lg font-bold tracking-tight">
            Taxable<span className="text-violet-400"> AI</span>
          </span>
        </Link>
        <span className={`text-[11px] font-semibold tracking-wider uppercase mt-0.5 block ${roleBadgeColors[user.role] ?? "text-slate-500"}`}>
          {roleLabels[user.role] ?? "Internal"} Portal
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {visibleItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-violet-600/20 text-violet-300 border border-violet-600/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`}
            >
              <item.icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-violet-400" : ""}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 pt-3 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-1 rounded-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-100 truncate">{user.fullName}</p>
            <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-800 hover:text-slate-200 w-full transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar({ user }: AdminSidebarProps) {
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
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
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
