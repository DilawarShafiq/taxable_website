import { Metadata } from "next";
import Link from "next/link";
import { Target, Eye, Award, Users, Globe, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Taxable AI - the pioneering chartered accountancy firm combining professional expertise with AI innovation across Pakistan, UK, USA, Saudi Arabia, and UAE.",
};

const values = [
  {
    icon: Shield,
    title: "Integrity First",
    description: "We uphold the highest ethical standards in all our engagements, ensuring transparency and trust in every client relationship.",
  },
  {
    icon: Target,
    title: "Precision Excellence",
    description: "Our AI-enhanced processes deliver accuracy that exceeds industry standards, minimizing errors and maximizing compliance.",
  },
  {
    icon: Users,
    title: "Client Partnership",
    description: "We view ourselves as an extension of your team, deeply invested in your financial success and growth.",
  },
  {
    icon: Globe,
    title: "Global Perspective",
    description: "Operating across five key markets gives us unique insights into international taxation and cross-border financial strategies.",
  },
];

const milestones = [
  { year: "2018", event: "Founded in Karachi with a vision to modernize chartered accountancy" },
  { year: "2019", event: "Expanded to UK, establishing London operations" },
  { year: "2020", event: "Launched AI-powered document processing technology" },
  { year: "2021", event: "Opened offices in Dubai and Riyadh to serve Middle East clients" },
  { year: "2022", event: "Entered US market with New York presence" },
  { year: "2023", event: "Introduced advanced AI agents for automated tax calculations" },
  { year: "2024", event: "Expanding enterprise services across 5 countries" },
];

const team = [
  {
    name: "Ahmed Khan",
    role: "Managing Partner",
    credentials: "FCA, CPA",
    bio: "25+ years in international taxation and audit. Former Big 4 partner.",
    region: "Pakistan",
  },
  {
    name: "Sarah Mitchell",
    role: "Director - UK Operations",
    credentials: "ACA, FCCA",
    bio: "Specialist in UK tax law and cross-border transactions.",
    region: "United Kingdom",
  },
  {
    name: "Michael Rodriguez",
    role: "Director - US Operations",
    credentials: "CPA, MBA",
    bio: "Expert in US federal and state taxation for multinational corporations.",
    region: "United States",
  },
  {
    name: "Fatima Al-Rashid",
    role: "Director - GCC Operations",
    credentials: "CPA, SOCPA",
    bio: "Leading authority on VAT implementation and Zakat compliance in the Gulf.",
    region: "Saudi Arabia & UAE",
  },
  {
    name: "Dr. James Chen",
    role: "Chief Technology Officer",
    credentials: "PhD, MIT",
    bio: "AI researcher turned fintech innovator. Leading our AI agent development.",
    region: "Global",
  },
  {
    name: "Priya Sharma",
    role: "Head of Client Success",
    credentials: "MBA, PMP",
    bio: "Ensuring exceptional client experiences across all our markets.",
    region: "Global",
  },
];

const stats = [
  { value: "—", label: "Enterprise Clients", comingSoon: true },
  { value: "5", label: "Countries", comingSoon: false },
  { value: "—", label: "Professionals", comingSoon: true },
  { value: "—", label: "Accuracy Rate", comingSoon: true },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">About Us</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Pioneering the Future of Accountancy
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              We're a global chartered accountancy firm that combines decades of professional expertise
              with cutting-edge AI technology to deliver unparalleled financial services.
            </p>
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
                  <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-muted-foreground">
                    {stat.label}
                    {stat.comingSoon && <span className="block text-xs text-primary/60">Coming Soon</span>}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <AnimatedSection>
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6">
                    <Target className="h-7 w-7" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                  <p className="text-muted-foreground">
                    To democratize access to world-class chartered accountancy services through
                    the intelligent application of AI technology, enabling businesses of all sizes
                    to navigate complex tax regulations and financial requirements with confidence.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6">
                    <Eye className="h-7 w-7" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                  <p className="text-muted-foreground">
                    To be the global leader in AI-powered chartered accountancy, setting new
                    standards for accuracy, efficiency, and client service in the financial
                    services industry across all markets we serve.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide every interaction and decision at Taxable AI.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <AnimatedSection key={value.title} delay={index * 0.1}>
                <Card className="h-full text-center">
                  <CardContent className="p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto mb-4">
                      <value.icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From a Karachi startup to a global AI-powered accountancy firm.
            </p>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 transform md:-translate-x-1/2" />
              {milestones.map((milestone, index) => (
                <AnimatedSection key={milestone.year} delay={index * 0.1}>
                  <div className={`relative flex items-center mb-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2" />
                    <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8 md:text-right'}`}>
                      <Badge className="mb-2">{milestone.year}</Badge>
                      <p className="text-muted-foreground">{milestone.event}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Leadership Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the experts driving innovation and excellence at Taxable AI.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <AnimatedSection key={member.name} delay={index * 0.1}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold mb-4">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-primary text-sm mb-1">{member.role}</p>
                    <p className="text-xs text-muted-foreground mb-3">{member.credentials}</p>
                    <p className="text-sm text-muted-foreground mb-3">{member.bio}</p>
                    <Badge variant="outline" className="text-xs">{member.region}</Badge>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Certifications & Affiliations</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We maintain the highest professional standards across all jurisdictions.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
            {[
              { name: "ICAP", full: "Institute of Chartered Accountants Pakistan" },
              { name: "ICAEW", full: "Institute of Chartered Accountants England & Wales" },
              { name: "AICPA", full: "American Institute of CPAs" },
              { name: "SOCPA", full: "Saudi Organization for CPAs" },
              { name: "AAA", full: "Accountants & Auditors Association UAE" },
            ].map((cert, index) => (
              <AnimatedSection key={cert.name} delay={index * 0.1}>
                <Card className="text-center h-full">
                  <CardContent className="p-6">
                    <Award className="h-8 w-8 text-primary mx-auto mb-3" />
                    <p className="font-semibold">{cert.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{cert.full}</p>
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
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Work with Us?</h2>
            <p className="text-muted-foreground mb-8">
              Join hundreds of businesses that trust Taxable AI for their financial needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">
                  Contact Our Team
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
    </>
  );
}
