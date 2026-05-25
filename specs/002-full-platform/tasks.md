# Tasks: Taxable AI — Full Platform (4 Pillars)

**Input**: Design documents from `/specs/002-full-platform/`
**Feature Branch**: `002-full-platform`
**Date**: 2026-05-25
**Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md) | **Data Model**: [data-model.md](./data-model.md)

**Stack**: Next.js 16 App Router · TypeScript 5 · Supabase · Claude on Vertex AI · Recharts · Tailwind 4 · shadcn/ui · Resend · Google Cloud Run

**Total Tasks**: 120 | **Phases**: 8 | **Parallel Opportunities**: 38

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Environment, config, and dependency additions needed before any feature work

- [ ] T001 Install new dependencies: `@supabase/supabase-js @supabase/ssr @supabase/auth-ui-react recharts @anthropic-ai/sdk resend` in package.json
- [ ] T002 [P] Create `.env.local` from `.env.example` with all required keys documented (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_VERTEX_PROJECT_ID, CLOUD_ML_REGION, ALPHA_VANTAGE_API_KEY, COINGECKO_API_KEY, FRED_API_KEY, RESEND_API_KEY)
- [ ] T003 [P] Create `supabase/` directory structure: `migrations/`, `functions/`, `seed.sql` scaffold
- [ ] T004 [P] Create `mcp-servers/` directory with subdirs: `mcp-tax-rules/`, `mcp-market-data/`, `mcp-documents/`, `mcp-supabase/`
- [ ] T005 Create `Dockerfile` for Next.js app (Node 22 Alpine, standalone output, health check endpoint)
- [ ] T006 [P] Create `terraform/` directory with `main.tf`, `variables.tf`, `cloud-run.tf`, `iam.tf`, `secrets.tf` scaffold files
- [ ] T007 Update `next.config.ts` to enable: standalone output, image domains for Supabase Storage, Vertex AI hostname allow list

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No portal work can begin until this phase is complete

### Database & Auth Foundation

- [ ] T008 Write Supabase migration `supabase/migrations/001_initial_schema.sql` — create all tables: `profiles`, `clients`, `cases`, `documents`, `messages`, `appointments`, `invoices`, `leads`, `asset_cache`, `audit_log` exactly as specified in data-model.md
- [ ] T009 Write Supabase migration `supabase/migrations/002_rls_policies.sql` — RLS enable + policies for all tables (client own-row, staff assigned-row, admin all-rows pattern)
- [ ] T010 Write Supabase migration `supabase/migrations/003_indexes.sql` — add indexes on `cases.client_id`, `cases.assigned_staff_id`, `documents.case_id`, `messages.case_id`, `asset_cache.symbol`
- [ ] T011 Write `supabase/seed.sql` with dev seed data: 1 admin, 2 staff, 3 clients, 5 cases across jurisdictions, sample asset_cache rows

### Supabase Client Helpers

- [ ] T012 Create `src/lib/supabase/client.ts` — browser Supabase client using `createBrowserClient` from `@supabase/ssr`
- [ ] T013 Create `src/lib/supabase/server.ts` — server Supabase client using `createServerClient` with cookie handling for RSC and API routes
- [ ] T014 Create `src/middleware.ts` — Supabase auth session refresh middleware, protecting `/client/*` and `/admin/*` routes, redirecting unauthenticated users to `/auth/login`

### Claude / Vertex AI Client

- [ ] T015 Create `src/lib/claude/client.ts` — instantiate Anthropic SDK configured for Vertex AI using `ANTHROPIC_VERTEX_PROJECT_ID` and `CLOUD_ML_REGION`; export typed `streamText` and `generateText` helpers
- [ ] T016 [P] Create `src/lib/claude/prompts/chatbot.ts` — system prompt for website chatbot: firm identity, 4 jurisdictions, services, tone
- [ ] T017 [P] Create `src/lib/claude/prompts/staff-assistant.ts` — system prompt for admin AI assistant: document analysis, letter drafting, tax estimation
- [ ] T018 [P] Create `src/lib/claude/prompts/asset-forecast.ts` — system prompt for asset forecasting: structured output schema, disclaimer, jurisdiction-aware analysis

### Shared Types

