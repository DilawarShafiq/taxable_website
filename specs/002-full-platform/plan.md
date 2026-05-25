# Implementation Plan: Taxable AI — Full Platform

**Branch**: `002-full-platform` | **Date**: 2026-05-25 | **Spec**: [spec.md](./spec.md)

---

## Summary

Enterprise multi-portal platform for a CA/Tax Lawyer firm covering USA, UK, Saudi Arabia, and Pakistan. Built on Next.js 16 (App Router), Supabase (Postgres + Auth + Storage + RLS), deployed on Google Cloud Run, with Claude AI served via Google Cloud Vertex AI. Custom MCP tools extend Claude with firm-specific financial, jurisdictional, and document-processing capabilities.

---

## Technical Context

**Language/Version**: TypeScript 5.5+, Node.js 22+
**Framework**: Next.js 16 (App Router), React 19
**UI**: Tailwind CSS 4, shadcn/ui, Framer Motion 12
**Backend-as-a-Service**: Supabase (Postgres 17, Auth, Storage, Realtime, Edge Functions)
**AI Layer**: Claude `claude-opus-4-7` via Google Cloud Vertex AI (Anthropic on Vertex)
**AI SDK**: `@anthropic-ai/sdk` with VertexAI auth (`ANTHROPIC_VERTEX_PROJECT_ID`, `CLOUD_ML_REGION`)
**MCP**: Custom MCP servers for firm-specific tools (see MCP Architecture below)
**Charts**: Recharts 2+ for interactive financial charts
**Email**: Resend (transactional email API)
**Deployment**: Google Cloud Run (containerised Next.js + custom MCP servers)
**CI/CD**: Google Cloud Build + Cloud Run revisions
**Infrastructure-as-code**: Terraform (Cloud Run services, Artifact Registry, IAM, Secret Manager)
**Testing**: Vitest (unit), Playwright (E2E)

---

## Architecture Decisions

### 1. Claude on Vertex AI (not direct Anthropic API)

**Why**: Google Cloud billing consolidation, enterprise SLAs, no separate Anthropic API key management — credentials come from the Cloud Run service account (Workload Identity).

**Implementation**:
```typescript
// src/lib/claude.ts
import Anthropic from "@anthropic-ai/sdk";

export const claude = new Anthropic({
  // Vertex AI auth — no API key needed; uses ADC (Application Default Credentials)
  // Set env: ANTHROPIC_VERTEX_PROJECT_ID, CLOUD_ML_REGION=us-east5
  defaultHeaders: {
    "X-Vertex-AI-Project": process.env.ANTHROPIC_VERTEX_PROJECT_ID!,
  },
});
// Model: claude-opus-4-7@20260501 on Vertex
```

**Model used everywhere**: `claude-opus-4-7` (most capable, available on Vertex AI)

---

### 2. Supabase as the single source of truth

All four pillars share one Supabase project. Row Level Security (RLS) enforces data isolation:
- Clients see only their own rows
- Staff see rows they are assigned to
- Admin/CEO see all rows in their organisation

Supabase Edge Functions handle webhooks (e.g., sending email via Resend when a case status changes).

---

### 3. MCP Architecture — Custom Tools for Taxable AI

The Claude AI assistants (chatbot, staff assistant, asset forecaster) are enhanced with a set of custom MCP servers that give Claude firm-specific capabilities. MCP servers run as separate Cloud Run services.

#### MCP Servers

| MCP Server | Purpose | Tools Exposed |
|------------|---------|---------------|
| `mcp-tax-rules` | Jurisdiction-specific tax rules and rates | `get_tax_rates`, `get_filing_deadlines`, `get_compliance_checklist`, `calculate_tax_estimate` |
| `mcp-market-data` | Financial data gateway (stocks, crypto, real estate) | `get_historical_prices`, `get_current_price`, `get_asset_summary`, `compare_assets` |
| `mcp-documents` | Document processing and extraction | `extract_pdf_text`, `parse_bank_statement`, `classify_document`, `summarise_document` |
| `mcp-supabase` | Controlled read access to Supabase for Claude | `get_client_cases`, `get_case_documents`, `get_client_profile` |
| `mcp-calendar` | Appointment availability | `get_available_slots`, `book_appointment`, `cancel_appointment` |

