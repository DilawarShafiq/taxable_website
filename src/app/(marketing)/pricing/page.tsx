import { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight, Zap, Shield, Globe, MessageSquare, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

export const metadata: Metadata = {
  title: "Pricing - Taxable AI",
  description: "Simple, usage-based pricing for AI-powered chartered accountancy services. Pay only for what you use — credits consumed per AI query.",
};

const plans = [
  {
    name: "Free",
    tagline: "Try before you commit",
    price: "$0",
    period: "/month",
    credits: "100 credits included",
    description: "Enough to explore AI tax guidance across all 5 jurisdictions.",
    features: [
      "100 AI credits per month",
      "Website chatbot (5 messages)",
      "Client portal AI assistant",
      "Tax Q&A across all 5 jurisdictions",
      "Compliance deadline reminders",
      "Document upload (1 document/month)",
    ],
    cta: "Start Free",
    href: "/auth/register",
    highlight: false,
    badge: null,
  },
  {
    name: "Growth",
    tagline: "For freelancers & small businesses",
    price: "$29",
    period: "/month",
    credits: "2,000 credits included",
    description: "Full AI assistant, document analysis, and compliance tools.",
    features: [
      "2,000 AI credits/month",
      "Rollover unused credits (up to 1,000)",
      "Unlimited AI assistant conversations",
      "Document upload & analysis (20/month)",
      "Multi-jurisdiction tax advice",
      "Real-time compliance monitoring",
      "Asset & investment dashboard",
      "CA review on complex queries",
      "Priority email support",
    ],
    cta: "Get Started",
    href: "/auth/register",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Scale",
    tagline: "For growing businesses",
    price: "$99",
    period: "/month",
    credits: "10,000 credits included",
    description: "High-volume AI usage with dedicated CA oversight.",
    features: [
      "10,000 AI credits/month",
      "Everything in Growth",
      "Unlimited document uploads",
      "Dedicated chartered accountant",
      "Tax return review & advisory",
      "Multi-entity management",
      "Transfer pricing support",
      "Custom integrations",
      "SLA: 4-hour response time",
    ],
    cta: "Get Started",
    href: "/auth/register",
    highlight: false,
    badge: null,
  },
];

const topUpPacks = [
  { credits: "500 credits", price: "$9", perCredit: "$0.018" },
  { credits: "2,000 credits", price: "$29", perCredit: "$0.0145" },
  { credits: "10,000 credits", price: "$119", perCredit: "$0.0119" },
];

const creditCosts = [
  { action: "Website chatbot message (Haiku)", cost: "1 credit" },
  { action: "AI assistant query (Sonnet)", cost: "5 credits" },
  { action: "Extended thinking / deep analysis", cost: "15 credits" },
  { action: "Document analysis (per page)", cost: "3 credits" },
  { action: "Compliance report generation", cost: "8 credits" },
  { action: "Market data refresh", cost: "2 credits" },
];

const faqs = [
  {
    q: "What is a credit?",
    a: "Credits are consumed when you use AI features. A simple chatbot message costs 1 credit; a deep multi-agent analysis uses more. Credits allow you to pay proportionally for the AI compute you actually use.",
  },
  {
    q: "What happens when I run out of credits?",
    a: "You can top up with a credit pack at any time, or upgrade your plan. Your account and data remain intact — you just can't send new AI queries until topped up.",
  },
  {
    q: "Do unused credits roll over?",
    a: "Growth plan: up to 1,000 credits roll over each month. Scale plan: unlimited rollover. Free plan: credits reset monthly.",
  },
  {
    q: "Which jurisdictions are covered?",
    a: "Pakistan (FBR), UK (HMRC), USA (IRS), Saudi Arabia (ZATCA), and UAE (FTA). Our chartered accountants hold credentials from ICAP, ICAEW, AICPA, SOCPA, and AAA.",
  },
  {
    q: "Is my financial data secure?",
    a: "Yes. All data is encrypted in transit and at rest. We are GDPR compliant. We never share your financial data with third parties.",
  },
  {
    q: "Do you handle actual tax filings?",
    a: "The Scale plan includes CA review and tax return advisory. For full filing and submission across jurisdictions, contact us for an Enterprise quote.",
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">Usage-Based Pricing</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Pay for What You Use
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Credits consumed per AI query — simple, transparent, no lock-in.
              Start free, top up when you need more.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Plans */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <AnimatedSection key={plan.name} delay={index * 0.1}>
                <Card className={`h-full relative flex flex-col ${plan.highlight ? "border-primary shadow-lg shadow-primary/10" : ""}`}>
                  {plan.badge && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-4">
                      {plan.badge}
                    </Badge>
                  )}
                  <CardHeader className="pb-4">
                    <div className="mb-2">
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{plan.tagline}</p>
                    </div>
                    <div className="mt-4 flex items-end gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground pb-1">{plan.period}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-primary font-medium mt-1">
                      <Coins className="h-4 w-4" />
                      {plan.credits}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={plan.href} className="w-full">
                      <Button
                        className="w-full"
                        variant={plan.highlight ? "default" : "outline"}
                        size="lg"
                      >
                        {plan.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>

          {/* Enterprise */}
          <AnimatedSection delay={0.3} className="mt-8 max-w-6xl mx-auto">
            <Card className="bg-muted/30">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                    <p className="text-muted-foreground">
                      Custom credit volume, dedicated CA team, full tax compliance management, bespoke AI workflows, and SLA guarantees.
                    </p>
                  </div>
                  <Link href="/contact" className="flex-shrink-0">
                    <Button size="lg">
                      Contact Sales
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* Credit Cost Table */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Credits Are Consumed</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each AI action has a fixed credit cost based on the underlying AI model and compute used.
            </p>
          </AnimatedSection>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Action</th>
                      <th className="text-right p-4 font-semibold">Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creditCosts.map((item, index) => (
                      <tr key={item.action} className={index < creditCosts.length - 1 ? "border-b" : ""}>
                        <td className="p-4 text-muted-foreground">{item.action}</td>
                        <td className="p-4 text-right font-medium text-primary">{item.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Top-up Packs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Top-Up Credit Packs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Need more credits? Buy a pack at any time — credits never expire.
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {topUpPacks.map((pack, index) => (
              <AnimatedSection key={pack.credits} delay={index * 0.1}>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <Coins className="h-8 w-8 text-primary mx-auto mb-3" />
                    <p className="text-2xl font-bold mb-1">{pack.price}</p>
                    <p className="font-medium">{pack.credits}</p>
                    <p className="text-xs text-muted-foreground mt-1">{pack.perCredit} per credit</p>
                    <Link href="/auth/register" className="mt-4 block">
                      <Button variant="outline" size="sm" className="w-full">Buy Pack</Button>
                    </Link>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Zap, title: "Instant Answers", desc: "AI responses in seconds, 24/7 across all 5 jurisdictions" },
              { icon: Shield, title: "CA-Backed", desc: "Every AI response supported by chartered accountants with real credentials" },
              { icon: Globe, title: "5 Countries", desc: "Pakistan, UK, USA, Saudi Arabia, UAE — one platform" },
              { icon: MessageSquare, title: "Multi-Agent", desc: "Specialized AI agents for tax, documents, compliance, and markets" },
            ].map((item, index) => (
              <AnimatedSection key={item.title} delay={index * 0.1}>
                <div className="text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto mb-4">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </AnimatedSection>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <AnimatedSection key={faq.q} delay={index * 0.05}>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
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
            <h2 className="text-3xl font-bold mb-4">Start with 100 Free Credits</h2>
            <p className="text-muted-foreground mb-8">
              No credit card required. Explore AI-powered tax guidance across Pakistan, UK, USA, Saudi Arabia, and UAE.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Talk to a CA
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