- [ ] T019 Create `src/types/database.ts` — TypeScript types matching every Supabase table (manually typed from schema; later replace with generated types)
- [ ] T020 [P] Create `src/types/assets.ts` — `AssetType`, `DataPoint`, `ForecastResponse`, `TaxImplication` interfaces
- [ ] T021 [P] Update `src/types/index.ts` to re-export all types

### Email Helper

- [ ] T022 Create `src/lib/email/resend.ts` — Resend client + typed functions: `sendWelcomeEmail`, `sendCaseStatusEmail`, `sendInvoiceEmail`, `sendLeadNotification`

**Checkpoint**: Database schema deployed, auth middleware active, Claude client working — story phases can now begin

---

## Phase 3: User Story 1 — Website Enhancement (Priority: P1)

**Goal**: Public website with live AI chatbot, real jurisdiction pages, wired contact form, no placeholder stats

**Independent Test**: Open homepage — chatbot responds, contact form submits to Supabase, jurisdiction pages show real compliance content

### Chatbot API Route

- [ ] T023 [US1] Replace mock chat handler in `src/app/api/chat/route.ts` — stream response from Vertex AI Claude using `chatbot.ts` system prompt; POST body: `{ messages: Message[], jurisdiction?: string }`
- [ ] T024 [US1] Update `src/components/chat/ChatWindow.tsx` to use streaming response (ReadableStream); add typing indicator during stream

### Jurisdiction Pages

- [ ] T025 [P] [US1] Rewrite `src/app/(marketing)/regions/usa/page.tsx` — IRS filing deadlines 2026, federal/state tax rates, FBAR requirements, CPA credentials, local contact
- [ ] T026 [P] [US1] Rewrite `src/app/(marketing)/regions/uk/page.tsx` — HMRC self-assessment deadlines, corporation tax rates, VAT thresholds, ACCA/ICAEW credentials, London contact
- [ ] T027 [P] [US1] Rewrite `src/app/(marketing)/regions/saudi-arabia/page.tsx` — ZATCA e-invoicing, VAT 15%, Zakat rules, CPA Saudi credentials, Riyadh contact
- [ ] T028 [P] [US1] Rewrite `src/app/(marketing)/regions/pakistan/page.tsx` — FBR income tax slabs 2026, SRB/PRA, WHT rates, ICAP/ACCA credentials, Karachi/Lahore contact

### Contact Form → Supabase

- [ ] T029 [US1] Update `src/app/api/contact/route.ts` to: validate with Zod, insert into Supabase `leads` table via service role client, call `sendLeadNotification` email, return `{ success: true, id }`
- [ ] T030 [US1] Update `src/components/forms/ContactForm.tsx` to consume the updated API response and display the returned lead ID in the success message

### Live Homepage Stats

- [ ] T031 [US1] Create `src/app/api/stats/route.ts` — query Supabase for: `count(clients)`, `count(cases where status='filed')`, distinct jurisdiction count; cache with `next: { revalidate: 3600 }`
- [ ] T032 [US1] Update `src/components/sections/TrustIndicators.tsx` to fetch from `/api/stats` and render live numbers (replace hardcoded "Coming Soon" values)

### Get Started CTA

- [ ] T033 [US1] Update all primary CTA buttons site-wide in `src/components/sections/Hero.tsx` and `src/components/sections/CTASection.tsx` to link to `/auth/register?source=website`

**Checkpoint**: Website fully live — chatbot streams Claude responses, stats are real, jurisdiction pages are authoritative

---

## Phase 4: User Story 2 — Client Portal: Onboarding & Dashboard (Priority: P2)

**Goal**: Client can register via invite, complete onboarding, and see their dashboard

**Independent Test**: Hit `/auth/invite?token=TEST` → complete registration → land on `/client/dashboard` with seeded case data visible

### Auth Pages

- [ ] T034 Create `src/app/auth/login/page.tsx` — email+password form using Supabase Auth; redirect to `/client/dashboard` for clients, `/admin/dashboard` for staff/admin/ceo
- [ ] T035 Create `src/app/auth/register/page.tsx` — new client self-registration form (name, email, password, jurisdiction); creates Supabase auth user + inserts `profiles` row with `role='client'`
- [ ] T036 Create `src/app/auth/invite/page.tsx` — reads `?token=` param, pre-fills email, creates account and links to pending client record
- [ ] T037 [P] Create `src/app/auth/reset-password/page.tsx` — Supabase password reset flow (send link → update password)

