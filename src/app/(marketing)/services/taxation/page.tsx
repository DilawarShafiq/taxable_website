import { Metadata } from "next";
import Link from "next/link";
import { Calculator, Check, ArrowRight, Globe, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Taxation Services",
  description: "Expert tax planning, filing, and compliance services across Pakistan, UK, USA, Saudi Arabia, and UAE.",
};

const services = [
  "Corporate Tax Planning & Strategy",
  "Personal Income Tax Filing",
  "VAT/GST Registration & Filing",
  "International Tax Advisory",
  "Transfer Pricing Compliance",
  "Tax Dispute Resolution",
  "Withholding Tax Management",
  "Tax Audit Support",
];

const regions = [
  { name: "Pakistan", authority: "FBR", flag: "🇵🇰" },
  { name: "United Kingdom", authority: "HMRC", flag: "🇬🇧" },
  { name: "United States", authority: "IRS", flag: "🇺🇸" },
  { name: "Saudi Arabia", authority: "ZATCA", flag: "🇸🇦" },
  { name: "UAE", authority: "FTA", flag: "🇦🇪" },
];

const process = [
  {
    step: 1,
    title: "Initial Consultation",
    description: "We analyze your financial situation and tax obligations across jurisdictions.",
  },
  {
    step: 2,
    title: "Strategy Development",
    description: "Our AI-powered tools help design optimal tax strategies for your needs.",
  },
  {
    step: 3,
    title: "Implementation",
    description: "We handle all filings, documentation, and compliance requirements.",
  },
  {
    step: 4,
    title: "Ongoing Support",
    description: "Continuous monitoring and proactive advisory throughout the year.",
  },
];

export default function TaxationPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-blue-500/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection className="text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 mx-auto mb-8">
                <Calculator className="h-10 w-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Taxation Services
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Expert tax planning, filing, and compliance services powered by AI.
                We navigate complex tax landscapes across 5 countries so you don't have to.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="xl">
                    Get Tax Consultation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button size="xl" variant="outline">
                    Try AI Tax Demo
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Tax Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From personal income tax to complex international tax structures,
              we provide end-to-end taxation services.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {services.map((service, index) => (
              <AnimatedSection key={service} delay={index * 0.05}>
                <div className="flex items-center p-4 rounded-lg border bg-card">
                  <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                  <span className="text-sm">{service}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Regions */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Multi-Jurisdiction Expertise</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're experts in tax regulations across these key markets, ensuring
              compliance with local authorities.
            </p>
          </AnimatedSection>

          <div className="flex flex-wrap justify-center gap-6">
            {regions.map((region, index) => (
              <AnimatedSection key={region.name} delay={index * 0.1}>
                <Card className="w-48">
                  <CardContent className="p-6 text-center">
                    <span className="text-4xl mb-3 block">{region.flag}</span>
                    <h3 className="font-semibold">{region.name}</h3>
                    <p className="text-sm text-muted-foreground">{region.authority} Compliant</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Process</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A streamlined approach to managing your tax obligations efficiently.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {process.map((step, index) => (
              <AnimatedSection key={step.step} delay={index * 0.1}>
                <div className="text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center p-6">
                <Globe className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Global Coverage</h3>
                <p className="text-muted-foreground">
                  Expert knowledge of tax laws across 5 major jurisdictions
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="text-center p-6">
                <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Compliance Guaranteed</h3>
                <p className="text-muted-foreground">
                  Stay compliant with ever-changing tax regulations
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="text-center p-6">
                <Zap className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">AI-Powered</h3>
                <p className="text-muted-foreground">
                  Advanced AI for accurate calculations and optimization
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <CTASection variant="contact" />
    </>
  );
}
