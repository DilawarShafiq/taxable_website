"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "@/lib/auth-client";

const navigation = [
  {
    name: "Services",
    href: "/services",
    children: [
      { name: "Taxation", href: "/services/taxation" },
      { name: "Audits", href: "/services/audits" },
      { name: "Accounting", href: "/services/accounting" },
    ],
  },
  { name: "AI Agents", href: "/ai-agents" },
  {
    name: "Regions",
    href: "/regions",
    children: [
      { name: "Pakistan", href: "/regions/pakistan" },
      { name: "United Kingdom", href: "/regions/uk" },
      { name: "United States", href: "/regions/usa" },
      { name: "Saudi Arabia", href: "/regions/saudi-arabia" },
      { name: "UAE", href: "/regions/uae" },
    ],
  },
  { name: "Pricing", href: "/pricing" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  if (!session?.user) {
    return (
      <>
        <Link
          href="/auth/login"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign In
        </Link>
        <Link href="/auth/register">
          <Button size="lg">Get Started</Button>
        </Link>
      </>
    );
  }

  const isAdmin = ["admin", "staff", "ceo"].includes(((session.user as any).role as string | undefined) ?? "");
  const dashboardHref = isAdmin ? "/admin/dashboard" : "/client/dashboard";
  const name = session.user.name ?? session.user.email ?? "Account";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
          {name[0].toUpperCase()}
        </div>
        <span className="max-w-[120px] truncate">{name}</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-lg border bg-popover shadow-lg p-1 z-50">
          <div className="px-3 py-2 text-xs text-muted-foreground border-b mb-1">
            {session.user.email}
            <span className="ml-1 rounded bg-muted px-1 py-0.5 font-medium capitalize">
              {((session.user as any).role as string | undefined)}
            </span>
          </div>
          <Link
            href={dashboardHref}
            className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent transition-colors"
            onClick={() => setOpen(false)}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href={isAdmin ? "/admin/clients" : "/client/cases"}
            className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent transition-colors"
            onClick={() => setOpen(false)}
          >
            <User className="h-4 w-4" />
            {isAdmin ? "Clients" : "My Cases"}
          </Link>
          <div className="border-t mt-1 pt-1">
            <button
              onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } })}
              className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl">
            T
          </div>
          <span className="text-xl font-bold">Taxable AI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-1">
          {navigation.map((item) => (
            <div key={item.name} className="relative group">
              {item.children ? (
                <button
                  className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onMouseEnter={() => setOpenDropdown(item.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {item.name}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              )}
              {item.children && (
                <div
                  className={cn(
                    "absolute left-0 top-full mt-1 w-48 rounded-md border bg-popover p-1 shadow-lg transition-all",
                    openDropdown === item.name
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  )}
                  onMouseEnter={() => setOpenDropdown(item.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className="block rounded-sm px-3 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA / User Menu */}
        <div className="hidden md:flex md:items-center md:space-x-3">
          <UserMenu />
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="block py-2 text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
                {item.children && (
                  <div className="ml-4 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block py-1 text-sm text-muted-foreground"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 space-y-2 border-t">
              {session?.user ? (
                <>
                  <Link
                    href={["admin", "staff", "ceo"].includes(((session.user as any).role as string | undefined) ?? "") ? "/admin/dashboard" : "/client/dashboard"}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full" size="lg">
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full text-red-600"
                    size="lg"
                    onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } })}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full" size="lg">Sign In</Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full" size="lg">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