### Client Portal Layout

- [ ] T038 Create `src/app/(client)/layout.tsx` — client shell: left sidebar nav (Dashboard, Cases, Documents, Appointments, Messages, Billing), top bar with user avatar + logout, auth guard redirecting to `/auth/login` if no session
- [ ] T039 [P] Create `src/components/client/ClientSidebar.tsx` — navigation links with active state highlighting and unread message badge

### Client Dashboard

- [ ] T040 Create `src/app/(client)/dashboard/page.tsx` — server component; query Supabase for: active cases (top 3), pending document requests, next appointment, outstanding invoice total; pass to client components
- [ ] T041 [P] Create `src/components/client/DashboardCaseCard.tsx` — compact case status card with jurisdiction flag, status badge, due date
- [ ] T042 [P] Create `src/components/client/DashboardInvoiceWidget.tsx` — outstanding balance with "View Invoices" link
- [ ] T043 [P] Create `src/components/client/DashboardAppointmentWidget.tsx` — next appointment date/time with "Book Appointment" link

### Onboarding Wizard

- [ ] T044 Create `src/components/client/OnboardingWizard.tsx` — 3-step wizard shown on first login (step 1: jurisdiction select; step 2: business type + company name; step 3: services of interest); updates `clients` table row on completion, sets `onboarded_at`
- [ ] T045 [US2] Update `src/app/(client)/dashboard/page.tsx` to check if `clients.onboarded_at` is null and render `OnboardingWizard` overlay if so

**Checkpoint**: Clients can register, onboard, and see their personalised dashboard

---

## Phase 5: User Story 3 — Client Portal: Case Tracking & Documents (Priority: P2)

**Goal**: Client views their case timeline, uploads documents, sends messages

**Independent Test**: Log in as seeded client → navigate to case → see timeline stepper → upload a PDF → send a message

### Case Pages

- [ ] T046 Create `src/app/(client)/cases/page.tsx` — list all client cases ordered by `updated_at DESC`; filter tabs: All / Active / Filed / Closed
- [ ] T047 Create `src/app/(client)/cases/[id]/page.tsx` — server component: fetch case, documents, messages, assigned staff; pass to client components
- [ ] T048 Create `src/components/client/CaseTimeline.tsx` — visual stepper component showing: Open → In Review → Pending Docs → Filed → Closed; highlights current step
- [ ] T049 Create `src/components/client/CaseDocumentList.tsx` — list of documents for this case with upload status; "Upload" button triggers file picker
- [ ] T050 Create `src/components/client/MessageThread.tsx` — threaded message view with client/staff avatars; new message textarea + send button

### Document Upload

- [ ] T051 Create `src/app/api/documents/upload/route.ts` — POST handler: validate file type (PDF/DOCX/XLSX/PNG/JPG) and size (≤50MB), upload to Supabase Storage `client-documents/{clientId}/{caseId}/{filename}`, insert `documents` row with `processing_status='pending'`, return document id
- [ ] T052 Create `src/hooks/useDocumentUpload.ts` — handles file selection, calls upload route, tracks progress with `XMLHttpRequest` upload event, updates local state
- [ ] T053 [P] Create `src/components/client/DocumentVault.tsx` — drag-and-drop upload zone using `useDocumentUpload`; shows upload progress bar and success/error state

### Messaging

- [ ] T054 Create `src/app/api/messages/route.ts` — POST: insert message into `messages` table; GET: fetch messages for a case (server-side, scoped to authenticated user)
- [ ] T055 Update `src/components/client/MessageThread.tsx` to subscribe to Supabase Realtime `messages` channel filtered by `case_id` for live message delivery

### Document Vault Page

- [ ] T056 Create `src/app/(client)/documents/page.tsx` — all documents across all cases; filter by case or by year; download link per document from Supabase Storage signed URL

### Invoices & Billing

- [ ] T057 Create `src/app/(client)/billing/page.tsx` — list invoices with status badges (Draft/Sent/Paid/Overdue); download PDF button (signed URL from Supabase Storage `invoices` bucket)

### Appointments

