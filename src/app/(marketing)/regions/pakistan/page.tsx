import { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowRight, CheckCircle, Building2, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

export const metadata: Metadata = {
  title: "Pakistan - Chartered Accountancy Services | Taxable AI",
  description: "Expert taxation, audit, and accounting services in Pakistan. FBR compliant solutions with AI-powered efficiency for Pakistani businesses.",
};

const services = [
  {
    title: "FBR Tax Compliance",
    description: "Complete tax filing and compliance with Federal Board of Revenue regulations.",
    features: ["Income Tax Returns", "Sales Tax Registration", "Withholding Tax Management", "Tax Audits Support"],
  },
  {
    title: "Corporate Audits",
    description: "SECP-compliant statutory audits for listed and unlisted companies.",
    features: ["Statutory Audits", "Internal Audits", "Due Diligence", "Special Purpose Audits"],
  },
  {
    title: "Accounting Services",
    description: "Complete accounting solutions tailored for Pakistani businesses.",
    features: ["Bookkeeping", "Financial Statements", "Payroll Processing", "Management Reporting"],
  },
  {
    title: "Business Advisory",
    description: "Strategic guidance for business growth and regulatory compliance.",
    features: ["Company Formation", "SECP Compliance", "Business Restructuring", "M&A Advisory"],
  },
];

const stats = [
  { value: "150+", label: "Pakistani Clients" },
  { value: "PKR 50B+", label: "Assets Under Management" },
  { value: "15+", label: "Years in Pakistan" },
  { value: "100%", label: "FBR Compliance Rate" },
];

const industries = [
  "Manufacturing", "Textiles", "IT & Software", "Banking & Finance",
  "Real Estate", "Pharmaceuticals", "FMCG", "Energy",
];

export default function PakistanPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-green-500/10 to-background">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <span className="text-6xl">🇵🇰</span>
            </div>
            <Badge variant="outline" className="mb-4">Pakistan Operations</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Chartered Accountancy Excellence in Pakistan
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Leading the way in AI-powered taxation and accounting services for Pakistani
              businesses. ICAP-certified professionals ensuring FBR compliance.
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
            <h2 className="text-3xl font-bold mb-4">Services in Pakistan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive chartered accountancy services tailored for the Pakistani business environment.
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
              Deep expertise across Pakistan's key economic sectors.
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
            <h2 className="text-3xl font-bold mb-4">Why Choose Taxable AI in Pakistan?</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <AnimatedSection delay={0.1}>
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">ICAP Certified</h3>
                  <p className="text-sm text-muted-foreground">
                    All our professionals are certified by the Institute of Chartered Accountants Pakistan.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Local Expertise</h3>
                  <p className="text-sm text-muted-foreground">
                    Deep understanding of Pakistani tax laws, SECP regulations, and business practices.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">AI-Powered</h3>
                  <p className="text-sm text-muted-foreground">
                    Cutting-edge AI technology ensuring faster processing and higher accuracy.
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
                    <span className="text-4xl">🇵🇰</span>
                    <div>
                      <h3 className="text-2xl font-bold">Pakistan Office</h3>
                      <p className="text-muted-foreground">Our headquarters in Karachi</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span>Karachi, Pakistan</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <a href="tel:+923001234567" className="hover:text-primary">
                          +92 300 1234567
                        </a>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <a href="mailto:pakistan@taxable.ai" className="hover:text-primary">
                          pakistan@taxable.ai
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <span>Mon-Sat: 9:00 AM - 6:00 PM PKT</span>
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
