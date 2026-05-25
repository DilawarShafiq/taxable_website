import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

export const metadata: Metadata = {
  title: "Our Global Presence",
  description: "Taxable AI operates across Pakistan, UK, USA, Saudi Arabia, and UAE. Find your local office for expert chartered accountancy services.",
};

const regions = [
  {
    name: "Pakistan",
    flag: "🇵🇰",
    slug: "pakistan",
    city: "Karachi",
    description: "FBR compliant taxation, ICAP-certified audits, and AI-powered accounting services for Pakistani businesses.",
    regulator: "Federal Board of Revenue (FBR)",
    professionalBody: "ICAP",
    email: "dilawar.gopang@gmail.com",
    phone: "+92 300 1234567",
    hours: "Mon-Sat: 9:00 AM - 6:00 PM PKT",
    color: "from-green-500/20",
  },
  {
    name: "United Kingdom",
    flag: "🇬🇧",
    slug: "uk",
    city: "London",
    description: "HMRC compliant services, R&D tax credits, and Making Tax Digital ready solutions for UK companies.",
    regulator: "HMRC",
    professionalBody: "ICAEW / ACCA",
    email: "dilawar.gopang@gmail.com",
    phone: "+44 20 1234 5678",
    hours: "Mon-Fri: 9:00 AM - 5:30 PM GMT",
    color: "from-blue-500/20",
  },
  {
    name: "United States",
    flag: "🇺🇸",
    slug: "usa",
    city: "New York",
    description: "IRS compliant federal and multi-state taxation, GAAP audits, and CPA-certified financial services.",
    regulator: "Internal Revenue Service (IRS)",
    professionalBody: "AICPA",
    email: "dilawar.gopang@gmail.com",
    phone: "+1 555 123 4567",
    hours: "Mon-Fri: 9:00 AM - 6:00 PM EST",
    color: "from-red-500/20",
  },
  {
    name: "Saudi Arabia",
    flag: "🇸🇦",
    slug: "saudi-arabia",
    city: "Riyadh",
    description: "ZATCA VAT compliance, Zakat services, e-invoicing integration, and Vision 2030 aligned advisory.",
    regulator: "ZATCA",
    professionalBody: "SOCPA",
    email: "dilawar.gopang@gmail.com",
    phone: "+966 11 123 4567",
    hours: "Sun-Thu: 8:00 AM - 5:00 PM AST",
    color: "from-green-600/20",
  },
  {
    name: "United Arab Emirates",
    flag: "🇦🇪",
    slug: "uae",
    city: "Dubai",
    description: "FTA VAT & Corporate Tax compliance, Free Zone expertise, and business setup across all Emirates.",
    regulator: "Federal Tax Authority (FTA)",
    professionalBody: "AAA",
    email: "dilawar.gopang@gmail.com",
    phone: "+971 4 123 4567",
    hours: "Sun-Thu: 9:00 AM - 6:00 PM GST",
    color: "from-red-600/20",
  },
];

export default function RegionsPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">Global Presence</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Serving Clients Across 5 Countries
            </h1>
            <p className="text-xl text-muted-foreground">
              Expert chartered accountancy services with local expertise and global standards.
              Find your nearest Taxable AI office.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* World Map Placeholder */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-8 flex-wrap">
            {regions.map((region) => (
              <Link key={region.slug} href={`/regions/${region.slug}`}>
                <div className="text-center hover:scale-110 transition-transform cursor-pointer">
                  <span className="text-5xl">{region.flag}</span>
                  <p className="text-sm font-medium mt-2">{region.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Region Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-8 max-w-5xl mx-auto">
            {regions.map((region, index) => (
              <AnimatedSection key={region.slug} delay={index * 0.1}>
                <Card className={`overflow-hidden hover:shadow-lg transition-all bg-gradient-to-r ${region.color} to-background`}>
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-3 gap-0">
                      {/* Region Info */}
                      <div className="p-8 md:col-span-2">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-5xl">{region.flag}</span>
                          <div>
                            <h2 className="text-2xl font-bold">{region.name}</h2>
                            <p className="text-muted-foreground">{region.city} Office</p>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-6">
                          {region.description}
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4 mb-6">
                          <div>
                            <p className="text-sm font-medium">Tax Authority</p>
                            <p className="text-sm text-muted-foreground">{region.regulator}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Professional Body</p>
                            <p className="text-sm text-muted-foreground">{region.professionalBody}</p>
                          </div>
                        </div>

                        <Link href={`/regions/${region.slug}`}>
                          <Button>
                            Explore {region.name} Services
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>

                      {/* Contact Info */}
                      <div className="bg-muted/50 p-8 flex flex-col justify-center">
                        <h3 className="font-semibold mb-4">Contact</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{region.city}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-primary" />
                            <a href={`mailto:${region.email}`} className="hover:text-primary">
                              {region.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary" />
                            <a href={`tel:${region.phone.replace(/\s/g, '')}`} className="hover:text-primary">
                              {region.phone}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="text-muted-foreground">{region.hours}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Not Sure Which Office to Contact?</h2>
            <p className="text-muted-foreground mb-6">
              Reach out to our global team and we'll connect you with the right experts
              for your specific needs.
            </p>
            <Link href="/contact">
              <Button size="lg">
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
