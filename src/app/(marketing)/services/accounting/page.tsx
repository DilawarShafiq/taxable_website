import { Metadata } from "next";
import Link from "next/link";
import { FileText, Check, ArrowRight, Bot, BarChart3, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Accounting Services",
  description: "AI-powered accounting solutions including bookkeeping, financial reporting, and payroll management.",
};

const services = [
  "Bookkeeping & Recording",
  "Financial Reporting",
  "Payroll Management",
  "AI-Powered Analysis",
  "Cash Flow Management",
  "Budgeting & Forecasting",
  "Accounts Payable/Receivable",
  "Bank Reconciliation",
];

export default function AccountingPage() {
  return (
    <>
      <section className="py-20 bg-gradient-to-b from-purple-500/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection className="text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500 mx-auto mb-8">
                <FileText className="h-10 w-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Accounting Services</h1>
              <p className="text-xl text-muted-foreground mb-8">
                End-to-end accounting solutions powered by AI for accuracy, efficiency,
                and real-time financial insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="xl">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button size="xl" variant="outline">
                    Try AI Demo
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Full-Service Accounting</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {services.map((service, index) => (
              <AnimatedSection key={service} delay={index * 0.05}>
                <div className="flex items-center p-4 rounded-lg border bg-card">
                  <Check className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                  <span className="text-sm">{service}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center p-6">
                <Bot className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">AI-Powered</h3>
                <p className="text-muted-foreground">
                  Automated processing with AI accuracy
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="text-center p-6">
                <BarChart3 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Real-Time Insights</h3>
                <p className="text-muted-foreground">
                  Live dashboards and financial analytics
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="text-center p-6">
                <Clock className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Time Savings</h3>
                <p className="text-muted-foreground">
                  Automate 80% of manual accounting tasks
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <CTASection variant="demo" />
    </>
  );
}
