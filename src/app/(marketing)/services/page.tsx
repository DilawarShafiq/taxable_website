import { Metadata } from "next";
import Link from "next/link";
import { Calculator, Search, FileText, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Services",
  description: "Comprehensive chartered accountancy services including taxation, audits, and accounting powered by AI technology.",
};

const services = [
  {
    icon: Calculator,
    title: "Taxation Services",
    description: "Comprehensive tax planning, filing, and compliance for individuals and businesses across all jurisdictions.",
    href: "/services/taxation",
    features: [
      "Corporate Tax Planning & Filing",
      "Personal Income Tax",
      "VAT/GST Management",
      "International Tax Advisory",
      "Tax Dispute Resolution",
      "Transfer Pricing",
    ],
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Search,
    title: "Audit Services",
    description: "Independent, thorough auditing services ensuring financial accuracy and regulatory compliance.",
    href: "/services/audits",
    features: [
      "Financial Statement Audits",
      "Internal Audit Services",
      "Compliance Audits",
      "Risk Assessment",
      "Fraud Investigation",
      "Due Diligence Reviews",
    ],
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: FileText,
    title: "Accounting Services",
    description: "End-to-end accounting solutions powered by AI for accuracy, efficiency, and real-time insights.",
    href: "/services/accounting",
    features: [
      "Bookkeeping & Recording",
      "Financial Reporting",
      "Payroll Management",
      "AI-Powered Analysis",
      "Cash Flow Management",
      "Budgeting & Forecasting",
    ],
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Professional Services
            </h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive chartered accountancy services tailored to your business needs,
              enhanced with cutting-edge AI technology for unmatched accuracy and efficiency.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {services.map((service, index) => (
              <AnimatedSection key={service.title} delay={index * 0.1}>
                <Card className="overflow-hidden">
                  <div className="grid lg:grid-cols-2">
                    <CardHeader className="p-8 lg:p-12">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${service.bgColor} ${service.color} mb-6`}>
                        <service.icon className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-3xl mb-4">{service.title}</CardTitle>
                      <CardDescription className="text-lg">
                        {service.description}
                      </CardDescription>
                      <div className="mt-8">
                        <Link href={service.href}>
                          <Button size="lg" className="group">
                            Learn More
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent className="bg-muted/30 p-8 lg:p-12">
                      <h4 className="font-semibold mb-6 text-lg">What's Included:</h4>
                      <ul className="grid sm:grid-cols-2 gap-4">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <Check className={`h-5 w-5 mr-3 mt-0.5 ${service.color}`} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <CTASection variant="contact" />
    </>
  );
}
