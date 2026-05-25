export type Role = "client" | "staff" | "admin" | "ceo";
export type Jurisdiction = "usa" | "uk" | "saudi" | "pakistan";
export type CaseType = "tax_filing" | "audit" | "accounting" | "consultation";
export type CaseStatus = "open" | "in_review" | "pending_docs" | "filed" | "closed";
export type DocumentProcessingStatus = "pending" | "processing" | "done" | "failed";
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";
export type AppointmentStatus = "scheduled" | "completed" | "cancelled";
export type LeadSource = "chatbot" | "contact_form" | "demo" | "asset_dashboard";
export type AssetType = "stock" | "crypto" | "real_estate";

export interface Profile {
  id: string;
  full_name: string;
  role: Role;
  phone: string | null;
  preferred_jurisdiction: Jurisdiction | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  profile_id: string | null;
  company_name: string | null;
  business_type: string | null;
  jurisdictions: Jurisdiction[];
  assigned_staff_id: string | null;
  status: "active" | "inactive" | "onboarding";
  onboarded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Case {
  id: string;
  client_id: string;
  assigned_staff_id: string | null;
  type: CaseType;
  jurisdiction: Jurisdiction;
  tax_year: number | null;
  status: CaseStatus;
  title: string;
  notes: string | null;
  due_date: string | null;
  filed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  client_id: string;
  case_id: string | null;
  uploaded_by: string | null;
  requested_by: string | null;
  file_path: string;
  file_name: string;
  file_size_bytes: number | null;
  mime_type: string | null;
  processing_status: DocumentProcessingStatus;
  extracted_data: Record<string, unknown> | null;
  created_at: string;
}

export interface Message {
  id: string;
  case_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
}

export interface Appointment {
  id: string;
  client_id: string;
  staff_id: string;
  starts_at: string;
  duration_minutes: number;
  type: "consultation" | "review" | "follow_up" | null;
  notes: string | null;
  status: AppointmentStatus;
  created_at: string;
}

export interface Invoice {
  id: string;
  client_id: string;
  case_id: string | null;
  amount_usd: number;
  currency: string;
  status: InvoiceStatus;
  due_date: string | null;
  paid_at: string | null;
  line_items: LineItem[];
  created_at: string;
  updated_at: string;
}

export interface LineItem {
  description: string;
  amount: number;
  quantity?: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  jurisdiction: Jurisdiction | null;
  service_interest: string | null;
  message: string | null;
  source: LeadSource | null;
  converted_client_id: string | null;
  created_at: string;
}

export interface AssetCache {
  id: string;
  asset_type: AssetType;
  symbol: string;
  time_range: "1y" | "3y" | "5y" | "10y";
  data_points: DataPoint[];
  source: string | null;
  last_updated: string;
}

export interface DataPoint {
  date: string;
  value: number;
  pct_change: number;
}

export interface AuditLog {
  id: number;
  actor_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// Supabase Database type map (used by createClient<Database>)
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, "created_at" | "updated_at">; Update: Partial<Profile> };
      clients: { Row: Client; Insert: Omit<Client, "id" | "created_at" | "updated_at">; Update: Partial<Client> };
      cases: { Row: Case; Insert: Omit<Case, "id" | "created_at" | "updated_at">; Update: Partial<Case> };
      documents: { Row: Document; Insert: Omit<Document, "id" | "created_at">; Update: Partial<Document> };
      messages: { Row: Message; Insert: Omit<Message, "id" | "created_at">; Update: Partial<Message> };
      appointments: { Row: Appointment; Insert: Omit<Appointment, "id" | "created_at">; Update: Partial<Appointment> };
      invoices: { Row: Invoice; Insert: Omit<Invoice, "id" | "created_at" | "updated_at">; Update: Partial<Invoice> };
      leads: { Row: Lead; Insert: Omit<Lead, "id" | "created_at">; Update: Partial<Lead> };
      asset_cache: { Row: AssetCache; Insert: Omit<AssetCache, "id">; Update: Partial<AssetCache> };
      audit_log: { Row: AuditLog; Insert: Omit<AuditLog, "id" | "created_at">; Update: never };
    };
  };
}
