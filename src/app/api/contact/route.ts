import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";
import { queryOne } from "@/lib/db/pool";
import { sendLeadNotification } from "@/lib/email/gmail";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: true, code: "VALIDATION_ERROR", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;
    const lead = await queryOne<{ id: string }>(
      `INSERT INTO leads (name, email, phone, company, jurisdiction, service_interest, message, source)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'contact_form') RETURNING id`,
      [data.name, data.email, data.phone ?? null, data.company ?? null,
       data.region ?? null, data.serviceInterest ?? null, data.message]
    );

    // Non-blocking email notification
    sendLeadNotification({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      jurisdiction: (data.region as "usa" | "uk" | "saudi" | "pakistan") ?? undefined,
      service_interest: data.serviceInterest,
      message: data.message,
      source: "contact_form",
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      message: "Thank you for your inquiry. We'll be in touch within 24 hours.",
      referenceId: lead?.id,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: true, code: "SERVER_ERROR", message: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
