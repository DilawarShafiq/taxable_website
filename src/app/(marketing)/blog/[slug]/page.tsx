import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, Share2, Bookmark, Tag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

// Blog posts data - in production, this would come from a CMS
const blogPosts: Record<string, {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  region?: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  tags: string[];
}> = {
  "uae-corporate-tax-guide-2024": {
    title: "Complete Guide to UAE Corporate Tax 2024: What Businesses Need to Know",
    excerpt: "The UAE's new 9% corporate tax regime is now in effect. Learn about registration requirements, exemptions, compliance deadlines, and how AI can streamline your tax processes.",
    category: "Taxation",
    region: "UAE",
    author: "Rashid Khalifa",
    authorRole: "Tax Director, UAE",
    date: "January 2, 2026",
    readTime: "12 min read",
    tags: ["UAE Corporate Tax", "FTA", "Tax Compliance", "Business Tax"],
    content: `
## Introduction to UAE Corporate Tax

The United Arab Emirates has introduced a federal corporate tax (CT) regime, marking a significant shift in the country's fiscal landscape. Effective for financial years starting on or after June 1, 2023, this new tax system brings the UAE in line with international standards while maintaining its competitive edge.

## Key Features of UAE Corporate Tax

### Tax Rate Structure

- **0%** on taxable income up to AED 375,000
- **9%** on taxable income exceeding AED 375,000
- **Different rates** may apply to large multinationals meeting specific criteria

### Who Needs to Register?

All UAE businesses need to assess their corporate tax obligations:

1. **Mainland Companies** - Subject to CT on worldwide income
2. **Free Zone Companies** - May qualify for 0% rate on qualifying income
3. **Foreign Companies** - Taxable on UAE-sourced income

## Free Zone Benefits

Qualifying Free Zone Persons can benefit from a 0% corporate tax rate on qualifying income, provided they:

- Maintain adequate substance in the UAE
- Derive qualifying income
- Comply with transfer pricing requirements
- Have not elected to be subject to CT at standard rates

## Compliance Requirements

### Registration Timeline

- Businesses must register with the Federal Tax Authority (FTA)
- Registration deadlines vary based on business establishment date
- Penalties apply for late registration

### Filing Obligations

- Annual tax returns required within 9 months of financial year end
- Transfer pricing documentation for related party transactions
- Proper record keeping for minimum 7 years

## How AI Streamlines Corporate Tax Compliance

At Taxable AI, we leverage artificial intelligence to simplify your corporate tax journey:

- **Automated Data Extraction** - Our AI processes financial documents instantly
- **Real-time Compliance Monitoring** - Stay updated with regulatory changes
- **Smart Tax Calculations** - Accurate computation of tax liabilities
- **Documentation Management** - Organized record keeping for audits

## Action Steps for Businesses

1. Assess your corporate tax position
2. Register with the FTA before deadlines
3. Review your corporate structure for optimization
4. Implement proper accounting systems
5. Consider professional advisory support

## Conclusion

The UAE's corporate tax regime represents a new era for businesses operating in the Emirates. With proper planning and the right technology partner, compliance can be straightforward and even advantageous.

---

*Need help with UAE Corporate Tax? Contact our Dubai team at uae@taxable.ai for a free consultation.*
    `,
  },
  "ai-document-processing-accounting": {
    title: "How AI Document Processing is Revolutionizing Accounting",
    excerpt: "Discover how artificial intelligence is transforming bank statement analysis, invoice processing, and financial data extraction for modern businesses.",
    category: "AI & Technology",
    author: "Dr. James Chen",
    authorRole: "Chief Technology Officer",
    date: "January 1, 2026",
    readTime: "8 min read",
    tags: ["AI", "Document Processing", "Automation", "Machine Learning"],
    content: `
## The AI Revolution in Accounting

Artificial Intelligence is transforming how accountants and finance professionals work. What once took hours of manual data entry can now be accomplished in seconds with AI-powered document processing.

## Understanding AI Document Processing

AI document processing uses machine learning algorithms to:

- **Extract data** from unstructured documents
- **Categorize transactions** automatically
- **Identify patterns** and anomalies
- **Generate insights** from financial data

## Key Applications in Accounting

### Bank Statement Processing

Our AI Document Agent can process bank statements in seconds:

1. Upload your PDF statement
2. AI extracts all transactions
3. Automatic categorization applied
4. Summary report generated

### Invoice Processing

- Automatic vendor identification
- Line item extraction
- Payment term recognition
- Three-way matching automation

### Receipt Scanning

- Mobile capture and processing
- Expense category assignment
- VAT/GST extraction
- Integration with accounting systems

## Benefits for Your Business

### Time Savings

- Reduce manual data entry by 90%
- Process documents 24/7
- Faster month-end close

### Accuracy Improvements

- Eliminate human error
- Consistent categorization
- Audit-ready documentation

### Cost Reduction

- Lower processing costs per document
- Reduced staffing requirements
- Faster client turnaround

## Real-World Results

Businesses using Taxable AI's document processing report:

- **60% reduction** in processing time
- **99.5% accuracy** in data extraction
- **40% cost savings** on document handling

## Getting Started

Try our free demo at [/demo](/demo) to experience AI document processing firsthand. Upload any bank statement and see the results instantly.

---

*Ready to transform your document processing? Contact us at hello@taxable.ai*
    `,
  },
  "pakistan-fbr-tax-updates-2026": {
    title: "Pakistan FBR Tax Updates for 2026: Key Changes for Businesses",
    excerpt: "A comprehensive overview of the latest Federal Board of Revenue tax regulations, filing deadlines, and compliance requirements for Pakistani businesses.",
    category: "Taxation",
    region: "Pakistan",
    author: "Bilal Ahmed",
    authorRole: "Tax Partner, Pakistan",
    date: "December 28, 2025",
    readTime: "10 min read",
    tags: ["FBR", "Pakistan Tax", "Income Tax", "Sales Tax", "Withholding Tax"],
    content: `
## FBR Tax Updates for 2026

The Federal Board of Revenue (FBR) has introduced several important changes for the 2026 tax year. This guide covers everything Pakistani businesses need to know to stay compliant.

## Income Tax Changes

### Corporate Tax Rates

The corporate tax structure for 2026:

- **Banking companies**: 39%
- **Other companies**: 29%
- **Small companies**: 20%
- **Super tax**: Additional levy on high earners

### Individual Tax Slabs

Updated income tax slabs for salaried individuals with progressive rates from 0% to 35%.

## Sales Tax Updates

### Standard Rate

- Sales tax remains at **17%** for general goods
- Reduced rates apply to essential items
- Zero-rating for exports maintained

### E-Invoicing Requirements

FBR's electronic invoicing system continues expansion:

- Real-time invoice reporting
- Integration with Point of Sale systems
- Penalties for non-compliance

## Withholding Tax Regime

### Key WHT Categories

1. **Imports**: Various rates based on goods category
2. **Contracts**: 7.5% for filers, 15% for non-filers
3. **Services**: 8% for filers, 16% for non-filers
4. **Dividends**: 15% standard rate

## Filing Deadlines

| Return Type | Due Date |
|------------|----------|
| Income Tax (Individuals) | September 30 |
| Income Tax (Companies) | December 31 |
| Sales Tax Monthly | 18th of following month |
| Withholding Statements | Quarterly |

## Compliance Best Practices

### For Businesses

1. Maintain proper documentation
2. File returns on time
3. Reconcile withholding taxes
4. Keep CNIC/NTN records updated

### For Individuals

1. Register in IRIS portal
2. Track income from all sources
3. Claim applicable deductions
4. File as Active Taxpayer

## How Taxable AI Helps

Our ICAP-certified team provides:

- Complete FBR compliance support
- Tax planning and optimization
- Audit representation
- Real-time regulatory updates

---

*Need FBR compliance support? Contact our Pakistan office at pakistan@taxable.ai*
    `,
  },
  "uk-r-and-d-tax-credits-guide": {
    title: "Maximizing UK R&D Tax Credits: A Complete Guide for Tech Companies",
    excerpt: "Learn how to identify qualifying R&D activities, calculate your claim, and navigate HMRC requirements to maximize your innovation tax relief.",
    category: "Taxation",
    region: "UK",
    author: "Sarah Mitchell",
    authorRole: "Director, UK Operations",
    date: "December 25, 2025",
    readTime: "15 min read",
    tags: ["R&D Tax Credits", "HMRC", "Innovation", "Tax Relief", "UK Tax"],
    content: `
## Understanding UK R&D Tax Credits

R&D tax credits are one of the most valuable tax incentives available to innovative UK businesses. Companies can claim significant tax relief for qualifying research and development activities.

## Who Can Claim?

Any UK company that undertakes qualifying R&D activities can potentially claim, including:

- Technology companies
- Manufacturing businesses
- Life sciences organizations
- Engineering firms
- Any company solving technical problems

## What Qualifies as R&D?

### The Key Tests

1. **Advance in Science or Technology** - Seeking an advancement in the overall field
2. **Technical Uncertainty** - Uncertainty exists at the start
3. **Resolution Required** - Competent professionals cannot easily resolve
4. **Systematic Investigation** - Methodical approach to finding solutions

### Qualifying Activities

- Developing new products or services
- Improving existing products
- Developing new processes
- Overcoming technical challenges

## Types of R&D Relief

### SME Scheme

For small and medium enterprises:

- Enhanced deduction of **186%** of qualifying costs
- Or surrenderable tax credit of up to **10%**

### RDEC Scheme

For larger companies:

- Above-the-line credit of **20%**
- Visible in accounts as income

## Calculating Your Claim

### Qualifying Costs

1. **Staff costs** - Salaries, NI, pension
2. **Subcontractor costs** - External R&D work
3. **Consumables** - Materials used in R&D
4. **Software** - Licenses for R&D activities
5. **Utilities** - Power, water, fuel for R&D

### Example Calculation

For an SME spending £100,000 on qualifying R&D:

- Enhanced deduction: £186,000
- Tax saving at 25%: £46,500

## Common Mistakes to Avoid

1. Not claiming all eligible costs
2. Poor project documentation
3. Missing subsidy interactions
4. Inadequate technical narratives
5. Late submission

## Our R&D Tax Credit Service

Taxable AI helps UK companies maximize their R&D claims:

- **Identify** all qualifying activities
- **Calculate** optimal claim amounts
- **Prepare** technical narratives
- **Submit** to HMRC
- **Defend** claims if enquired

### Our Track Record

- £50M+ claimed for clients
- 100% success rate on submissions
- Average claim: £75,000

---

*Think you might qualify for R&D tax credits? Contact uk@taxable.ai for a free assessment.*
    `,
  },
  "zatca-einvoicing-phase-2": {
    title: "ZATCA E-Invoicing Phase 2: Integration Requirements and Best Practices",
    excerpt: "Everything you need to know about Saudi Arabia's FATOORA e-invoicing Phase 2 integration, including technical specifications and compliance tips.",
    category: "Regional Updates",
    region: "Saudi Arabia",
    author: "Mohammed Al-Rashid",
    authorRole: "VAT Director, Saudi Arabia",
    date: "December 22, 2025",
    readTime: "11 min read",
    tags: ["ZATCA", "E-Invoicing", "FATOORA", "Saudi Arabia", "VAT"],
    content: `
## ZATCA E-Invoicing Phase 2 Overview

Saudi Arabia's Zakat, Tax and Customs Authority (ZATCA) has implemented mandatory e-invoicing in two phases. Phase 2, known as the "Integration Phase," requires businesses to connect their systems directly with ZATCA's FATOORA platform.

## Phase 2 Requirements

### Technical Integration

- Real-time invoice submission to ZATCA
- API-based connection to FATOORA platform
- Cryptographic stamping of invoices
- UUID generation for each invoice

### Invoice Types

1. **Standard Tax Invoice** - B2B transactions
2. **Simplified Tax Invoice** - B2C transactions
3. **Credit Notes** - For returns and adjustments
4. **Debit Notes** - For additional charges

## Compliance Timeline

Phase 2 is being rolled out in waves:

- **Wave 1**: Revenue > SAR 3 billion (Completed)
- **Wave 2**: Revenue > SAR 500 million (Completed)
- **Wave 3**: Revenue > SAR 250 million (Current)
- **Wave 4-6**: Smaller businesses (Upcoming)

## Technical Specifications

### Invoice Format

- XML-based UBL 2.1 standard
- Arabic and English supported
- Mandatory QR code generation
- Digital signature requirements

### Integration Methods

1. Direct API integration
2. Third-party solution providers
3. Cloud-based ERP systems

## Best Practices for Compliance

### System Readiness

1. Assess current invoicing system capabilities
2. Choose appropriate integration method
3. Conduct thorough testing
4. Train staff on new procedures

### Data Quality

- Accurate VAT registration numbers
- Complete buyer/seller information
- Correct tax calculations
- Proper line item details

## How Taxable AI Supports Your Compliance

### E-Invoicing Solutions

- ZATCA-certified integration
- Real-time validation
- Error handling and notifications
- Archive and retrieval

### Implementation Support

- Gap analysis
- System configuration
- Testing and validation
- Go-live support

## Penalties for Non-Compliance

ZATCA can impose significant penalties:

- Warning for first violation
- Fines up to SAR 50,000 for repeated violations
- Publication of violator names

---

*Need ZATCA e-invoicing support? Reach our Riyadh team at ksa@taxable.ai*
    `,
  },
};

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    notFound();
  }

  // Convert markdown-style content to JSX
  const contentParagraphs = post.content.split('\n\n').filter(p => p.trim());

  return (
    <>
      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-3xl mx-auto">
            <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="secondary">{post.category}</Badge>
              {post.region && <Badge variant="outline">{post.region}</Badge>}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-6">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{post.author}</p>
                  <p className="text-xs">{post.authorRole}</p>
                </div>
              </div>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <article className="prose prose-neutral dark:prose-invert max-w-none">
                {contentParagraphs.map((paragraph, index) => {
                  const trimmed = paragraph.trim();

                  if (trimmed.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-2xl font-bold mt-10 mb-4">
                        {trimmed.replace('## ', '')}
                      </h2>
                    );
                  }

                  if (trimmed.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-xl font-semibold mt-8 mb-3">
                        {trimmed.replace('### ', '')}
                      </h3>
                    );
                  }

                  if (trimmed.startsWith('- ') || trimmed.startsWith('1. ')) {
                    const items = trimmed.split('\n').filter(item => item.trim());
                    const isOrdered = trimmed.startsWith('1. ');
                    const ListTag = isOrdered ? 'ol' : 'ul';
                    return (
                      <ListTag key={index} className={`${isOrdered ? 'list-decimal' : 'list-disc'} pl-6 my-4 space-y-2`}>
                        {items.map((item, i) => (
                          <li key={i} className="text-muted-foreground">
                            {item.replace(/^[-\d.]+\s*\*?\*?/, '').replace(/\*\*/g, '')}
                          </li>
                        ))}
                      </ListTag>
                    );
                  }

                  if (trimmed.startsWith('|')) {
                    return null; // Skip tables for simplicity
                  }

                  if (trimmed.startsWith('---')) {
                    return <hr key={index} className="my-8 border-border" />;
                  }

                  if (trimmed.startsWith('*') && trimmed.endsWith('*')) {
                    return (
                      <p key={index} className="text-muted-foreground italic my-4">
                        {trimmed.replace(/^\*|\*$/g, '')}
                      </p>
                    );
                  }

                  return (
                    <p key={index} className="text-muted-foreground my-4 leading-relaxed">
                      {trimmed}
                    </p>
                  );
                })}
              </article>
            </AnimatedSection>

            {/* Tags */}
            <AnimatedSection delay={0.1}>
              <div className="mt-12 pt-8 border-t">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Share & CTA */}
            <AnimatedSection delay={0.2}>
              <Card className="mt-8 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold mb-1">Need help with {post.category.toLowerCase()}?</h3>
                      <p className="text-sm text-muted-foreground">
                        Our experts are ready to assist you.
                      </p>
                    </div>
                    <Link href="/contact">
                      <Button>Get in Touch</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