#### MCP Tool Details

```typescript
// mcp-tax-rules: get_tax_rates
Input: { jurisdiction: "uk" | "usa" | "saudi" | "pakistan", asset_type: "stock" | "crypto" | "real_estate" | "income", year: number }
Output: { rate: number, threshold: number, holding_period_days: number, notes: string }

// mcp-market-data: get_historical_prices
Input: { symbol: string, asset_type: "stock" | "crypto" | "real_estate", range: "1y" | "3y" | "5y" | "10y" }
Output: { data_points: Array<{ date: string, value: number, pct_change: number }>, source: string, cached_at: string }

// mcp-documents: parse_bank_statement
Input: { file_path: string, file_type: "pdf" | "csv" }
Output: { transactions: Array<{ date, description, amount, category }>, summary: { income, expenses, net } }

// mcp-supabase: get_client_cases (staff use only — scoped by staff_id)
Input: { staff_id: string, status_filter?: string }
Output: { cases: Case[], total: number }
```

#### MCP Deployment on Google Cloud

Each MCP server is a lightweight Node.js HTTP service (using `@modelcontextprotocol/sdk`), deployed on Cloud Run with:
- Minimum 1 instance (no cold starts for staff portal)
- Private VPC access only — not publicly reachable
- IAM-based auth between Cloud Run services

---

### 4. Financial Data Strategy

| Asset Class | Data Source | Frequency | Cache TTL |
|------------|-------------|-----------|-----------|
| Stocks (S&P 500, FTSE 100, KSE-100, TASI) | Alpha Vantage API | Daily close | 1 hour |
| Crypto (BTC, ETH, top 10) | CoinGecko API (free) | Hourly | 15 min |
| Real Estate — US | FRED API (Case-Shiller HPI) | Monthly | 24 hours |
| Real Estate — UK | ONS / Land Registry API | Monthly | 24 hours |
| Real Estate — Saudi Arabia | Proxy: Cityscape / Reidin index (JSON config) | Quarterly | 24 hours |
| Real Estate — Pakistan | Proxy: Zameen.com index / SBP data (JSON config) | Quarterly | 24 hours |

All data is written to Supabase `asset_cache` table. The `mcp-market-data` server reads from cache first; only calls external APIs on cache miss.

---

## Database Schema (Supabase / Postgres)

```sql
-- Auth: managed by Supabase Auth (auth.users)

-- Extended profiles
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('client','staff','admin','ceo')),
  phone text,
  preferred_jurisdiction text check (preferred_jurisdiction in ('usa','uk','saudi','pakistan')),
  organisation_id uuid,
  created_at timestamptz default now()
);

-- Clients (firms / individuals)
create table clients (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references profiles(id),
  company_name text,
  business_type text,
  jurisdictions text[] default '{}',
  assigned_staff_id uuid references profiles(id),
  status text default 'active' check (status in ('active','inactive','onboarding')),
  onboarded_at timestamptz,
  created_at timestamptz default now()
);

-- Cases
create table cases (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id),
  assigned_staff_id uuid references profiles(id),
  type text not null check (type in ('tax_filing','audit','accounting','consultation')),
  jurisdiction text not null check (jurisdiction in ('usa','uk','saudi','pakistan')),
  tax_year int,
  status text not null default 'open' check (status in ('open','in_review','pending_docs','filed','closed')),
  title text,
  notes text,
  due_date date,
  filed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Documents
create table documents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id),
  case_id uuid references cases(id),
  uploaded_by uuid references profiles(id),
  requested_by uuid references profiles(id),
  file_path text not null,           -- Supabase Storage path
  file_name text not null,
  file_size_bytes bigint,
  mime_type text,
  processing_status text default 'pending' check (processing_status in ('pending','processing','done','failed')),
  extracted_data jsonb,
  created_at timestamptz default now()
);

-- Messages (per case thread)
create table messages (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id),
  sender_id uuid not null references profiles(id),
  content text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);

-- Appointments
create table appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id),
  staff_id uuid not null references profiles(id),
  starts_at timestamptz not null,
  duration_minutes int default 60,
  type text check (type in ('consultation','review','follow_up')),
  notes text,
  status text default 'scheduled' check (status in ('scheduled','completed','cancelled')),
  created_at timestamptz default now()
);

-- Invoices
create table invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id),
  case_id uuid references cases(id),
  amount_usd numeric(10,2) not null,
  currency text default 'USD',
  status text default 'draft' check (status in ('draft','sent','paid','overdue')),
  due_date date,
  paid_at timestamptz,
  line_items jsonb,
  created_at timestamptz default now()
);

-- Leads (from marketing website)
create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  jurisdiction text,
  service_interest text,
  message text,
  source text check (source in ('chatbot','contact_form','demo','asset_dashboard')),
  converted_client_id uuid references clients(id),
  created_at timestamptz default now()
);

-- Asset price cache
create table asset_cache (
  id uuid primary key default gen_random_uuid(),
  asset_type text not null check (asset_type in ('stock','crypto','real_estate')),
  symbol text not null,
  time_range text not null check (time_range in ('1y','3y','5y','10y')),
  data_points jsonb not null,        -- Array of { date, value, pct_change }
  source text,
  last_updated timestamptz default now(),
  unique (symbol, time_range)
);

-- Audit log
create table audit_log (
  id bigserial primary key,
  actor_id uuid references profiles(id),
  action text not null,              -- e.g. 'case.status_changed', 'invoice.sent'
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz default now()
);
```

