# Feature Specification: Taxable AI — Full Platform (4 Pillars)

**Feature Branch**: `002-full-platform`
**Created**: 2026-05-25
**Status**: Approved
**Input**: User vision: "Best Chartered Accountant + Taxation Lawyer platform for USA, UK, Saudi Arabia, Pakistan — with Client Portal, Admin/CEO Internal Portal, and Asset Comparison Dashboard with AI forecasting across real estate, crypto, and stocks."

---

## Overview

This spec covers the complete Taxable AI platform across four integrated pillars:

| Pillar | Status | Priority |
|--------|--------|----------|
| P1 — Public Marketing Website | Scaffold exists, needs enhancement | P1 |
| P2 — Client Portal | Not yet built | P2 |
| P3 — Admin / CEO / Internal Portal | Not yet built | P3 |
| P4 — Asset Comparison Dashboard | Not yet built — highest differentiator | P4 |

**Backend**: Supabase (Postgres + Auth + Storage + RLS)
**AI**: Claude API (`claude-opus-4-7`) for chatbot, document processing, staff assistant, and asset forecasting
**Jurisdictions**: USA, UK, Saudi Arabia, Pakistan

---

## User Scenarios & Testing *(mandatory)*

---

### User Story 1 — Visitor discovers Taxable AI and builds trust (Priority: P1)

A potential client in the UK searches for a CA firm. They land on the Taxable AI website and immediately see a premium, authoritative design. The site speaks directly to UK taxation (HMRC, self-assessment, corporation tax). They navigate to the UK-specific services page, read about the firm's qualifications, see client testimonials, and request a consultation.

**Why this priority**: No portal matters until visitors convert. The website is the top-of-funnel for all revenue.

**Independent Test**: Load homepage, navigate to UK services, fill contact form — all without any auth.

**Acceptance Scenarios**:

1. **Given** a visitor lands on the homepage, **When** the page loads, **Then** hero communicates value within 3 seconds and trust indicators (ICAEW, ACCA, CPA, ZATCA) are visible above the fold
2. **Given** a visitor clicks on a jurisdiction (UK/USA/Saudi/Pakistan), **When** the page loads, **Then** they see jurisdiction-specific compliance authority, tax calendar, and service details
3. **Given** a visitor opens the AI chatbot, **When** they ask "how does corporation tax work in the UK?", **Then** Claude responds with accurate HMRC-specific guidance and invites them to book a consultation
4. **Given** a visitor submits the contact form, **When** submission succeeds, **Then** they receive an email acknowledgement and the team receives a Supabase-logged lead notification

---

### User Story 2 — New client completes onboarding via Client Portal (Priority: P2)

A client referred by the firm receives an email invite. They click the link, create a password, confirm their identity, and complete an onboarding wizard (jurisdiction, business type, services needed). Their dashboard shows their active cases, document vault, upcoming appointments, and unpaid invoices.

**Why this priority**: This is the core revenue loop — without a client portal, all work happens offline and the firm cannot scale.

**Independent Test**: Register with invite token → complete onboarding → view empty dashboard. All testable without any case data.

**Acceptance Scenarios**:

1. **Given** a client receives an invite email with token, **When** they click the link, **Then** they land on a registration page pre-filled with their email
2. **Given** a client completes registration, **When** they enter the portal, **Then** they see an onboarding wizard: jurisdiction, business type, services required
3. **Given** a client is on their dashboard, **When** the page loads, **Then** they see active cases, pending document requests, next appointment, and outstanding balance
4. **Given** a client wants to upload a document, **When** they drag-drop a PDF into the document vault, **Then** it uploads to Supabase Storage, appears in their vault, and notifies their assigned staff member

---

### User Story 3 — Client tracks a live tax filing case (Priority: P2)

A client has an active USA federal tax return filing. They log into the client portal, see the case status "In Review — Staff awaiting W-2 documents", click into the case, upload their W-2, leave a message for their CA, and see the updated status.

**Why this priority**: Real-time case visibility replaces email chains and builds client trust.

**Independent Test**: Create a test case in admin, log in as client, view and interact with the case.

**Acceptance Scenarios**:

1. **Given** a client views a case, **When** they see a document request, **Then** they can upload directly into that request
2. **Given** a client uploads a document to a case, **When** the upload completes, **Then** the assigned staff member receives a portal notification
3. **Given** a client sends a message on a case, **When** the message is sent, **Then** staff see it in the admin portal's message inbox
4. **Given** a case status changes, **When** staff updates it, **Then** client receives email + in-portal notification

