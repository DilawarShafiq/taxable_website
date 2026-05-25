"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, FolderKanban, FileText,
  UserCog, Receipt, LogOut, Menu, X, BarChart3, Wrench
} from "lucide-react";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["staff", "admin", "ceo"] },
  { href: "/admin/clients", label: "Clients", icon: Users, roles: ["staff", "admin", "ceo"] },
  { href: "/admin/cases", label: "Cases", icon: FolderKanban, roles: ["staff", "admin", "ceo"] },
  { href: "/admin/documents", label: "Documents", icon: FileText, roles: ["staff", "admin", "ceo"] },
  { href: "/admin/billing", label: "Billing", icon: Receipt, roles: ["admin", "ceo"] },
  { href: "/admin/staff", label: "Staff", icon: UserCog, roles: ["admin", "ceo"] },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, roles: ["admin", "ceo"] },
  { href: "/admin/setup", label: "Setup / Config", icon: Wrench, roles: ["admin", "ceo"] },
];

interface AdminSidebarProps {
  user: { email: string; fullName: string; role: string };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/auth/login");
    router.refresh();
  };

  const visibleItems = navItems.filter((item) => item.roles.includes(user.role));

  const roleLabels: Record<string, string> = {
    staff: "Staff",
    admin: "Administrator",
    ceo: "CEO",
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-100">
        <span className="text-xl font-bold text-gray-900">Taxable<span className="text-indigo-600"> AI</span></span>
        <p className="text-xs text-indigo-500 mt-0.5 font-medium">{roleLabels[user.role] ?? "Internal"} Portal</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {visibleItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}>
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100">
        <div className="px-3 py-2 mb-1">
          <p className="text-sm font-medium text-gray-800 truncate">{user.fullName}</p>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 w-full transition-colors">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-200 flex-shrink-0">
        <SidebarContent />
      </aside>
      <button className="lg:hidden fixed top-4 left-4 z-50 bg-white border border-gray-200 rounded-lg p-2 shadow-sm"
        onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 shadow-xl lg:hidden">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
