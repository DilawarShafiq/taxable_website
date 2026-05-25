import { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowRight, CheckCircle, Building2, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

export const metadata: Metadata = {
  title: "UAE - Chartered Accountancy Services | Taxable AI",
  description: "Expert taxation, audit, and accounting services in the UAE. FTA compliant VAT and Corporate Tax solutions with AI-powered efficiency for UAE businesses.",
};

const services = [
  {
    title: "FTA VAT Compliance",
    description: "Complete VAT filing and compliance with Federal Tax Authority.",
    features: ["VAT Registration", "VAT Returns Filing", "Tax Group Registration", "VAT Refund Claims"],
  },
  {
    title: "Corporate Tax",
    description: "Navigate the UAE's new corporate tax regime with confidence.",
    features: ["CT Registration", "Tax Planning", "Transfer Pricing", "Compliance Advisory"],
  },
  {
    title: "Free Zone Services",
    description: "Specialized services for UAE Free Zone companies.",
    features: ["Free Zone Compliance", "License Renewals", "Economic Substance", "Audit & Assurance"],
  },
  {
    title: "Business Setup",
    description: "End-to-end support for establishing your UAE presence.",
    features: ["Company Formation", "Trade License", "Bank Account Opening", "PRO Services"],
  },
];

const stats = [
  { value: "80+", label: "UAE Clients" },
  { value: "AED 5B+", label: "Assets Under Management" },
  { value: "100%", label: "FTA Compliance" },
  { value: "All", label: "Emirates Covered" },
];

const industries = [
  "Trading", "Real Estate", "Hospitality", "Professional Services",
  "E-commerce", "Logistics", "Technology", "Construction",
];

const freeZones = [
  "DMCC", "DIFC", "JAFZA", "DAFZA", "Sharjah FZA", "RAK FTZ", "ADGM", "SAIF Zone",
];

export default function UAEPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-red-600/10 to-background">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <span className="text-6xl">🇦🇪</span>
            </div>
            <Badge variant="outline" className="mb-4">United Arab Emirates</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Chartered Accountancy Excellence in the UAE
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              AAA-certified professionals delivering AI-powered VAT, Corporate Tax, and accounting
              services. Full FTA compliance across all Emirates and Free Zones.
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

      {/* Corporate Tax Alert */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <Badge variant="destructive" className="mb-4">New for 2024</Badge>
            <h2 className="text-2xl font-bold mb-4">UAE Corporate Tax Is Here</h2>
            <p className="text-muted-foreground mb-6">
              With the introduction of 9% Corporate Tax, UAE businesses need expert guidance.
              Our team helps you navigate registration, compliance, and optimization.
            </p>
            <Link href="/contact">
              <Button>
                Get Corporate Tax Advisory
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Services in the UAE</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive VAT, Corporate Tax, and business services across all Emirates.
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

      {/* Free Zones */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Free Zone Expertise</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Specialized knowledge across UAE's major Free Zones.
            </p>
          </AnimatedSection>

          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {freeZones.map((zone, index) => (
              <AnimatedSection key={zone} delay={index * 0.05}>
                <Badge variant="secondary" className="text-sm py-2 px-4">
                  {zone}
                </Badge>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Industries We Serve</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Supporting businesses across the UAE's diverse economy.
            </p>
          </AnimatedSection>

          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {industries.map((industry, index) => (
              <AnimatedSection key={industry} delay={index * 0.05}>
                <Badge variant="outline" className="text-sm py-2 px-4">
                  {industry}
                </Badge>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Taxable AI in the UAE?</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <AnimatedSection delay={0.1}>
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">AAA Licensed</h3>
                  <p className="text-sm text-muted-foreground">
                    Licensed by UAE's Accountants & Auditors Association.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">FTA Registered</h3>
                  <p className="text-sm text-muted-foreground">
                    Authorized Tax Agent with Federal Tax Authority registration.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">All Emirates</h3>
                  <p className="text-sm text-muted-foreground">
                    Serving clients across Dubai, Abu Dhabi, Sharjah, and all Emirates.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <span className="text-4xl">🇦🇪</span>
                    <div>
                      <h3 className="text-2xl font-bold">Dubai Office</h3>
                      <p className="text-muted-foreground">Our UAE headquarters</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span>Dubai, UAE</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <a href="tel:+97141234567" className="hover:text-primary">
                          +971 4 123 4567
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
                        <span>Sun-Thu: 9:00 AM - 6:00 PM GST</span>
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
