import { NextRequest, NextResponse } from "next/server";

// Knowledge base for the chatbot
const knowledgeBase = {
  services: {
    taxation: "Our taxation services include tax planning, compliance, and optimization across all jurisdictions we serve. We handle income tax, corporate tax, VAT/GST, and specialized tax advisory for individuals and businesses.",
    audits: "We provide comprehensive audit services including statutory audits, internal audits, due diligence, and special purpose audits. Our team is certified by ICAP, ICAEW, AICPA, SOCPA, and AAA.",
    accounting: "Our accounting services cover bookkeeping, financial reporting, payroll processing, and management accounts. We use AI-powered tools to ensure accuracy and efficiency.",
    ai: "Our AI agents include Tax Agent, Spreadsheet Agent, Document Agent, Bookkeeping Agent, Chat Agent, and Analytics Agent. Each is designed to automate and enhance specific accounting tasks.",
  },
  regions: {
    pakistan: "In Pakistan, we're based in Karachi and serve clients nationwide. We're ICAP certified and specialize in FBR compliance, income tax, and sales tax services.",
    uk: "Our UK office is in London. We're ICAEW and ACCA certified, offering HMRC compliance, corporation tax, VAT, and R&D tax credits.",
    usa: "We operate from New York and serve clients across all 50 states. Our CPAs handle IRS compliance, federal and state taxes, and international tax planning.",
    saudiarabia: "Our Riyadh office provides ZATCA VAT compliance, Zakat services, and SOCPA-certified audit services aligned with Vision 2030.",
    uae: "Based in Dubai, we offer FTA VAT compliance, the new Corporate Tax advisory, and services across all Emirates and Free Zones.",
  },
  demo: "You can try our AI document processing demo at /demo. Upload any bank statement PDF and watch our AI extract, categorize, and summarize transactions instantly. No signup required!",
  contact: "You can reach us through our contact form at /contact, or email us at hello@taxable.ai. We have offices in Pakistan, UK, USA, Saudi Arabia, and UAE with local phone numbers.",
  consultation: "To schedule a consultation, visit our contact page at /contact and fill out the form. Select your service interest and region, and we'll get back to you within 24 hours.",
};

// Simple intent matching
function matchIntent(message: string): string {
  const lower = message.toLowerCase();

  // Service intents
  if (lower.includes("tax") && (lower.includes("service") || lower.includes("help") || lower.includes("offer"))) {
    return knowledgeBase.services.taxation;
  }
  if (lower.includes("audit")) {
    return knowledgeBase.services.audits;
  }
  if (lower.includes("account") || lower.includes("bookkeep")) {
    return knowledgeBase.services.accounting;
  }
  if (lower.includes("ai") && (lower.includes("agent") || lower.includes("process") || lower.includes("document"))) {
    return knowledgeBase.services.ai;
  }

  // Region intents
  if (lower.includes("pakistan") || lower.includes("karachi") || lower.includes("fbr") || lower.includes("icap")) {
    return knowledgeBase.regions.pakistan;
  }
  if (lower.includes("uk") || lower.includes("london") || lower.includes("hmrc") || lower.includes("britain") || lower.includes("england")) {
    return knowledgeBase.regions.uk;
  }
  if (lower.includes("usa") || lower.includes("america") || lower.includes("irs") || lower.includes("united states")) {
    return knowledgeBase.regions.usa;
  }
  if (lower.includes("saudi") || lower.includes("riyadh") || lower.includes("zatca") || lower.includes("ksa")) {
    return knowledgeBase.regions.saudiarabia;
  }
  if (lower.includes("uae") || lower.includes("dubai") || lower.includes("emirates") || lower.includes("fta")) {
    return knowledgeBase.regions.uae;
  }

  // General intents
  if (lower.includes("region") || lower.includes("countr") || lower.includes("where") || lower.includes("location") || lower.includes("office")) {
    return "We operate in 5 countries: Pakistan (Karachi), United Kingdom (London), United States (New York), Saudi Arabia (Riyadh), and UAE (Dubai). Each office has local experts certified by regional accounting bodies.";
  }
  if (lower.includes("demo") || lower.includes("try") || lower.includes("test")) {
    return knowledgeBase.demo;
  }
  if (lower.includes("contact") || lower.includes("reach") || lower.includes("email") || lower.includes("phone")) {
    return knowledgeBase.contact;
  }
  if (lower.includes("consult") || lower.includes("meeting") || lower.includes("appointment") || lower.includes("schedule")) {
    return knowledgeBase.consultation;
  }
  if (lower.includes("price") || lower.includes("cost") || lower.includes("fee") || lower.includes("how much")) {
    return "Our pricing depends on the services you need and the complexity of your requirements. We offer competitive rates tailored to each client. For a personalized quote, please schedule a free consultation through our contact page at /contact.";
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return "Hello! I'm here to help you with any questions about our taxation, accounting, and audit services. What would you like to know?";
  }
  if (lower.includes("thank")) {
    return "You're welcome! Is there anything else I can help you with regarding our services?";
  }
  if (lower.includes("service") || lower.includes("what do you") || lower.includes("offer")) {
    return "We offer three main service categories:\n\n1. **Taxation** - Tax planning, compliance, and optimization\n2. **Audits** - Statutory, internal, and due diligence audits\n3. **Accounting** - Bookkeeping, financial reporting, and payroll\n\nAll enhanced by our AI agents for maximum efficiency. Which service interests you?";
  }

  // Default response
  return "I'd be happy to help with that! For the most accurate assistance, you might want to:\n\n1. Ask about our specific services (taxation, audits, accounting)\n2. Inquire about a particular region (Pakistan, UK, USA, Saudi Arabia, UAE)\n3. Try our AI demo at /demo\n4. Schedule a consultation at /contact\n\nIs there something specific you'd like to know?";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: true, message: "Message is required" },
        { status: 400 }
      );
    }

    // In production, you would integrate with an AI service like OpenAI
    // For now, use rule-based responses
    const response = matchIntent(message);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      {
        error: true,
        message: "An error occurred processing your message.",
      },
      { status: 500 }
    );
  }
}
