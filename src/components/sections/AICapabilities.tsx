"use client";

import Link from "next/link";
import { Bot, FileUp, Table, Calculator, MessageSquare, Zap, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const aiFeatures = [
  {
    icon: Bot,
    title: "AI Tax Agent",
    description: "Intelligent tax calculations, optimization suggestions, and compliance checking powered by advanced AI.",
    badge: "Most Popular",
  },
  {
    icon: Table,
    title: "Spreadsheet Agent",
    description: "Automatically process, analyze, and organize your financial spreadsheets with AI accuracy.",
    badge: null,
  },
  {
    icon: FileUp,
    title: "Document Analysis",
    description: "Upload bank statements and invoices - our AI extracts, categorizes, and summarizes transactions.",
    badge: "Try Demo",
  },
  {
    icon: Calculator,
    title: "Bookkeeping Agent",
    description: "Automated bookkeeping that learns your patterns and keeps your finances organized 24/7.",
    badge: null,
  },
  {
    icon: MessageSquare,
    title: "AI Chatbot",
    description: "Get instant answers to your tax and accounting questions from our intelligent assistant.",
    badge: "Available Now",
  },
  {
    icon: Zap,
    title: "Real-time Insights",
    description: "AI-powered analytics that provide actionable insights for better financial decisions.",
    badge: null,
  },
];

export function AICapabilities() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Powered by AI</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            AI-Powered Accounting Revolution
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our specialized AI agents work around the clock to handle your taxation,
            spreadsheets, and document processing with unprecedented accuracy.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {aiFeatures.map((feature, index) => (
            <AnimatedSection
              key={feature.title}
              delay={index * 0.1}
              className="relative group"
            >
              <div className="bg-background rounded-xl p-6 border transition-all duration-300 hover:shadow-lg hover:border-primary/30 h-full">
                {feature.badge && (
                  <Badge className="absolute -top-2 -right-2" variant={feature.badge === "Try Demo" ? "default" : "secondary"}>
                    {feature.badge}
                  </Badge>
                )}
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.6} className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Link href="/demo">
              <Button size="lg">
                Try AI Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/ai-agents">
              <Button size="lg" variant="outline">
                Explore All AI Agents
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
