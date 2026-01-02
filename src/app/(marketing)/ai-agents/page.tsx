import { Metadata } from "next";
import Link from "next/link";
import { Bot, Calculator, Table, FileUp, MessageSquare, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "AI Agents",
  description: "Discover our specialized AI agents for taxation, spreadsheet processing, document analysis, and bookkeeping automation.",
};

const agents = [
  {
    icon: Calculator,
    name: "Tax Agent",
    tagline: "Intelligent Tax Calculations",
    description: "Our AI Tax Agent analyzes your financial data, calculates tax obligations across jurisdictions, identifies deductions, and suggests optimization strategies.",
    capabilities: [
      "Multi-jurisdiction tax calculations",
      "Deduction identification",
      "Tax optimization suggestions",
      "Compliance checking",
      "Deadline reminders",
    ],
    useCases: [
      "Calculate quarterly estimated taxes",
      "Compare tax scenarios",
      "Identify missed deductions",
    ],
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    badge: "Most Popular",
  },
  {
    icon: Table,
    name: "Spreadsheet Agent",
    tagline: "Automated Data Processing",
    description: "Upload any spreadsheet and watch our AI organize, analyze, and extract insights. Perfect for financial statements, expense reports, and data reconciliation.",
    capabilities: [
      "Automatic data cleaning",
      "Formula suggestions",
      "Pattern recognition",
      "Data validation",
      "Report generation",
    ],
    useCases: [
      "Clean messy financial data",
      "Generate summary reports",
      "Reconcile multiple sources",
    ],
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    badge: null,
  },
  {
    icon: FileUp,
    name: "Document Agent",
    tagline: "Smart Document Analysis",
    description: "Extract and categorize data from bank statements, invoices, and receipts. Our AI reads, understands, and organizes your financial documents automatically.",
    capabilities: [
      "PDF data extraction",
      "Transaction categorization",
      "Invoice processing",
      "Receipt scanning",
      "Summary generation",
    ],
    useCases: [
      "Process bank statements",
      "Categorize expenses",
      "Digitize paper records",
    ],
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    badge: "Try Demo",
  },
  {
    icon: Bot,
    name: "Bookkeeping Agent",
    tagline: "24/7 Automated Bookkeeping",
    description: "An AI that learns your business patterns and maintains your books around the clock. Automatic categorization, reconciliation, and financial tracking.",
    capabilities: [
      "Automatic categorization",
      "Bank reconciliation",
      "Cash flow tracking",
      "Expense monitoring",
      "Report scheduling",
    ],
    useCases: [
      "Daily transaction recording",
      "Monthly reconciliation",
      "Real-time cash position",
    ],
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    badge: null,
  },
  {
    icon: MessageSquare,
    name: "Chat Agent",
    tagline: "Instant Tax & Accounting Answers",
    description: "Have questions about tax rules, accounting practices, or your finances? Our AI chatbot provides instant, accurate answers 24/7.",
    capabilities: [
      "Tax regulation queries",
      "Accounting guidance",
      "Deadline information",
      "Process explanations",
      "Lead capture",
    ],
    useCases: [
      "Get quick tax answers",
      "Understand regulations",
      "Learn accounting concepts",
    ],
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    badge: "Live Now",
  },
  {
    icon: BarChart3,
    name: "Analytics Agent",
    tagline: "Actionable Financial Insights",
    description: "Transform raw financial data into actionable insights. Get AI-powered analysis of trends, anomalies, and opportunities in your financial data.",
    capabilities: [
      "Trend analysis",
      "Anomaly detection",
      "Predictive insights",
      "Benchmark comparison",
      "Custom dashboards",
    ],
    useCases: [
      "Identify spending trends",
      "Forecast cash flow",
      "Spot irregularities",
    ],
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    badge: null,
  },
];

export default function AIAgentsPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">Powered by Advanced AI</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Meet Our AI Agents
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Specialized AI agents designed to handle your taxation, accounting, and financial tasks
              with unprecedented accuracy and efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <Button size="xl">
                  Try Document Agent Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="xl" variant="outline">
                  Get Full Access
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((agent, index) => (
              <AnimatedSection key={agent.name} delay={index * 0.1}>
                <Card className="h-full relative">
                  {agent.badge && (
                    <Badge className="absolute -top-2 -right-2">
                      {agent.badge}
                    </Badge>
                  )}
                  <CardHeader>
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${agent.bgColor} ${agent.color} mb-4`}>
                      <agent.icon className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-xl">{agent.name}</CardTitle>
                    <p className={`text-sm font-medium ${agent.color}`}>{agent.tagline}</p>
                    <CardDescription className="mt-2">
                      {agent.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold text-sm mb-3">Capabilities:</h4>
                    <ul className="space-y-1.5 mb-6">
                      {agent.capabilities.map((cap) => (
                        <li key={cap} className="flex items-center text-sm text-muted-foreground">
                          <span className={`mr-2 ${agent.color}`}>•</span>
                          {cap}
                        </li>
                      ))}
                    </ul>
                    <h4 className="font-semibold text-sm mb-3">Use Cases:</h4>
                    <ul className="space-y-1.5">
                      {agent.useCases.map((useCase) => (
                        <li key={useCase} className="text-sm text-muted-foreground">
                          → {useCase}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Our AI Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI agents are trained on vast amounts of financial data and tax regulations,
              ensuring accurate, reliable results every time.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { step: 1, title: "Input", desc: "Upload documents or connect your data" },
              { step: 2, title: "Analysis", desc: "AI processes and understands your data" },
              { step: 3, title: "Intelligence", desc: "Advanced algorithms extract insights" },
              { step: 4, title: "Results", desc: "Get actionable recommendations" },
            ].map((item, index) => (
              <AnimatedSection key={item.step} delay={index * 0.1}>
                <div className="text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <CTASection variant="demo" />
    </>
  );
}