### RLS Policies Summary

```sql
-- Clients: see own row only
alter table clients enable row level security;
create policy "client own row" on clients for select using (profile_id = auth.uid());
create policy "staff see assigned" on clients for select using (assigned_staff_id = auth.uid());
create policy "admin see all" on clients for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin','ceo'))
);

-- Cases: client sees their cases, staff sees assigned, admin sees all
-- (similar pattern for documents, messages, invoices, appointments)
```

---

## Source Code Structure

```text
taxable_website/
├── src/
│   ├── app/
│   │   ├── (marketing)/              # Pillar 1 — Public website (EXISTING)
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── about/
│   │   │   ├── services/
│   │   │   ├── regions/              # usa/, uk/, saudi-arabia/, pakistan/
│   │   │   ├── ai-agents/
│   │   │   ├── blog/
│   │   │   ├── contact/
│   │   │   ├── demo/
│   │   │   ├── privacy/
│   │   │   └── terms/
│   │   │
│   │   ├── (client)/                 # Pillar 2 — Client Portal (NEW)
│   │   │   ├── layout.tsx            # Client shell (sidebar nav, auth guard)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # Client home: cases, docs, appointments
│   │   │   ├── cases/
│   │   │   │   ├── page.tsx          # Case list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Case detail + timeline + messages
│   │   │   ├── documents/
│   │   │   │   └── page.tsx          # Document vault
│   │   │   ├── appointments/
│   │   │   │   └── page.tsx          # Book / view appointments
│   │   │   ├── messages/
│   │   │   │   └── page.tsx          # All message threads
│   │   │   └── billing/
│   │   │       └── page.tsx          # Invoices + payment
│   │   │
│   │   ├── (admin)/                  # Pillar 3 — Admin/Staff Portal (NEW)
│   │   │   ├── layout.tsx            # Admin shell (role-gated)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # Staff: today's queue; CEO: analytics
│   │   │   ├── clients/
│   │   │   │   ├── page.tsx          # Client CRM list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Client detail + cases
│   │   │   ├── cases/
│   │   │   │   ├── page.tsx          # All cases
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Case management view
│   │   │   ├── documents/
│   │   │   │   └── page.tsx          # Review queue
│   │   │   ├── staff/
│   │   │   │   └── page.tsx          # Staff management (admin/ceo only)
│   │   │   ├── billing/
│   │   │   │   └── page.tsx          # Invoice management
│   │   │   └── analytics/
│   │   │       └── page.tsx          # CEO analytics (ceo only)
│   │   │
│   │   ├── (assets)/                 # Pillar 4 — Asset Dashboard (NEW)
│   │   │   ├── layout.tsx
│   │   │   └── dashboard/
│   │   │       └── page.tsx          # Full asset comparison + AI forecast
│   │   │
│   │   ├── auth/                     # Auth flows (NEW)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── invite/
│   │   │   │   └── page.tsx          # Client invite token registration
│   │   │   └── reset-password/
│   │   │       └── page.tsx
│   │   │
│   │   └── api/
│   │       ├── chat/route.ts          # Chatbot (Vertex AI Claude + MCP)
│   │       ├── contact/route.ts       # Lead form → Supabase + Resend
│   │       ├── upload/route.ts        # Document upload handler
│   │       ├── assets/
│   │       │   ├── route.ts           # Asset data proxy + cache layer
│   │       │   └── forecast/route.ts  # Claude forecast call
│   │       └── webhooks/
│   │           └── supabase/route.ts  # Supabase Edge Function webhooks
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui base (existing)
│   │   ├── layout/                   # Header, Footer (existing)
│   │   ├── sections/                 # Marketing sections (existing)
│   │   ├── chat/                     # Chatbot components (existing)
│   │   ├── client/                   # Client portal components (NEW)
│   │   │   ├── CaseTimeline.tsx
│   │   │   ├── DocumentVault.tsx
│   │   │   ├── AppointmentPicker.tsx
│   │   │   ├── MessageThread.tsx
│   │   │   └── InvoiceCard.tsx
│   │   ├── admin/                    # Admin portal components (NEW)
│   │   │   ├── CaseQueue.tsx
│   │   │   ├── ClientCRM.tsx
│   │   │   ├── StaffAssignment.tsx
│   │   │   ├── AIAssistant.tsx
│   │   │   └── AuditLogTable.tsx
│   │   ├── analytics/                # CEO analytics (NEW)
│   │   │   ├── RevenueChart.tsx
│   │   │   ├── CasesByStatusChart.tsx
│   │   │   ├── JurisdictionMap.tsx
│   │   │   └── KPICard.tsx
│   │   └── assets/                   # Asset dashboard (NEW)
│   │       ├── AssetPicker.tsx
│   │       ├── ComparisonChart.tsx
│   │       ├── ForecastPanel.tsx
│   │       ├── TaxImplicationsPanel.tsx
│   │       └── AssetCard.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser Supabase client
│   │   │   ├── server.ts             # Server Supabase client (RSC)
│   │   │   └── middleware.ts         # Auth session refresh
│   │   ├── claude/
│   │   │   ├── client.ts             # Vertex AI Claude client
│   │   │   ├── prompts/
│   │   │   │   ├── chatbot.ts        # Website chatbot system prompt
│   │   │   │   ├── staff-assistant.ts
│   │   │   │   └── asset-forecast.ts
│   │   │   └── mcp-client.ts         # MCP tool call wrapper
│   │   ├── market-data/
│   │   │   ├── cache.ts              # Supabase cache read/write
│   │   │   ├── alpha-vantage.ts      # Stocks fetcher
│   │   │   ├── coingecko.ts          # Crypto fetcher
│   │   │   └── real-estate.ts        # Real estate index fetcher
│   │   └── email/
│   │       └── resend.ts             # Transactional email templates
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                # Supabase auth state
│   │   ├── useCase.ts
│   │   ├── useDocuments.ts
│   │   ├── useAssetData.ts           # Asset chart data
│   │   └── useForecast.ts            # Claude forecast hook
│   │
│   └── types/
│       ├── database.ts               # Generated Supabase types
│       ├── assets.ts                 # Asset data types
│       └── index.ts
│
├── mcp-servers/                      # Custom MCP servers (NEW)
│   ├── mcp-tax-rules/
│   │   ├── src/index.ts
│   │   ├── data/
│   │   │   ├── usa.json              # IRS rates, deadlines
│   │   │   ├── uk.json               # HMRC rates, deadlines
│   │   │   ├── saudi.json            # ZATCA rates
│   │   │   └── pakistan.json         # FBR rates
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── mcp-market-data/
│   │   ├── src/index.ts
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── mcp-documents/
│   │   ├── src/index.ts
│   │   ├── Dockerfile
│   │   └── package.json
│   └── mcp-supabase/
│       ├── src/index.ts
│       ├── Dockerfile
│       └── package.json
│
├── supabase/
│   ├── migrations/                   # DB migrations
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_rls_policies.sql
│   │   └── 003_asset_cache.sql
│   ├── functions/                    # Edge Functions
│   │   ├── case-status-notification/
│   │   └── invoice-overdue-check/
│   └── seed.sql                      # Dev seed data
│
├── terraform/                        # Google Cloud IaC (NEW)
│   ├── main.tf
│   ├── cloud-run.tf                  # App + MCP services
│   ├── iam.tf                        # Workload identity
│   ├── secrets.tf                    # Secret Manager
│   └── variables.tf
│
├── Dockerfile                        # Next.js app container
├── .env.example                      # All env vars documented
└── specs/002-full-platform/          # This plan
```