---

### User Story 4 — Staff member manages their case queue in Admin Portal (Priority: P3)

A CA on staff logs into the internal portal. They see their assigned cases for today, review uploaded documents from clients, use the AI assistant to draft a HMRC compliance letter, mark a case as filed, and generate an invoice for the client.

**Why this priority**: Staff efficiency directly determines firm capacity and revenue.

**Independent Test**: Create staff account, assign cases, complete a case workflow end-to-end.

**Acceptance Scenarios**:

1. **Given** a staff member logs in, **When** dashboard loads, **Then** they see: cases due today, unread client messages, pending document reviews, calendar
2. **Given** a staff member opens a case document, **When** they click "Analyse with AI", **Then** Claude extracts key figures and returns a structured summary
3. **Given** a staff member completes a case, **When** they mark it "Filed", **Then** the client receives notification and an invoice is generated
4. **Given** a staff member uses the AI assistant, **When** they describe what to draft (e.g., "HMRC penalty appeal for client X"), **Then** Claude returns a structured draft letter

---

### User Story 5 — CEO views firm-wide analytics in Admin Portal (Priority: P3)

The CEO logs in and sees revenue by region (UK, USA, Saudi, Pakistan), cases filed this month vs last month, outstanding invoices, top-performing staff, and client retention rate. They drill down into Saudi Arabia to see all active cases and their status.

**Why this priority**: Strategic visibility drives firm growth decisions.

**Independent Test**: Seed analytics data, log in as CEO, verify all metrics are correct.

**Acceptance Scenarios**:

1. **Given** the CEO is on the analytics dashboard, **When** it loads, **Then** they see revenue trend (12 months), cases by status, clients by jurisdiction, and top staff
2. **Given** the CEO filters by Saudi Arabia, **When** the filter is applied, **Then** all widgets update to show only Saudi data
3. **Given** the CEO views outstanding invoices, **When** they click "Send Reminder", **Then** client receives a payment reminder email

---

### User Story 6 — Client (or public visitor) uses Asset Comparison Dashboard (Priority: P4)

A client wonders whether to put savings into Bitcoin, a UK buy-to-let property, or S&P 500 ETF. They open the Asset Dashboard, select these three asset classes, set a 10-year view, and see overlaid historical performance charts. Below the chart, Claude has generated a narrative: current market context, risk factors per asset class, and a projected 5-year outlook with confidence ranges. The dashboard also shows the tax implications of each asset type under UK law.

**Why this priority**: This is the platform's most differentiated feature — no CA firm provides this. Converts the firm from "compliance shop" to "wealth advisor".

**Independent Test**: Open the dashboard, select 3 assets, view charts and AI forecast. Testable end-to-end without auth (public or client).

**Acceptance Scenarios**:

1. **Given** a user opens the Asset Dashboard, **When** the page loads, **Then** they see a picker for asset classes (Real Estate, Crypto, Stocks) with sub-options per class
2. **Given** a user selects "Bitcoin" and "S&P 500" and sets "5 years", **When** they click Compare, **Then** they see an overlaid interactive line chart with both assets scaled to percentage returns
3. **Given** charts are rendered, **When** the user hovers a data point, **Then** a tooltip shows exact value, date, and percentage change from start
4. **Given** charts are rendered, **When** the AI forecast section loads, **Then** Claude returns a structured analysis: current context, projected 1yr/3yr/5yr performance with confidence range, and key risks
5. **Given** a user is on the dashboard, **When** they click "Tax Implications", **Then** they see capital gains tax treatment for each asset class per their selected jurisdiction (USA/UK/Saudi/Pakistan)
6. **Given** a user selects Pakistan as their jurisdiction and compares KSE-100 vs real estate, **When** the AI forecast loads, **Then** the analysis references Pakistani economic context (SBP rates, inflation, SECP regulations)

---

### Edge Cases

- **Auth expiry during upload**: Show a modal asking user to re-authenticate; preserve the upload queue
- **Financial API rate limit**: Serve cached data from Supabase with a timestamp showing data age; never show empty chart
- **Claude API timeout on forecast**: Show a "Generating analysis..." spinner; retry once; fall back to a "temporarily unavailable" message
- **Non-PDF upload in document vault**: Reject with clear error; list accepted formats (PDF, DOCX, XLSX, images)
- **Client attempts to access another client's case URL**: Supabase RLS blocks at DB level; return 403
- **Jurisdiction mismatch in asset tax layer**: If user has no jurisdiction set, prompt them to select one before showing tax implications
- **Corrupt or encrypted PDF bank statement**: AI processing returns a graceful error with instructions to re-export the PDF
- **Staff tries to delete a filed case**: Soft-delete only; cases are immutable after "Filed" status for audit compliance

