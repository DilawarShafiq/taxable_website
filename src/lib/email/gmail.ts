import nodemailer from "nodemailer";
import type { Jurisdiction } from "@/types/database";

const FROM_NAME = "Taxable AI";
const FROM = `${FROM_NAME} <${process.env.GMAIL_USER ?? "hello@taxable.ai"}>`;
const LEADS_EMAIL = process.env.GMAIL_LEADS_EMAIL ?? "hello@taxable.ai";

function getTransport() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

async function send(opts: { to: string; subject: string; html: string }) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("[email] GMAIL_USER or GMAIL_APP_PASSWORD not set — skipping email");
    return;
  }
  await getTransport().sendMail({ from: FROM, ...opts });
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

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string
) {
  return send({
    to,
    subject: "Reset your Taxable AI password",
    html: `<p>Hi ${name},</p><p>We received a request to reset your password. Click the link below to set a new one:</p><p><a href="${resetUrl}">Reset Password</a></p><p>This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.</p><p>The Taxable AI Team</p>`,
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
