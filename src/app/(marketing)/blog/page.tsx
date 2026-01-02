import { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

export const metadata: Metadata = {
  title: "Blog - Tax, Accounting & AI Insights",
  description: "Expert insights on taxation, accounting, AI in finance, and regulatory updates for Pakistan, UK, USA, Saudi Arabia, and UAE businesses.",
  keywords: ["tax blog", "accounting insights", "AI accounting", "FBR updates", "HMRC news", "IRS updates", "ZATCA VAT", "UAE corporate tax"],
};

const categories = [
  { name: "All", slug: "all" },
  { name: "Taxation", slug: "taxation" },
  { name: "AI & Technology", slug: "ai-technology" },
  { name: "Audits", slug: "audits" },
  { name: "Accounting", slug: "accounting" },
  { name: "Regional Updates", slug: "regional" },
];

const featuredPost = {
  slug: "uae-corporate-tax-guide-2024",
  title: "Complete Guide to UAE Corporate Tax 2024: What Businesses Need to Know",
  excerpt: "The UAE's new 9% corporate tax regime is now in effect. Learn about registration requirements, exemptions, compliance deadlines, and how AI can streamline your tax processes.",
  category: "Taxation",
  region: "UAE",
  date: "January 2, 2026",
  readTime: "12 min read",
  featured: true,
};

const posts = [
  {
    slug: "ai-document-processing-accounting",
    title: "How AI Document Processing is Revolutionizing Accounting",
    excerpt: "Discover how artificial intelligence is transforming bank statement analysis, invoice processing, and financial data extraction for modern businesses.",
    category: "AI & Technology",
    date: "January 1, 2026",
    readTime: "8 min read",
  },
  {
    slug: "pakistan-fbr-tax-updates-2026",
    title: "Pakistan FBR Tax Updates for 2026: Key Changes for Businesses",
    excerpt: "A comprehensive overview of the latest Federal Board of Revenue tax regulations, filing deadlines, and compliance requirements for Pakistani businesses.",
    category: "Taxation",
    region: "Pakistan",
    date: "December 28, 2025",
    readTime: "10 min read",
  },
  {
    slug: "uk-r-and-d-tax-credits-guide",
    title: "Maximizing UK R&D Tax Credits: A Complete Guide for Tech Companies",
    excerpt: "Learn how to identify qualifying R&D activities, calculate your claim, and navigate HMRC requirements to maximize your innovation tax relief.",
    category: "Taxation",
    region: "UK",
    date: "December 25, 2025",
    readTime: "15 min read",
  },
  {
    slug: "zatca-einvoicing-phase-2",
    title: "ZATCA E-Invoicing Phase 2: Integration Requirements and Best Practices",
    excerpt: "Everything you need to know about Saudi Arabia's FATOORA e-invoicing Phase 2 integration, including technical specifications and compliance tips.",
    category: "Regional Updates",
    region: "Saudi Arabia",
    date: "December 22, 2025",
    readTime: "11 min read",
  },
  {
    slug: "ai-chatbots-tax-advisory",
    title: "AI Chatbots in Tax Advisory: 24/7 Client Support Revolution",
    excerpt: "How AI-powered chatbots are providing instant tax guidance, improving client satisfaction, and freeing up accountants for strategic work.",
    category: "AI & Technology",
    date: "December 20, 2025",
    readTime: "7 min read",
  },
  {
    slug: "us-multi-state-taxation-guide",
    title: "Navigating US Multi-State Taxation: A Guide for Growing Businesses",
    excerpt: "Understanding nexus rules, state tax obligations, and compliance strategies for businesses operating across multiple US states.",
    category: "Taxation",
    region: "USA",
    date: "December 18, 2025",
    readTime: "14 min read",
  },
  {
    slug: "internal-audit-best-practices",
    title: "Internal Audit Best Practices for 2026: Risk-Based Approach",
    excerpt: "Modern internal audit methodologies, risk assessment frameworks, and how technology is enhancing audit efficiency and effectiveness.",
    category: "Audits",
    date: "December 15, 2025",
    readTime: "9 min read",
  },
  {
    slug: "cloud-accounting-security",
    title: "Cloud Accounting Security: Protecting Your Financial Data",
    excerpt: "Essential security measures, compliance standards, and best practices for businesses using cloud-based accounting solutions.",
    category: "Accounting",
    date: "December 12, 2025",
    readTime: "8 min read",
  },
];

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">Insights & Updates</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tax, Accounting & AI Blog
            </h1>
            <p className="text-xl text-muted-foreground">
              Expert insights on taxation, regulatory updates, AI in finance, and best practices
              for businesses across Pakistan, UK, USA, Saudi Arabia, and UAE.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b sticky top-16 bg-background/95 backdrop-blur z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <Badge
                key={cat.slug}
                variant={cat.slug === "all" ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {cat.name}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <Link href={`/blog/${featuredPost.slug}`}>
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-background p-8 md:p-12 flex items-center justify-center">
                    <div className="text-center">
                      <Badge className="mb-4">Featured</Badge>
                      <div className="text-6xl mb-4">📊</div>
                      <Badge variant="outline">{featuredPost.region}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="secondary">{featuredPost.category}</Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {featuredPost.date}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {featuredPost.readTime}
                      </span>
                      <span className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read Article
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <AnimatedSection key={post.slug} delay={index * 0.1}>
                <Link href={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                        {post.region && (
                          <Badge variant="outline" className="text-xs">
                            {post.region}
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter for the latest tax updates, regulatory changes,
              and AI innovations in accounting.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
              />
              <Button>Subscribe</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              No spam, unsubscribe anytime. Read our privacy policy.
            </p>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