---

## Requirements *(mandatory)*

### Pillar 1 — Public Marketing Website

- **FR-W-001**: Website MUST present jurisdiction-specific landing pages for USA, UK, Saudi Arabia, and Pakistan, each referencing the correct compliance authority (IRS, HMRC, ZATCA, FBR)
- **FR-W-002**: AI chatbot MUST be powered by Claude API with a system prompt contextualised for CA/tax law; must handle queries in English, Urdu, and Arabic
- **FR-W-003**: Contact form MUST write leads to Supabase `leads` table and trigger a staff notification email
- **FR-W-004**: Homepage stats MUST be live (pulled from Supabase: client count, cases filed, jurisdictions) — no "Coming Soon" placeholders in production
- **FR-W-005**: Website MUST have a "Get Started" CTA that deep-links into the client portal registration flow
- **FR-W-006**: Blog MUST support MDX content with SEO metadata (Open Graph, structured data)
- **FR-W-007**: Website MUST achieve Lighthouse score ≥ 90 on Performance, Accessibility, SEO

### Pillar 2 — Client Portal

- **FR-C-001**: Client portal MUST require authenticated access via Supabase Auth (email+password + email 2FA)
- **FR-C-002**: Client dashboard MUST display: active cases with status, document requests, next appointment, outstanding balance
- **FR-C-003**: Document vault MUST support upload of PDF, DOCX, XLSX, PNG, JPG up to 50MB per file via Supabase Storage
- **FR-C-004**: Document vault MUST allow the client to organise documents by case or by year
- **FR-C-005**: Case view MUST show a visual timeline/stepper of case status stages
- **FR-C-006**: Client MUST be able to send messages to their assigned staff member, per case thread
- **FR-C-007**: Client MUST receive email notifications when: case status changes, new document requested, message received, invoice issued
- **FR-C-008**: Client MUST be able to view and download invoices as PDF
- **FR-C-009**: Appointment booking MUST show available slots from staff calendar and confirm via email
- **FR-C-010**: Client portal MUST be fully mobile-responsive (PWA-ready)

### Pillar 3 — Admin / CEO / Internal Portal

- **FR-A-001**: Admin portal MUST be accessible only to users with roles: `staff`, `admin`, `ceo` (enforced via Supabase RLS)
- **FR-A-002**: Staff dashboard MUST show: cases assigned (with due dates), unread messages, pending document reviews, today's appointments
- **FR-A-003**: Staff MUST be able to create, assign, update, and close cases
- **FR-A-004**: Staff MUST be able to request documents from a client (sends client a portal + email notification)
- **FR-A-005**: Staff MUST have an AI assistant (Claude API) capable of: summarising uploaded documents, drafting client letters, calculating tax estimates
- **FR-A-006**: Admin MUST be able to manage staff accounts (create, assign jurisdictions, set roles)
- **FR-A-007**: Admin MUST be able to create and send invoices to clients
- **FR-A-008**: CEO dashboard MUST display: revenue by region (monthly/annual), cases by status, client count by jurisdiction, outstanding invoices total, staff utilisation
- **FR-A-009**: CEO dashboard MUST support date-range and jurisdiction filters on all metrics
- **FR-A-010**: Admin portal MUST log all sensitive actions (case status changes, invoice creation, document access) in an audit trail table

### Pillar 4 — Asset Comparison Dashboard

- **FR-D-001**: Dashboard MUST provide historical price data for: S&P 500, FTSE 100, KSE-100, Tadawul (TASI), Bitcoin, Ethereum, and UK/US/Saudi/Pakistan Real Estate indices
- **FR-D-002**: User MUST be able to select any 2–4 assets for comparison in a single chart
- **FR-D-003**: Historical data MUST support 1-year, 3-year, 5-year, and 10-year time ranges
- **FR-D-004**: Chart MUST display percentage-return normalised values (all assets start at 0% for fair comparison)
- **FR-D-005**: Chart MUST support interactive tooltips (date, value, % return from start) and a crosshair
- **FR-D-006**: AI Forecast panel MUST call Claude API with the selected asset(s) + time range + current macro data, and return: narrative analysis, projected performance ranges (1yr/3yr/5yr), key risk factors
- **FR-D-007**: AI Forecast MUST include a disclaimer: "AI-generated analysis is not financial advice"
- **FR-D-008**: Tax Implication panel MUST show capital gains tax rate, holding period rules, and reporting requirements for each selected asset under the user's chosen jurisdiction
- **FR-D-009**: Financial data MUST be cached in Supabase with a 1-hour refresh interval to respect API rate limits; cache age MUST be shown to the user
- **FR-D-010**: Dashboard MUST be accessible to the public (unauthenticated) and also embed within the client portal
- **FR-D-011**: Mobile view MUST show assets in stacked card view; full chart view on tablet/desktop

