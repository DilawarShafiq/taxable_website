// Contact form types
export interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
  region?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  referenceId?: string;
}

// Chat types
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  sessionId: string;
  history?: ChatMessage[];
}

export interface ChatLeadRequest {
  sessionId: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

// Upload types
export type UploadStatus = "uploading" | "processing" | "complete" | "error";

export interface UploadResponse {
  sessionId: string;
  status: UploadStatus;
  message: string;
}

export interface ProcessingStatus {
  sessionId: string;
  status: UploadStatus;
  progress: number;
  message: string;
  estimatedTimeRemaining?: number;
}

export interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
  category: string;
  confidence: number;
}

export interface Summary {
  totalCredits: number;
  totalDebits: number;
  netChange: number;
  transactionCount: number;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface ProcessingResult {
  sessionId: string;
  transactions: Transaction[];
  summary: Summary;
  categories: CategoryBreakdown[];
}

// Error types
export interface ErrorResponse {
  error: boolean;
  code: string;
  message: string;
  details?: Record<string, string>;
}
