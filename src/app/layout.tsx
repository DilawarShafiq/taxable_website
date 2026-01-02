import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Taxable AI - AI-Powered Chartered Accountancy Services",
    template: "%s | Taxable AI",
  },
  description:
    "Transform your finances with AI-powered chartered accountancy. Expert taxation, audits, and accounting services across Pakistan, UK, USA, Saudi Arabia, and UAE.",
  keywords: [
    "chartered accountant",
    "tax services",
    "AI accounting",
    "audit services",
    "Pakistan tax",
    "UK tax",
    "USA tax",
    "Saudi Arabia tax",
    "UAE tax",
    "FBR compliance",
    "HMRC compliance",
    "IRS compliance",
    "ZATCA compliance",
    "bookkeeping",
    "AI agents",
  ],
  authors: [{ name: "Taxable AI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://taxable.ai",
    siteName: "Taxable AI",
    title: "Taxable AI - AI-Powered Chartered Accountancy Services",
    description:
      "Transform your finances with AI-powered chartered accountancy. Expert taxation, audits, and accounting services.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taxable AI - AI-Powered Chartered Accountancy Services",
    description:
      "Transform your finances with AI-powered chartered accountancy. Expert taxation, audits, and accounting services.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