- [ ] T058 Create `src/app/(client)/appointments/page.tsx` — upcoming + past appointments list; "Book New Appointment" button
- [ ] T059 Create `src/components/client/AppointmentPicker.tsx` — date/time picker showing available slots; POST to `src/app/api/appointments/route.ts` which inserts appointment row

**Checkpoint**: Full client portal functional — onboarding, cases, documents, messages, billing, appointments

---

## Phase 6: User Story 4 & 5 — Admin / Staff / CEO Portal (Priority: P3)

**Goal**: Staff manage case queue with AI help; CEO views firm-wide analytics

**Independent Test**: Log in as seeded staff member → see case queue → update a case status → AI summarises a document; log in as CEO → verify revenue/case metrics render

### Admin Portal Layout

- [ ] T060 Create `src/app/(admin)/layout.tsx` — admin shell: sidebar with role-aware nav (Staff sees: Queue, Clients, Cases, Documents, Messages; Admin adds: Staff, Billing; CEO adds: Analytics); auth guard + role check (redirect clients to `/client/dashboard`)
- [ ] T061 Create `src/components/admin/AdminSidebar.tsx` — role-conditional navigation with badge counts (unread messages, pending documents)

### Staff Dashboard

- [ ] T062 Create `src/app/(admin)/dashboard/page.tsx` — for `staff` role: cases assigned + due today (sorted by due_date), unread client messages count, pending document reviews, today's appointments; for `ceo` role: redirect to `/admin/analytics`
- [ ] T063 [P] Create `src/components/admin/CaseQueueTable.tsx` — sortable/filterable table of assigned cases with jurisdiction flag, client name, status, due date, quick-action buttons (View, Mark Filed)
- [ ] T064 [P] Create `src/components/admin/PendingDocumentsList.tsx` — documents awaiting review with case link and "Analyse with AI" button

### Client CRM

- [ ] T065 Create `src/app/(admin)/clients/page.tsx` — searchable client list with jurisdiction filter; staff sees their clients, admin/ceo sees all
- [ ] T066 Create `src/app/(admin)/clients/[id]/page.tsx` — client detail: profile, all cases, all documents, invoices, appointments; "Create New Case" button

### Case Management

- [ ] T067 Create `src/app/(admin)/cases/page.tsx` — all cases with multi-filter (status, jurisdiction, assigned staff, date range)
- [ ] T068 Create `src/app/(admin)/cases/[id]/page.tsx` — case detail: documents, messages, timeline; status update dropdown; "Request Document" button; "Generate Invoice" button; "Analyse with AI" button
- [ ] T069 Create `src/app/api/cases/route.ts` — POST: create new case (requires admin/staff role); validates client_id, jurisdiction, type
- [ ] T070 Create `src/app/api/cases/[id]/route.ts` — PATCH: update case fields (status, notes, due_date, assigned_staff_id); write to `audit_log` on status change

### Document Request & Review

- [ ] T071 Create `src/app/api/documents/request/route.ts` — POST: insert document row with `requested_by=staff_id`, `processing_status='pending'`; trigger `sendDocumentRequestEmail` to client
- [ ] T072 Create `src/components/admin/DocumentReviewPanel.tsx` — view uploaded document (Supabase Storage signed URL iframe for PDF); "Approve" / "Flag" / "Analyse with AI" action buttons

### AI Staff Assistant

- [ ] T073 Create `src/app/api/ai/summarise/route.ts` — POST `{ document_id }`: download PDF from Supabase Storage, send to Claude Vertex AI with `staff-assistant.ts` system prompt requesting structured summary; store result in `documents.extracted_data`; return summary
- [ ] T074 Create `src/app/api/ai/assist/route.ts` — POST `{ prompt, case_id?, client_id? }`: stream Claude response using staff-assistant system prompt + case context from Supabase
- [ ] T075 Create `src/components/admin/AIAssistant.tsx` — sliding drawer with text input + streaming response; shows "Analysing..." while streaming; markdown-rendered output; "Copy" button

### Invoice Management

- [ ] T076 Create `src/app/(admin)/billing/page.tsx` — invoice list with status filter; "Create Invoice" opens modal
- [ ] T077 Create `src/app/api/invoices/route.ts` — POST: create invoice with line items (JSONB), amount, due_date; update case status to trigger client notification; GET: list invoices for admin
- [ ] T078 Create `src/components/admin/InvoiceForm.tsx` — modal form: client select, case link, line items (description + amount), due date, currency; on submit calls invoice API then `sendInvoiceEmail`

