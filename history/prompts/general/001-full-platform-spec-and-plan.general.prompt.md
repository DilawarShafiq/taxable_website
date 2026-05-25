---
id: "001"
title: Full Platform Spec and Plan — 4 Pillars
stage: general
date: 2026-05-25
surface: agent
model: claude-opus-4-7
feature: 002-full-platform
branch: main
user: dilawar.gopang@gmail.com
command: natural language vision prompt
labels: ["spec","plan","architecture","asset-dashboard","client-portal","admin-portal","vertex-ai","mcp","supabase","google-cloud"]
links:
  spec: specs/002-full-platform/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-full-platform/spec.md
  - specs/002-full-platform/plan.md
  - specs/002-full-platform/data-model.md
tests:
  - null
---

## Prompt

This project was an agentic AI project: we are in 2026 and AI has made great innovations specially anthropic search web and make this project the best working project: website, client portal, admin-ceo-internal portal that my devs would use. This app is meant to be the best Chartered Accountant, Taxation lawyer for USA, UK, Saudi Arabia and Pakistan. Additionally, Now a days people want comparisons for different asset class, Like real estate, crypto and stocks. If a system can give them a graph over 5 or ten years history and based on that and current situation and could give its client a foreseeable future growth in different asset class at one dashboard. It would be great if possible.

(Follow-up): I would deploy it on Google Cloud using Vertex AI for Claude + all mcp or custom tools for my specific project

## Response snapshot

Created comprehensive spec, architecture plan, and data model for the full 4-pillar platform:

1. **spec.md** — 6 user stories (P1–P4), 30+ functional requirements across all 4 pillars, key entities (Profile, Client, Case, Document, Appointment, Message, Invoice, Lead, AssetCache, AuditLog), measurable success criteria, edge cases
2. **plan.md** — Full architecture: Claude on Vertex AI, Supabase backend, 4 custom MCP servers (mcp-tax-rules, mcp-market-data, mcp-documents, mcp-supabase), complete database schema with RLS, full source tree, 6-phase implementation timeline (10 weeks), Terraform IaC, environment variable config
3. **data-model.md** — Supported asset instruments (stocks/crypto/RE per jurisdiction), tax rules config structure, Claude forecast prompt/response schema, Supabase storage buckets, Realtime subscription patterns

Key decisions: Supabase (Postgres+Auth+Storage+RLS), Claude opus-4-7 via Vertex AI, MCP servers as separate Cloud Run services, Recharts for charts, Resend for email.

## Outcome

- ✅ Impact: Complete architectural foundation for all 4 pillars ready for implementation
- 🧪 Tests: None yet — design phase
- 📁 Files: specs/002-full-platform/spec.md, plan.md, data-model.md
- 🔁 Next prompts: /sp.tasks to generate detailed task breakdown; or start Phase 1 implementation
- 🧠 Reflection: Asset Comparison Dashboard is the highest-differentiator feature; MCP architecture is the right pattern for giving Claude firm-specific tools without bloating prompts

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Generate tasks.md and begin Phase 1 Supabase setup
