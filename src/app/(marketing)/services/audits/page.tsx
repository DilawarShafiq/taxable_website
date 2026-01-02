import { Metadata } from "next";
import Link from "next/link";
import { Search, Check, ArrowRight, Shield, FileCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Audit Services",
  description: "Independent, thorough auditing services ensuring financial accuracy and regulatory compliance.",
};

const services = [
  "Financial Statement Audits",
  "Internal Audit Services",
  "Compliance Audits",
  "Operational Audits",
  "Risk Assessment",
  "Fraud Investigation",
  "Due Diligence Reviews",
  "Special Purpose Audits",
];

export default function AuditsPage() {
  return (
    <>
      <section className="py-20 bg-gradient-to-b from-green-500/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection className="text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500/10 text-green-500 mx-auto mb-8">
                <Search className="h-10 w-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Audit Services</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Independent, thorough auditing services that provide assurance and insights
                for better business decisions.
              </p>
              <Link href="/contact">
                <Button size="xl">
                  Request Audit Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Audit Services</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {services.map((service, index) => (
              <AnimatedSection key={service} delay={index * 0.05}>
                <div className="flex items-center p-4 rounded-lg border bg-card">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
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
                <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Independent Assurance</h3>
                <p className="text-muted-foreground">
                  Unbiased, objective assessments you can trust
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="text-center p-6">
                <FileCheck className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Regulatory Compliance</h3>
                <p className="text-muted-foreground">
                  Ensure adherence to all applicable standards
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="text-center p-6">
                <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Risk Identification</h3>
                <p className="text-muted-foreground">
                  Proactively identify and mitigate financial risks
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
