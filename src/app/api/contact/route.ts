import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: true,
          code: "VALIDATION_ERROR",
          message: "Invalid form data",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = result.data;

    // In production, you would send an email here
    // For now, we'll just log it and return success
    console.log("Contact form submission:", {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      serviceInterest: data.serviceInterest,
      region: data.region,
      message: data.message,
      timestamp: new Date().toISOString(),
    });

    // Example email integration (uncomment when API keys are configured):
    //
    // const emailService = process.env.EMAIL_SERVICE;
    // const emailApiKey = process.env.EMAIL_API_KEY;
    //
    // if (emailService === 'resend') {
    //   await fetch('https://api.resend.com/emails', {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${emailApiKey}`,
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       from: process.env.EMAIL_FROM,
    //       to: process.env.EMAIL_TO,
    //       subject: `New Contact Form: ${data.name} - ${data.serviceInterest || 'General'}`,
    //       html: `
    //         <h2>New Contact Form Submission</h2>
    //         <p><strong>Name:</strong> ${data.name}</p>
    //         <p><strong>Email:</strong> ${data.email}</p>
    //         <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
    //         <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
    //         <p><strong>Service Interest:</strong> ${data.serviceInterest || 'Not specified'}</p>
    //         <p><strong>Region:</strong> ${data.region || 'Not specified'}</p>
    //         <p><strong>Message:</strong></p>
    //         <p>${data.message}</p>
    //       `,
    //     }),
    //   });
    // }

    return NextResponse.json({
      success: true,
      message: "Thank you for your inquiry. We'll be in touch shortly.",
      referenceId: crypto.randomUUID(),
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        error: true,
        code: "SERVER_ERROR",
        message: "An error occurred processing your request. Please try again.",
      },
      { status: 500 }
    );
  }
}