---

## Environment Variables

```bash
# Google Cloud / Vertex AI
ANTHROPIC_VERTEX_PROJECT_ID=taxable-ai-prod
CLOUD_ML_REGION=us-east5
GOOGLE_APPLICATION_CREDENTIALS=/secrets/sa-key.json  # via Secret Manager in Cloud Run

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx  # server-only

# Financial APIs
ALPHA_VANTAGE_API_KEY=xxx
COINGECKO_API_KEY=xxx           # optional, free tier works without key
FRED_API_KEY=xxx

# Email
RESEND_API_KEY=xxx
RESEND_FROM_EMAIL=noreply@taxable.ai

# MCP server URLs (internal Cloud Run service-to-service)
MCP_TAX_RULES_URL=https://mcp-tax-rules-xxx.run.app
MCP_MARKET_DATA_URL=https://mcp-market-data-xxx.run.app
MCP_DOCUMENTS_URL=https://mcp-documents-xxx.run.app
MCP_SUPABASE_URL=https://mcp-supabase-xxx.run.app
```

---

## Implementation Phases

### Phase 1 — Foundation (Week 1–2)
1. Supabase project setup + schema migrations + RLS policies
2. Auth flows (login, register, invite token, password reset)
3. Supabase client/server helpers + middleware for session refresh
4. Vertex AI Claude client setup + environment configuration