### Key Entities

- **Profile**: Supabase auth user extended with `full_name`, `role` (client|staff|admin|ceo), `phone`, `preferred_jurisdiction`
- **Client**: Business entity — `company_name`, `business_type`, `jurisdictions[]`, `assigned_staff_id`, `status`
- **Case**: `type` (tax_filing|audit|accounting|consultation), `jurisdiction`, `tax_year`, `status` (open|in_review|pending_docs|filed|closed), `due_date`, `notes`
- **Document**: `file_path` (Supabase Storage), `case_id`, `requested_by`, `processed` (boolean), `extracted_data` (JSONB)
- **Appointment**: `client_id`, `staff_id`, `datetime`, `duration_minutes`, `type`, `status`
- **Message**: `sender_id`, `recipient_id`, `case_id`, `content`, `read_at`
- **Invoice**: `client_id`, `case_id`, `amount`, `currency`, `status` (draft|sent|paid|overdue), `due_date`
- **Lead**: `name`, `email`, `phone`, `company`, `jurisdiction`, `service_interest`, `message`, `source` (chatbot|form|demo)
- **AssetCache**: `asset_type` (stock|crypto|real_estate), `symbol`, `time_range`, `data_points` (JSONB array), `last_updated`
- **AuditLog**: `actor_id`, `action`, `entity_type`, `entity_id`, `metadata` (JSONB), `created_at`

---

## Success Criteria *(mandatory)*

### Website
- **SC-W-001**: Lighthouse ≥ 90 Performance, ≥ 90 Accessibility, ≥ 90 SEO on all pages
- **SC-W-002**: Homepage LCP < 2.5s on 4G connection
- **SC-W-003**: AI chatbot responds within 3 seconds for 95% of queries
- **SC-W-004**: Contact form successfully logs leads to Supabase with 100% reliability

### Client Portal
- **SC-C-001**: Client can complete onboarding (registration → dashboard) in under 4 minutes
- **SC-C-002**: Document upload succeeds for 99% of valid files under 50MB
- **SC-C-003**: Case status updates propagate to client email within 60 seconds
- **SC-C-004**: Portal is usable on mobile (320px+) for all core workflows

### Admin Portal
- **SC-A-001**: Staff can create and assign a new case in under 2 minutes
- **SC-A-002**: AI document summary returns within 15 seconds for PDFs up to 20 pages
- **SC-A-003**: CEO analytics dashboard loads in under 3 seconds for 12-month date range
- **SC-A-004**: Audit log captures 100% of case status changes and invoice operations

### Asset Dashboard
- **SC-D-001**: Charts render within 2 seconds using cached data
- **SC-D-002**: Claude AI forecast returns within 20 seconds for any asset selection
- **SC-D-003**: Historical data covers ≥ 5 years for all supported asset classes
- **SC-D-004**: Tax implication data is accurate for all 4 jurisdictions as of the current tax year
- **SC-D-005**: Dashboard functions on mobile in stacked-card layout with no horizontal scroll

---

## Assumptions

- Supabase free tier is sufficient for MVP; upgrade to Pro as client count grows
- Claude API (`claude-opus-4-7`) budget is managed via a per-request cost model; forecasting calls are rate-limited per user
- Financial data APIs: CoinGecko (free) for crypto; Alpha Vantage free tier for stocks (5 req/min); FRED API for US real estate; UK Land Registry open data for UK property; KSE and Tadawul indices sourced from public data or Yahoo Finance
- Real estate data for Saudi Arabia and Pakistan is index-level only (no address-level granularity)
- All monetary amounts stored in USD with display conversion to local currency
- Pakistan and Saudi Arabia tax rules are provided by the firm's lawyers as JSON config (not scraped or LLM-generated)
- Staff accounts are created by admin only (no self-registration for staff)
- Two-factor authentication is optional for clients at MVP, required for staff
