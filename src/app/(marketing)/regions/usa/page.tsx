import { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowRight, CheckCircle, Building2, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

export const metadata: Metadata = {
  title: "United States - CPA Services | Taxable AI",
  description: "Expert taxation, audit, and accounting services in the USA. IRS compliant solutions with AI-powered efficiency for American businesses.",
};

const services = [
  {
    title: "IRS Tax Compliance",
    description: "Comprehensive federal and state tax filing and compliance.",
    features: ["Federal Tax Returns", "State Tax Filings", "Quarterly Estimates", "IRS Audit Support"],
  },
  {
    title: "Financial Audits",
    description: "GAAP-compliant audits for companies of all sizes.",
    features: ["GAAP Audits", "SOC 1 & SOC 2", "SEC Filings Support", "Non-Profit Audits"],
  },
  {
    title: "Accounting Services",
    description: "Full-service accounting for American businesses.",
    features: ["GAAP Bookkeeping", "Financial Reporting", "Payroll Processing", "CFO Services"],
  },
  {
    title: "International Tax",
    description: "Cross-border tax planning and compliance.",
    features: ["FBAR & FATCA", "Transfer Pricing", "Treaty Benefits", "Expatriate Taxes"],
  },
];

const stats = [
  { value: "75+", label: "US Clients" },
  { value: "$100M+", label: "Tax Savings" },
  { value: "All 50", label: "States Covered" },
  { value: "100%", label: "IRS Compliance" },
];

const industries = [
  "SaaS & Technology", "Private Equity", "Real Estate", "Healthcare",
  "E-commerce", "Manufacturing", "Startups", "Non-Profits",
];

export default function USAPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-red-500/10 to-background">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <span className="text-6xl">🇺🇸</span>
            </div>
            <Badge variant="outline" className="mb-4">United States</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              CPA Excellence in the United States
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              AICPA-certified professionals delivering AI-powered taxation and accounting
              services for American businesses. Full IRS and state compliance guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">
                  Get Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline">
                  Try AI Demo
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <AnimatedSection key={stat.label} delay={index * 0.1}>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Services in the United States</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive CPA services for US businesses and individuals.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <AnimatedSection key={service.title} delay={index * 0.1}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>{service.title}</CardTitle>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
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

      {/* Industries */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Industries We Serve</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Deep expertise across America's dynamic business landscape.
            </p>
          </AnimatedSection>

          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {industries.map((industry, index) => (
              <AnimatedSection key={industry} delay={index * 0.05}>
                <Badge variant="secondary" className="text-sm py-2 px-4">
                  {industry}
                </Badge>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Taxable AI in the USA?</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <AnimatedSection delay={0.1}>
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">CPA Licensed</h3>
                  <p className="text-sm text-muted-foreground">
                    Licensed CPAs with AICPA membership across all 50 states.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Multi-State Expertise</h3>
                  <p className="text-sm text-muted-foreground">
                    Navigate complex state tax requirements with confidence.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">AI-Powered Accuracy</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced AI ensuring faster processing and higher accuracy rates.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <span className="text-4xl">🇺🇸</span>
                    <div>
                      <h3 className="text-2xl font-bold">New York Office</h3>
                      <p className="text-muted-foreground">Our US headquarters</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span>New York, NY, USA</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <a href="tel:+15551234567" className="hover:text-primary">
                          +1 555 123 4567
                        </a>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <a href="mailto:dilawar.gopang@gmail.com" className="hover:text-primary">
                          dilawar.gopang@gmail.com
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <span>Mon-Fri: 9:00 AM - 6:00 PM EST</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <Link href="/contact" className="flex-1">
                      <Button className="w-full">
                        Schedule Consultation
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/services" className="flex-1">
                      <Button variant="outline" className="w-full">
                        View All Services
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
