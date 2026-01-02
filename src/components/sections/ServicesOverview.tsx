"use client";

import Link from "next/link";
import { FileText, Search, Calculator, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Calculator,
    title: "Taxation Services",
    description: "Comprehensive tax planning, filing, and compliance for individuals and businesses.",
    features: ["Tax Planning & Strategy", "Corporate Tax Filing", "VAT/GST Management", "International Tax Advisory"],
    href: "/services/taxation",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Search,
    title: "Audit Services",
    description: "Independent, thorough auditing services ensuring compliance and accuracy.",
    features: ["Financial Statement Audits", "Internal Audits", "Compliance Audits", "Risk Assessment"],
    href: "/services/audits",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: FileText,
    title: "Accounting Services",
    description: "End-to-end accounting solutions powered by AI for accuracy and efficiency.",
    features: ["Bookkeeping & Recording", "Financial Reporting", "Payroll Management", "AI-Powered Analysis"],
    href: "/services/accounting",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

export function ServicesOverview() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Professional Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive chartered accountancy services tailored to your business needs,
            enhanced with cutting-edge AI technology.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <AnimatedSection key={service.title} delay={index * 0.1}>
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${service.bgColor} ${service.color} mb-4`}>
                    <service.icon className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary mr-3 text-xs">
                          ✓
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href={service.href}>
                    <Button variant="outline" className="w-full group">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.4} className="text-center mt-12">
          <Link href="/services">
            <Button size="lg">
              View All Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
