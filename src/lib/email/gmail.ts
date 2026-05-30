import { Resend } from "resend";
import type { Jurisdiction } from "@/types/database";

const FROM = "Taxable AI <noreply@taxable.ai>";
const LEADS_EMAIL = process.env.LEADS_EMAIL ?? process.env.GMAIL_LEADS_EMAIL ?? "dilawar.gopang@gmail.com";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

async function send(opts: { to: string; subject: string; html: string }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — skipping email");
    return;
  }
  const { error } = await getResend().emails.send({ from: FROM, ...opts });
  if (error) console.error("[email] send failed:", error);
}

export async function sendWelcomeEmail(to: string, name: string) {
  return send({
    to,
    subject: "Welcome to Taxable AI",
    html: `<p>Hi ${name},</p><p>Welcome to Taxable AI. Your account is ready. <a href="${process.env.NEXT_PUBLIC_SITE_URL}/auth/login">Log in to your portal</a>.</p><p>The Taxable AI Team</p>`,
  });
}

export async function sendCaseStatusEmail(
  to: string,
  clientName: string,
  caseTitle: string,
  newStatus: string,
  caseId: string
) {
  const statusLabels: Record<string, string> = {
    open: "Opened",
    in_review: "In Review",
    pending_docs: "Awaiting Documents",
    filed: "Filed",
    closed: "Closed",
  };
  return send({
    to,
    subject: `Case Update: ${caseTitle} — ${statusLabels[newStatus] ?? newStatus}`,
    html: `<p>Hi ${clientName},</p><p>Your case <strong>${caseTitle}</strong> has been updated to: <strong>${statusLabels[newStatus] ?? newStatus}</strong>.</p><p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/client/cases/${caseId}">View Case</a></p><p>The Taxable AI Team</p>`,
  });
}

export async function sendInvoiceEmail(
  to: string,
  clientName: string,
  amount: number,
  currency: string,
  dueDate: string,
  invoiceId: string
) {
  return send({
    to,
    subject: `Invoice from Taxable AI — ${currency} ${amount.toFixed(2)}`,
    html: `<p>Hi ${clientName},</p><p>You have a new invoice for <strong>${currency} ${amount.toFixed(2)}</strong> due on <strong>${dueDate}</strong>.</p><p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/client/billing?invoice=${invoiceId}">View Invoice</a></p><p>The Taxable AI Team</p>`,
  });
}

export async function sendLeadNotification(lead: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  jurisdiction?: Jurisdiction;
  service_interest?: string;
  message?: string;
  source?: string;
}) {
  return send({
    to: LEADS_EMAIL,
    subject: `New Lead: ${lead.name} (${lead.jurisdiction ?? "unknown jurisdiction"})`,
    html: `<h2>New Lead from ${lead.source ?? "website"}</h2>
<ul>
  <li><strong>Name:</strong> ${lead.name}</li>
  <li><strong>Email:</strong> ${lead.email}</li>
  <li><strong>Phone:</strong> ${lead.phone ?? "—"}</li>
  <li><strong>Company:</strong> ${lead.company ?? "—"}</li>
  <li><strong>Jurisdiction:</strong> ${lead.jurisdiction ?? "—"}</li>
  <li><strong>Service:</strong> ${lead.service_interest ?? "—"}</li>
  <li><strong>Message:</strong> ${lead.message ?? "—"}</li>
</ul>`,
  });
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string
) {
  return send({
    to,
    subject: "Reset your Taxable AI password",
    html: `<p>Hi ${name},</p><p>We received a request to reset your password. Click the link below to set a new one:</p><p><a href="${resetUrl}" style="background:#2563eb;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;">Reset Password</a></p><p>This link expires in 1 hour. If you did not request this, you can safely ignore this email.</p><p>The Taxable AI Team</p>`,
  });
}

export async function sendDocumentRequestEmail(
  to: string,
  clientName: string,
  requestedDoc: string,
  caseTitle: string,
  caseId: string
) {
  return send({
    to,
    subject: `Document Required: ${requestedDoc}`,
    html: `<p>Hi ${clientName},</p><p>Your accountant has requested: <strong>${requestedDoc}</strong> for case <strong>${caseTitle}</strong>.</p><p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/client/cases/${caseId}">Upload Document</a></p><p>The Taxable AI Team</p>`,
  });
}

export async function sendAppointmentConfirmationEmail(
  to: string,
  clientName: string,
  dateTime: string,
  staffName: string,
  type: string
) {
  return send({
    to,
    subject: `Appointment Confirmed — ${type}`,
    html: `<p>Hi ${clientName},</p><p>Your <strong>${type}</strong> appointment with <strong>${staffName}</strong> is confirmed for <strong>${dateTime}</strong>.</p><p>The Taxable AI Team</p>`,
  });
}
