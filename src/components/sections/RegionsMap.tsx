"use client";

import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Button } from "@/components/ui/button";

const regions = [
  {
    name: "Pakistan",
    flag: "🇵🇰",
    authority: "FBR",
    description: "Comprehensive tax services compliant with Federal Board of Revenue regulations.",
    href: "/regions/pakistan",
  },
  {
    name: "United Kingdom",
    flag: "🇬🇧",
    authority: "HMRC",
    description: "Expert UK tax planning and HMRC compliance for businesses and individuals.",
    href: "/regions/uk",
  },
  {
    name: "United States",
    flag: "🇺🇸",
    authority: "IRS",
    description: "IRS-compliant tax services including federal and state tax management.",
    href: "/regions/usa",
  },
  {
    name: "Saudi Arabia",
    flag: "🇸🇦",
    authority: "ZATCA",
    description: "VAT compliance and Zakat management aligned with ZATCA requirements.",
    href: "/regions/saudi-arabia",
  },
  {
    name: "UAE",
    flag: "🇦🇪",
    authority: "FTA",
    description: "VAT services and Federal Tax Authority compliance for UAE businesses.",
    href: "/regions/uae",
  },
];

export function RegionsMap() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Global Presence, Local Expertise
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We understand the unique tax landscapes of each region we serve.
            Our experts ensure compliance with local regulations while leveraging AI efficiency.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {regions.map((region, index) => (
            <AnimatedSection key={region.name} delay={index * 0.1}>
              <Link href={region.href} className="block group">
                <div className="bg-muted/30 rounded-xl p-6 border transition-all duration-300 hover:shadow-lg hover:bg-muted/50 hover:border-primary/30">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl">{region.flag}</span>
                    <div>
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {region.name}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {region.authority} Compliance
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {region.description}
                  </p>
                  <div className="flex items-center text-sm text-primary font-medium group-hover:underline">
                    Learn More
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.5} className="text-center">
          <Link href="/regions">
            <Button size="lg" variant="outline">
              View All Regions
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
