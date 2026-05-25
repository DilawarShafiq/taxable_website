import Link from "next/link";
import { Mail, Phone, MapPin, Linkedin, Twitter } from "lucide-react";

const footerLinks = {
  services: [
    { name: "Taxation", href: "/services/taxation" },
    { name: "Audits", href: "/services/audits" },
    { name: "Accounting", href: "/services/accounting" },
    { name: "AI Agents", href: "/ai-agents" },
  ],
  regions: [
    { name: "Pakistan", href: "/regions/pakistan" },
    { name: "United Kingdom", href: "/regions/uk" },
    { name: "United States", href: "/regions/usa" },
    { name: "Saudi Arabia", href: "/regions/saudi-arabia" },
    { name: "UAE", href: "/regions/uae" },
  ],
  portals: [
    { name: "Client Sign In", href: "/auth/login" },
    { name: "Client Dashboard", href: "/client/dashboard" },
    { name: "Admin Portal", href: "/admin/dashboard" },
    { name: "Register", href: "/auth/register" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

const offices = [
  { region: "Pakistan", email: "pakistan@taxable.ai", phone: "+92 300 1234567" },
  { region: "UK", email: "uk@taxable.ai", phone: "+44 20 1234 5678" },
  { region: "USA", email: "usa@taxable.ai", phone: "+1 555 123 4567" },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl">
                T
              </div>
              <span className="text-xl font-bold">Taxable AI</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">
              AI-powered chartered accountancy services across Pakistan, UK, USA,
              Saudi Arabia, and UAE. Professional taxation, audits, and accounting
              solutions with cutting-edge AI technology.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Portals */}
          <div>
            <h3 className="font-semibold mb-4">Portals</h3>
            <ul className="space-y-2">
              {footerLinks.portals.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Regions */}
          <div>
            <h3 className="font-semibold mb-4">Regions</h3>
            <ul className="space-y-2">
              {footerLinks.regions.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t">
          <div className="grid gap-4 md:grid-cols-3">
            {offices.map((office) => (
              <div key={office.region} className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{office.region}</p>
                  <p className="text-sm text-muted-foreground">{office.email}</p>
                  <p className="text-sm text-muted-foreground">{office.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Taxable AI. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="mr-2">🔒</span>
              Bank-level encryption
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="mr-2">✓</span>
              GDPR Compliant
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
