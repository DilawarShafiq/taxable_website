import { Metadata } from "next";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Taxable AI Terms of Service - Read our terms and conditions for using our chartered accountancy services.",
};

export default function TermsPage() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <AnimatedSection className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing or using Taxable AI's services ("Services"), you agree to be bound by these Terms of
              Service ("Terms"). If you do not agree to these Terms, you may not use our Services.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Services</h2>
            <p className="text-muted-foreground mb-4">
              Taxable AI provides AI-powered chartered accountancy services including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
              <li>Taxation services and tax compliance</li>
              <li>Statutory and internal audits</li>
              <li>Accounting and bookkeeping services</li>
              <li>AI-powered document processing</li>
              <li>Financial advisory services</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Professional Services</h2>
            <h3 className="text-xl font-medium mt-6 mb-3">3.1 Engagement</h3>
            <p className="text-muted-foreground mb-4">
              All professional services are subject to a separate engagement letter that will specify the
              scope, fees, and specific terms of the engagement.
            </p>
            <h3 className="text-xl font-medium mt-6 mb-3">3.2 Professional Standards</h3>
            <p className="text-muted-foreground mb-4">
              Our services are provided in accordance with professional standards set by relevant accounting
              bodies including ICAP, ICAEW, AICPA, SOCPA, and AAA.
            </p>
            <h3 className="text-xl font-medium mt-6 mb-3">3.3 Client Responsibilities</h3>
            <p className="text-muted-foreground mb-4">
              Clients are responsible for providing accurate, complete, and timely information necessary
              for us to perform our services.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. AI Services</h2>
            <h3 className="text-xl font-medium mt-6 mb-3">4.1 AI-Powered Tools</h3>
            <p className="text-muted-foreground mb-4">
              Our AI agents and document processing tools are designed to assist with financial analysis
              and automation. While we strive for accuracy, AI outputs should be reviewed by qualified
              professionals.
            </p>
            <h3 className="text-xl font-medium mt-6 mb-3">4.2 Demo Services</h3>
            <p className="text-muted-foreground mb-4">
              Our free demo services are provided for demonstration purposes only and should not be relied
              upon for actual financial decisions.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. User Accounts</h2>
            <p className="text-muted-foreground mb-4">
              If you create an account, you are responsible for:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
              <li>Maintaining the confidentiality of your credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Fees and Payment</h2>
            <p className="text-muted-foreground mb-4">
              Fees for our services are outlined in the engagement letter. Payment terms are typically:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
              <li>Invoices are due within 30 days of issuance</li>
              <li>Late payments may incur interest charges</li>
              <li>We reserve the right to suspend services for non-payment</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Intellectual Property</h2>
            <p className="text-muted-foreground mb-4">
              All content, software, and materials provided through our Services are the property of
              Taxable AI or our licensors and are protected by intellectual property laws.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Confidentiality</h2>
            <p className="text-muted-foreground mb-4">
              We maintain strict confidentiality of all client information in accordance with professional
              ethics and applicable laws. Confidential information will not be disclosed to third parties
              without consent, except as required by law.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              To the maximum extent permitted by law:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
              <li>Our liability is limited to the fees paid for the specific services giving rise to the claim</li>
              <li>We are not liable for indirect, incidental, or consequential damages</li>
              <li>We are not responsible for client decisions based on our advice</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Indemnification</h2>
            <p className="text-muted-foreground mb-4">
              You agree to indemnify and hold harmless Taxable AI from any claims arising from your use
              of our Services, your violation of these Terms, or your infringement of any rights of another.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Termination</h2>
            <p className="text-muted-foreground mb-4">
              Either party may terminate the engagement by providing written notice. Upon termination,
              you remain responsible for fees incurred up to the termination date.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">12. Governing Law</h2>
            <p className="text-muted-foreground mb-4">
              These Terms are governed by the laws of the jurisdiction where the primary services are
              rendered. For cross-border engagements, the governing law will be specified in the
              engagement letter.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">13. Dispute Resolution</h2>
            <p className="text-muted-foreground mb-4">
              Any disputes shall first be attempted to be resolved through good-faith negotiation.
              If unresolved, disputes shall be submitted to arbitration in accordance with the rules
              of the relevant jurisdiction.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">14. Changes to Terms</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to modify these Terms at any time. Material changes will be notified
              via email or through our website. Continued use of Services after changes constitutes
              acceptance of the modified Terms.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">15. Contact</h2>
            <p className="text-muted-foreground mb-4">
              For questions about these Terms, please contact us at:
            </p>
            <p className="text-muted-foreground mb-4">
              Email: legal@taxable.ai<br />
              Address: Contact your nearest regional office
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
