"use client";

import { Shield, Lock, Award, CheckCircle } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const certifications = [
  { name: "ACCA", description: "Association of Chartered Certified Accountants" },
  { name: "CPA", description: "Certified Public Accountants" },
  { name: "ICAP", description: "Institute of Chartered Accountants of Pakistan" },
  { name: "ICAEW", description: "Institute of Chartered Accountants in England and Wales" },
];

const securityFeatures = [
  {
    icon: Lock,
    title: "Bank-Level Encryption",
    description: "256-bit SSL encryption for all data transfers",
  },
  {
    icon: Shield,
    title: "GDPR Compliant",
    description: "Full compliance with data protection regulations",
  },
  {
    icon: Award,
    title: "Data Integrity",
    description: "Immutable audit logs and access controls",
  },
  {
    icon: CheckCircle,
    title: "Secure Infrastructure",
    description: "Hosted on enterprise-grade cloud with redundancy",
  },
];

export function TrustIndicators() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Professional Certifications */}
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Certified Excellence
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Our team holds prestigious certifications from leading global accounting bodies,
            ensuring the highest standards of professional service.
          </p>

          <div className="flex flex-wrap justify-center gap-8">
            {certifications.map((cert, index) => (
              <AnimatedSection key={cert.name} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{cert.name}</div>
                  <p className="text-sm text-muted-foreground max-w-[200px]">
                    {cert.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>

        {/* Security Features */}
        <div className="mt-20 pt-16 border-t">
          <AnimatedSection className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">Your Data, Secure & Protected</h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We employ enterprise-grade security measures to protect your sensitive financial data.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 0.1}>
                <div className="text-center p-6 rounded-xl bg-muted/30 border">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-green-500 mx-auto mb-4">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