### CEO Analytics

- [ ] T079 Create `src/app/(admin)/analytics/page.tsx` — CEO-only page (redirect non-CEO roles); layout: KPI row + charts grid
- [ ] T080 [P] Create `src/app/api/analytics/revenue/route.ts` — query `invoices` table: group by month + jurisdiction for last 12 months; return `{ month, jurisdiction, amount }[]`
- [ ] T081 [P] Create `src/app/api/analytics/cases/route.ts` — group cases by status and jurisdiction; return counts
- [ ] T082 [P] Create `src/components/analytics/RevenueChart.tsx` — Recharts `AreaChart` of monthly revenue by jurisdiction (stacked); date-range + jurisdiction filter
- [ ] T083 [P] Create `src/components/analytics/CasesByStatusChart.tsx` — Recharts `PieChart` with status breakdown
- [ ] T084 [P] Create `src/components/analytics/KPICard.tsx` — reusable card: title, value, trend arrow (vs last period), jurisdiction badge
- [ ] T085 [P] Create `src/components/analytics/JurisdictionBreakdown.tsx` — 4-column grid of KPICards for USA / UK / Saudi / Pakistan showing: clients, active cases, filed this month, revenue

### Audit Log

- [ ] T086 Create `src/lib/audit.ts` — `logAction(actorId, action, entityType, entityId, metadata)` helper that inserts to `audit_log` table via service role client

**Checkpoint**: Staff can manage cases + use AI assistant; CEO sees live firm analytics

---

## Phase 7: User Story 6 — Asset Comparison Dashboard (Priority: P4)

**Goal**: Any user can compare real estate, crypto, stocks historically + see AI-generated forecast + tax implications per jurisdiction

**Independent Test**: Open `/assets/dashboard` → select BTC + S&P 500 → set 5yr → charts render → forecast section shows Claude analysis → tax panel shows UK CGT rates

### Financial Data Infrastructure

- [ ] T087 Create `src/lib/market-data/cache.ts` — `getCachedAssetData(symbol, range)` reads from `asset_cache` Supabase table; `upsertAssetData(symbol, range, dataPoints)` writes; check `last_updated` for freshness
- [ ] T088 Create `src/lib/market-data/alpha-vantage.ts` — `fetchStockHistory(symbol, range)` using Alpha Vantage `TIME_SERIES_MONTHLY_ADJUSTED` endpoint; normalise to `DataPoint[]`; map symbols: `^GSPC`→`SPY`, `^FTSE`→`ISF.L`, `^KSE`→proxy, `^TASI`→proxy
- [ ] T089 Create `src/lib/market-data/coingecko.ts` — `fetchCryptoHistory(coinId, range)` using CoinGecko `/coins/{id}/market_chart`; normalise to `DataPoint[]`; map: BTC→`bitcoin`, ETH→`ethereum`
- [ ] T090 Create `src/lib/market-data/real-estate.ts` — `fetchRealEstateHistory(symbol, range)`: US uses FRED API `CSUSHPISA`; UK uses ONS open data URL; Saudi and Pakistan use static JSON config in `src/lib/market-data/data/`; normalise to `DataPoint[]`
- [ ] T091 [P] Create `src/lib/market-data/data/saudi-re.json` and `src/lib/market-data/data/pakistan-re.json` — quarterly index values 2015–2026 sourced from public reports
- [ ] T092 Create `src/app/api/assets/route.ts` — GET `?symbol=BTC&range=5y`: check cache → fetch if stale → upsert cache → return `DataPoint[]` with `cached_at` timestamp

### Asset Dashboard Page

- [ ] T093 Create `src/app/(assets)/layout.tsx` — minimal layout: navbar with "Return to Portal" link, no auth guard (public access)
- [ ] T094 Create `src/app/(assets)/dashboard/page.tsx` — client component: state for selected assets (max 4), time range, jurisdiction; renders AssetPicker + ComparisonChart + ForecastPanel + TaxImplicationsPanel

### Asset UI Components

