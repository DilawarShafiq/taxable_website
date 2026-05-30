---
name: 004-ca-knowledge-base-and-enterprise-ai
description: Expanded CA knowledge base with IFRS, R&D credits, EIS/SEIS, EMI, Section 7E, AMT, GILTI/BEAT, audit standards, business valuation; upgraded AI assistant to enterprise-grade agentic; integrations page; DB-backed chat history
metadata:
  type: general
  stage: green
  date: 2026-05-29
  surface: agent
  model: claude-sonnet-4-6
  feature: ai-assistant-and-knowledge-base
  branch: main
---

## Prompt Summary

User: "Do all these missing CA topics (IFRS, UK R&D, EIS/SEIS, EMI, Section 7E, wealth statement, AMT, GILTI/BEAT, payroll, business valuation, audit standards). Do all integrations so clients can integrate anything with easy UI. Make sidebar and AI Assistant enterprise-grade agentic. Chat history persists. Hero 'Chartered Accountancy' → 'Accountancy'."

## Response Summary

### Knowledge Base Expansion

**Expanded existing files:**
- `hmrc-uk.ts`: Added R&D Tax Credits (merged 2024 scheme, SME intensive, Patent Box), EIS/SEIS/VCT, EMI/CSOP/SIP/SAYE, detailed UK payroll (PAYE step-by-step, statutory payments, NLW)
- `fbr-pakistan.ts`: Added Section 7E deemed income (with rates, practical example), Section 116 Wealth Statement (full guide: contents, reconciliation formula, filing process, common mistakes), EOBI/SESSI payroll, SECP compliance
- `irs-usa.ts`: Added AMT (exemptions, rates, ISO planning), state taxes (CA 13.3%, NY 10.9%, TX/FL/WA detailed), multi-state nexus/apportionment, SALT PTET workaround, GILTI (who pays, calculation, FTC), BEAT (who qualifies, how it works), USA payroll (FICA, FUTA, SUTA, 1099 vs W-2)

**Created new knowledge files:**
- `ifrs-accounting.ts`: Financial statements (P&L, balance sheet, cash flows), IFRS 15 (5-step revenue recognition), IFRS 16 (leases, ROU asset, impact on ratios), IAS 16 (PP&E, depreciation methods), IAS 36 (impairment, CGUs), IAS 38 (intangibles, R&D capitalisation), IAS 2 (inventories), IFRS 3 (business combinations, goodwill), IAS 12 (deferred tax)
- `business-valuation.ts`: DCF (full methodology, WACC, CAPM, terminal value), market multiples (EV/EBITDA by sector), comparable companies, precedent transactions, asset-based approach, goodwill (personal vs institutional), M&A process, due diligence, earn-outs, tax structuring
- `audit-standards.ts`: ISA overview (who requires audit by jurisdiction), audit process (planning, testing, completion), materiality calculation, risk assessment, sampling (MUS, statistical), fraud (ISA 240), opinion types (unmodified, qualified, adverse, disclaimer, KAMs), COSO internal controls

**Updated `tax-advisor.ts` prompt builder:** Imports and always appends IFRS, business valuation, and audit knowledge. Added capabilities 6-8 to the system prompt.

### Integrations Page
- New page: `/client/integrations`
- Sidebar updated: Added "Integrations" nav item with `Plug` icon in Account section
- 12 integration cards: Xero, QuickBooks, Sage, FreshBooks (accounting), Open Banking UK, Plaid USA (banking), HMRC MTD, FBR IRIS, ZATCA (tax portals), CSV/Excel, PDF Upload (available now), API/Webhook (developer)
- Filter by category, feature expansion, connect buttons, help text for non-API portals
- CSV/PDF upload links to existing `/client/upload` which is live

### Enterprise-Grade AI Assistant Upgrade
- Explicit **agent mode picker** (dropdown with all 5 agents + descriptions)
- **Copy button** on each response
- **Context counter** (shows N/20 messages in context window)
- **Reasoning toggle** (extended thinking) with Sparkles icon
- **Per-agent starter questions** (different sets for each agent mode)
- **Jurisdiction flags** (emoji + label for each region)
- **Improved markdown styling** (better tables, code blocks, headings)
- **Token efficiency**: last 20 messages sent as context; compressed document content in uploads
- **Dark gradient send button**, better visual hierarchy

### DB-Backed Chat History
- Migration: `supabase/migrations/004_ai_chat_history.sql` — creates `ai_chat_sessions` and `ai_chat_messages` tables with auto-title trigger
- API: `GET/POST /api/client/chat-sessions` — create sessions, append messages, list sessions, load session messages
- Assistant: creates DB session on first message, persists each user+assistant exchange to DB (best-effort, localStorage is primary/fallback)
- Session ID stored in localStorage for continuity

### Hero Fix
- `Hero.tsx`: "AI-Powered Chartered Accountancy" → "AI-Powered Accountancy"

### Enterprise Sidebar
- Grouped into sections: Overview, AI Tools, Work, Account
- "Pro" badge on AI Assistant
- Darker background (`slate-950`), section labels, gradient avatar
- Backdrop blur on mobile drawer overlay

## Files Modified
- src/lib/agents/knowledge/hmrc-uk.ts
- src/lib/agents/knowledge/fbr-pakistan.ts
- src/lib/agents/knowledge/irs-usa.ts
- src/lib/agents/knowledge/ifrs-accounting.ts (new)
- src/lib/agents/knowledge/business-valuation.ts (new)
- src/lib/agents/knowledge/audit-standards.ts (new)
- src/lib/agents/prompts/tax-advisor.ts
- src/app/(client)/client/integrations/page.tsx (new)
- src/app/(client)/client/assistant/page.tsx
- src/app/api/client/chat-sessions/route.ts (new)
- src/components/client/ClientSidebar.tsx
- src/components/sections/Hero.tsx
- supabase/migrations/004_ai_chat_history.sql (new)
