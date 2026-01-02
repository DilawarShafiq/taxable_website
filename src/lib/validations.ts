import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().max(200).optional(),
  serviceInterest: z.enum(["taxation", "audits", "accounting", "ai-agents", "general"]).optional(),
  region: z.enum(["pakistan", "uk", "usa", "saudi-arabia", "uae"]).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const chatMessageSchema = z.object({
  message: z.string().min(1).max(1000),
  sessionId: z.string().uuid(),
});

export const chatLeadSchema = z.object({
  sessionId: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
});

export const uploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.type === "application/pdf",
    "Only PDF files are accepted"
  ).refine(
    (file) => file.size <= 25 * 1024 * 1024,
    "File size must be less than 25MB"
  ),
});
