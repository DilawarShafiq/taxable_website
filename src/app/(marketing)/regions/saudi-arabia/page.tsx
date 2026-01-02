import { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowRight, CheckCircle, Building2, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

export const metadata: Metadata = {
  title: "Saudi Arabia - Chartered Accountancy Services | Taxable AI",
  description: "Expert taxation, audit, and accounting services in Saudi Arabia. ZATCA compliant VAT solutions with AI-powered efficiency for Saudi businesses.",
};

const services = [
  {
    title: "ZATCA VAT Compliance",
    description: "Complete VAT filing and compliance with Zakat, Tax and Customs Authority.",
    features: ["VAT Registration", "VAT Returns Filing", "E-Invoicing (FATOORA)", "VAT Audit Support"],
  },
  {
    title: "Zakat Services",
    description: "Comprehensive Zakat calculation and filing for Saudi entities.",
    features: ["Zakat Calculation", "Annual Zakat Returns", "Zakat Planning", "GAZT Compliance"],
  },
  {
    title: "Audit & Assurance",
    description: "SOCPA-compliant audits for Saudi companies.",
    features: ["Statutory Audits", "Internal Audits", "IFRS Compliance", "Due Diligence"],
  },
  {
    title: "Vision 2030 Advisory",
    description: "Strategic guidance aligned with Saudi Arabia's transformation goals.",
    features: ["Business Setup", "Licensing Support", "Saudization Compliance", "IPO Readiness"],
  },
];

const stats = [
  { value: "60+", label: "Saudi Clients" },
  { value: "SAR 2B+", label: "Assets Under Audit" },
  { value: "100%", label: "ZATCA Compliance" },
  { value: "E-Invoice", label: "Certified" },
];

const industries = [
  "Oil & Gas", "Construction", "Retail", "Healthcare",
  "Financial Services", "Hospitality", "Manufacturing", "Technology",
];

export default function SaudiArabiaPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-green-600/10 to-background">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <span className="text-6xl">🇸🇦</span>
            </div>
            <Badge variant="outline" className="mb-4">Saudi Arabia</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Chartered Accountancy Excellence in Saudi Arabia
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              SOCPA-certified professionals delivering AI-powered VAT, Zakat, and accounting
              services. Full ZATCA compliance and e-invoicing support.
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
            <h2 className="text-3xl font-bold mb-4">Services in Saudi Arabia</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive VAT, Zakat, and accounting services aligned with Vision 2030.
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

      {/* E-Invoicing */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">FATOORA Certified</Badge>
            <h2 className="text-3xl font-bold mb-4">ZATCA E-Invoicing Ready</h2>
            <p className="text-muted-foreground mb-8">
              Our AI-powered systems are fully compliant with ZATCA's FATOORA e-invoicing
              requirements. We help businesses transition seamlessly to Phase 2 integration.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {["Phase 1 Compliant", "Phase 2 Integration", "Real-time Validation"].map((item) => (
                <Card key={item}>
                  <CardContent className="p-4">
                    <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="font-medium">{item}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Industries We Serve</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Supporting Saudi Arabia's economic diversification across key sectors.
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
            <h2 className="text-3xl font-bold mb-4">Why Choose Taxable AI in Saudi Arabia?</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <AnimatedSection delay={0.1}>
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">SOCPA Certified</h3>
                  <p className="text-sm text-muted-foreground">
                    Licensed by Saudi Organization for Certified Public Accountants.
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
                    Deep understanding of Saudi regulations, Zakat requirements, and business culture.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Vision 2030 Aligned</h3>
                  <p className="text-sm text-muted-foreground">
                    Supporting businesses in Saudi Arabia's economic transformation journey.
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
                    <span className="text-4xl">🇸🇦</span>
                    <div>
                      <h3 className="text-2xl font-bold">Riyadh Office</h3>
                      <p className="text-muted-foreground">Our Saudi Arabia headquarters</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span>Riyadh, Saudi Arabia</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <a href="tel:+966111234567" className="hover:text-primary">
                          +966 11 123 4567
                        </a>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <a href="mailto:ksa@taxable.ai" className="hover:text-primary">
                          ksa@taxable.ai
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <span>Sun-Thu: 8:00 AM - 5:00 PM AST</span>
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
