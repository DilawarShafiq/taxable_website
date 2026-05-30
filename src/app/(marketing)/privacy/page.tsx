import { Metadata } from "next";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Taxable AI Privacy Policy - Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <AnimatedSection className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              Taxable AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when you use our services across all
              our operating regions: Pakistan, United Kingdom, United States, Saudi Arabia, and United Arab Emirates.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-medium mt-6 mb-3">2.1 Personal Information</h3>
            <p className="text-muted-foreground mb-4">
              We may collect personal information that you voluntarily provide, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
              <li>Name, email address, and phone number</li>
              <li>Company name and business details</li>
              <li>Financial documents and tax information</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">2.2 Automatically Collected Information</h3>
            <p className="text-muted-foreground mb-4">
              When you access our services, we may automatically collect:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Usage patterns and preferences</li>
              <li>Cookies and similar technologies</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">We use collected information to:</p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
              <li>Provide and maintain our chartered accountancy services</li>
              <li>Process your tax filings and financial documents</li>
              <li>Communicate with you about our services</li>
              <li>Improve our AI-powered tools and user experience</li>
              <li>Comply with legal obligations in all operating jurisdictions</li>
              <li>Protect against fraud and unauthorized access</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
              <li>256-bit SSL/TLS encryption for data in transit</li>
              <li>AES-256 encryption for data at rest</li>
              <li>Enterprise-grade cloud infrastructure with security controls</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and employee training</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Retention</h2>
            <p className="text-muted-foreground mb-4">
              We retain your personal information for as long as necessary to provide our services and comply
              with legal requirements. Tax-related documents are typically retained for 7 years in accordance
              with regulatory requirements across our operating jurisdictions.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. International Data Transfers</h2>
            <p className="text-muted-foreground mb-4">
              As a global firm, your data may be processed in countries where we operate. We ensure appropriate
              safeguards are in place for cross-border transfers, including Standard Contractual Clauses and
              compliance with local data protection laws.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Your Rights</h2>
            <p className="text-muted-foreground mb-4">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to or restrict processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Regional Compliance</h2>
            <h3 className="text-xl font-medium mt-6 mb-3">8.1 GDPR (UK/EU)</h3>
            <p className="text-muted-foreground mb-4">
              For UK clients, we comply with the UK GDPR and Data Protection Act 2018.
            </p>
            <h3 className="text-xl font-medium mt-6 mb-3">8.2 CCPA (USA)</h3>
            <p className="text-muted-foreground mb-4">
              California residents have additional rights under the CCPA, including the right to know and
              the right to delete.
            </p>
            <h3 className="text-xl font-medium mt-6 mb-3">8.3 PDPL (Saudi Arabia)</h3>
            <p className="text-muted-foreground mb-4">
              We comply with the Saudi Personal Data Protection Law for our KSA operations.
            </p>
            <h3 className="text-xl font-medium mt-6 mb-3">8.4 PDPL (UAE)</h3>
            <p className="text-muted-foreground mb-4">
              We adhere to the UAE Federal Decree-Law No. 45 of 2021 on Personal Data Protection.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              For privacy-related inquiries, please contact our Data Protection Officer:
            </p>
            <p className="text-muted-foreground mb-4">
              Email: hello@taxable.ai<br />
              Address: Contact our nearest regional office
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to This Policy</h2>
            <p className="text-muted-foreground mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material changes
              by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
