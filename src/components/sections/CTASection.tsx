"use client";

import Link from "next/link";
import { ArrowRight, FileUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

interface CTASectionProps {
  variant?: "default" | "demo" | "contact";
}

export function CTASection({ variant = "default" }: CTASectionProps) {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <AnimatedSection className="max-w-3xl mx-auto text-center">
          {variant === "demo" ? (
            <>
              <FileUp className="h-12 w-12 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                See AI in Action
              </h2>
              <p className="text-lg opacity-90 mb-8">
                Upload your bank statement and watch our AI instantly analyze,
                categorize, and summarize your transactions. No signup required.
              </p>
              <Link href="/demo">
                <Button size="xl" variant="secondary" className="text-primary">
                  Try Free Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </>
          ) : variant === "contact" ? (
            <>
              <MessageSquare className="h-12 w-12 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Finances?
              </h2>
              <p className="text-lg opacity-90 mb-8">
                Get in touch with our experts for a personalized consultation.
                We'll help you find the right services for your business needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="xl" variant="secondary" className="text-primary">
                    Get a Quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button size="xl" variant="outline" className="border-primary-foreground/30 hover:bg-primary-foreground/10">
                    Try AI Demo First
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Start Your AI-Powered Accounting Journey
              </h2>
              <p className="text-lg opacity-90 mb-8">
                Transform your financial operations with AI-powered chartered accountancy.
                Get started today with a free consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/demo">
                  <Button size="xl" variant="secondary" className="text-primary">
                    Try AI Demo
                    <FileUp className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="xl" variant="outline" className="border-primary-foreground/30 hover:bg-primary-foreground/10">
                    Contact Sales
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}