- [ ] T095 Create `src/components/assets/AssetPicker.tsx` — tabbed picker: Stocks / Crypto / Real Estate; each tab shows asset cards with logo, name, current price, YTD%; user can select up to 4; selected assets shown as chips with remove button
- [ ] T096 Create `src/components/assets/ComparisonChart.tsx` — Recharts `LineChart` with multiple `Line` elements (one per asset); Y-axis shows % return normalised to 0% at start of range; X-axis shows dates; `ReferenceLine` at 0%; custom `Tooltip` showing date, value, % return for all assets
- [ ] T097 Create `src/components/assets/AssetCard.tsx` — compact card in picker: asset name, symbol, current value, YTD colour-coded %, selection checkbox
- [ ] T098 Create `src/hooks/useAssetData.ts` — accepts `symbols[]` and `range`; fetches each from `/api/assets`; returns `{ data: Record<symbol, DataPoint[]>, isLoading, error, cachedAt }`

### AI Forecast

- [ ] T099 Create `src/app/api/assets/forecast/route.ts` — POST `{ assets: AssetSummary[], jurisdiction, range }`: build context prompt using `asset-forecast.ts` system prompt; call Claude Vertex AI; parse structured JSON response (`ForecastResponse`); return to client
- [ ] T100 Create `src/hooks/useForecast.ts` — POST to forecast API; returns `{ forecast: ForecastResponse | null, isLoading, error }`
- [ ] T101 Create `src/components/assets/ForecastPanel.tsx` — renders Claude's narrative analysis; per-asset outlook table (1yr/3yr/5yr low/mid/high %); key risks list; "AI-generated analysis — not financial advice" disclaimer banner; "Regenerate" button

### Tax Implications Panel

- [ ] T102 Create `src/lib/tax-rules/index.ts` — load and export tax rule configs per jurisdiction from JSON files
- [ ] T103 [P] Create `src/lib/tax-rules/usa.json` — US CGT rates 2026: short-term (ordinary income), long-term (0/15/20%), crypto wash sale rules, real estate exclusion
- [ ] T104 [P] Create `src/lib/tax-rules/uk.json` — UK CGT rates 2026: annual exempt £3k, basic 18%, higher 24%, crypto as capital asset, PRR for primary residence
- [ ] T105 [P] Create `src/lib/tax-rules/saudi.json` — Saudi Arabia: no personal income/CGT; Zakat on business assets; WHT on dividends
- [ ] T106 [P] Create `src/lib/tax-rules/pakistan.json` — Pakistan CGT rates: stocks (15% short, 12.5% long), crypto (not yet regulated as of 2026), property FBR rates
- [ ] T107 Create `src/components/assets/TaxImplicationsPanel.tsx` — jurisdiction picker (USA/UK/Saudi/Pakistan); per-asset tax rate table: CGT rate, holding period threshold, annual exempt amount, filing requirement note; "Consult our {jurisdiction} tax team" CTA linking to contact form

**Checkpoint**: Asset dashboard fully functional — charts, AI forecast, tax panel, public access

---

## Phase 8: Polish & Deployment

**Purpose**: MCP servers, containerisation, CI/CD, production readiness

### MCP Servers

- [ ] T108 Scaffold `mcp-servers/mcp-tax-rules/src/index.ts` — MCP server with tools: `get_tax_rates`, `get_filing_deadlines`, `calculate_tax_estimate`; reads from the tax-rules JSON files in `src/lib/tax-rules/`; build `Dockerfile`
- [ ] T109 Scaffold `mcp-servers/mcp-market-data/src/index.ts` — MCP server wrapping `alpha-vantage.ts`, `coingecko.ts`, `real-estate.ts`; tools: `get_historical_prices`, `get_current_price`, `compare_assets`; build `Dockerfile`
- [ ] T110 Scaffold `mcp-servers/mcp-documents/src/index.ts` — MCP server with tools: `extract_pdf_text`, `parse_bank_statement`, `summarise_document`; uses `pdf-parse` npm package; build `Dockerfile`
- [ ] T111 Scaffold `mcp-servers/mcp-supabase/src/index.ts` — MCP server with read-only tools: `get_client_cases`, `get_case_documents`, `get_client_profile`; authenticates via service role key; build `Dockerfile`

### Supabase Edge Functions