### Phase 2 — Public Website Enhancement (Week 2–3)
1. Wire up AI chatbot to Vertex AI Claude (replace mock responses)
2. Jurisdiction pages: USA, UK, Saudi Arabia, Pakistan with real compliance content
3. Contact form → Supabase leads table + Resend confirmation email
4. Replace all "Coming Soon" stats with live Supabase queries
5. PDF demo → mcp-documents processing

### Phase 3 — Client Portal (Week 3–5)
1. Client dashboard layout + auth guard
2. Case list + case detail with timeline stepper
3. Document vault (upload/download via Supabase Storage)
4. Messaging per case thread
5. Invoice viewing
6. Appointment booking

### Phase 4 — Admin / Staff Portal (Week 5–7)
1. Staff dashboard + case queue
2. Client CRM (list, detail, create)
3. Case management (create, assign, update status, close)
4. Document review queue + AI summary (mcp-documents)
5. AI staff assistant (Claude + MCP tools via API route)
6. Invoice creation + sending
7. CEO analytics dashboard (revenue, cases, jurisdictions)

### Phase 5 — Asset Comparison Dashboard (Week 7–9)
1. MCP market data server + financial API integrations
2. Asset cache layer in Supabase
3. ComparisonChart component (Recharts, normalised % returns)
4. Asset picker UI (select up to 4 assets, set time range)
5. Claude forecast panel (Vertex AI + mcp-market-data + mcp-tax-rules)
6. Tax implications panel (per jurisdiction per asset class)

### Phase 6 — MCP Servers + Cloud Deployment (Week 9–10)
1. Build and containerise all 4 MCP servers
2. Terraform: Cloud Run services, IAM, Secret Manager
3. Supabase Edge Functions (case notifications, invoice reminders)
4. Cloud Build CI/CD pipeline
5. Production launch checklist

---

## ADR Suggestions

1. **Claude on Vertex AI vs direct Anthropic API** — Long-term infrastructure decision affecting billing, SLA, and credential management across all 4 pillars
2. **Supabase vs custom Postgres + Auth0** — Foundational data and auth architecture choice
3. **MCP servers as separate Cloud Run services vs in-process tool calls** — Affects latency, deployment complexity, and tool isolation

📋 Architectural decision detected: MCP server deployment topology (separate Cloud Run vs in-process) — Document? Run `/sp.adr mcp-deployment-topology`

📋 Architectural decision detected: Claude on Vertex AI as the exclusive AI provider — Document? Run `/sp.adr vertex-ai-claude-provider`