- [ ] T112 Create `supabase/functions/case-status-notification/index.ts` — triggered on `cases` UPDATE; sends `sendCaseStatusEmail` via Resend when status changes
- [ ] T113 [P] Create `supabase/functions/invoice-overdue-check/index.ts` — scheduled daily (cron); finds invoices with `status='sent'` and `due_date < now()`; updates to `overdue`, sends reminder email

### Containerisation & Terraform

- [ ] T114 Complete `Dockerfile` — multi-stage: deps → builder → runner; EXPOSE 3000; health check on `/api/health`
- [ ] T115 Create `src/app/api/health/route.ts` — returns `{ status: 'ok', version, timestamp }` for Cloud Run health checks
- [ ] T116 Complete `terraform/cloud-run.tf` — 5 Cloud Run services: `taxable-app`, `mcp-tax-rules`, `mcp-market-data`, `mcp-documents`, `mcp-supabase`; min-instances, memory, CPU, env from Secret Manager
- [ ] T117 [P] Complete `terraform/iam.tf` — Workload Identity for Cloud Run service accounts; grant Vertex AI `roles/aiplatform.user`; grant inter-service invoke permissions
- [ ] T118 [P] Complete `terraform/secrets.tf` — Secret Manager secrets for all env vars; grant each Cloud Run SA access to its secrets

### CI/CD & Final Checks

- [ ] T119 Update `.github/workflows/deploy.yml` — Cloud Build trigger on push to `main`: build Docker image → push to Artifact Registry → `terraform apply` → Cloud Run deploy
- [ ] T120 Lighthouse audit all 4 app sections; fix any score below 90 in `src/app/(marketing)/` pages

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Start immediately
- **Phase 2 (Foundation)**: Depends on Phase 1 — BLOCKS Phases 3–8
- **Phase 3 (Website)**: Depends on Phase 2 (auth middleware, Claude client, lead API)
- **Phase 4 (Client Onboarding)**: Depends on Phase 2 (auth, profiles, clients tables)
- **Phase 5 (Client Cases/Docs)**: Depends on Phase 4 (client layout, auth context)
- **Phase 6 (Admin Portal)**: Depends on Phase 2 + Phase 5 (messages shared, case data)
- **Phase 7 (Asset Dashboard)**: Depends on Phase 2 (asset_cache table, Claude client) — INDEPENDENT of Phases 3–6
- **Phase 8 (Deploy)**: Depends on all prior phases

### Parallel Opportunities

```bash
# Phase 1 — all parallel after T001:
T002, T003, T004, T005, T006, T007

# Phase 2 — DB first, then parallel:
T008 → T009 → T010 → T011  (sequential migrations)
T012, T013, T014 in parallel
T015, then T016, T017, T018 in parallel
T019, T020, T021 in parallel

# Phase 3 — after T015 (Claude client):
T023, T024 then T025, T026, T027, T028 in parallel
T029, T030 sequential
T031, T032 sequential; T033 parallel

# Phase 7 — after Phase 2 foundation:
T087 → T088, T089, T090 in parallel
T092 → T093, T094 in parallel
T095, T096, T097, T098 in parallel
T099, T100, T101 sequential
T103, T104, T105, T106 in parallel
```

---

## Implementation Strategy

### MVP Scope (Phases 1–3 only)
1. Complete Phase 1 + Phase 2
2. Complete Phase 3 (live website with real chatbot)
3. **Deploy and validate** — website is production-ready
4. Estimated: 2 weeks

### Full Platform Scope
1. Phases 1–2: Foundation (days 1–3)
2. Phase 3: Website (days 3–7)
3. Phases 4–5: Client Portal (days 7–14)
4. Phase 6: Admin Portal (days 14–21)
5. Phase 7: Asset Dashboard (days 21–28)
6. Phase 8: Deploy (days 28–35)

---

## Notes

- `[P]` = parallel-safe (different files, no dependency on an incomplete sibling)
- `[US1]`–`[US6]` = maps to user story in spec.md
- Each checkpoint is a valid demo/deploy state
- Asset dashboard (Phase 7) can be built concurrently with Admin Portal (Phase 6) by a second developer
- MCP servers (Phase 8) can be scaffolded early but are non-blocking — the AI routes work without them initially (direct Claude API calls), MCP adds tool-use capabilities
