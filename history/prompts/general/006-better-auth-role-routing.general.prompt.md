---
id: "006"
title: Better Auth Role-Based Portal Routing
stage: green
date: 2026-05-30
surface: agent
model: claude-sonnet-4-6
feature: auth
branch: main
user: Dilawar Shafiq
command: continue session
labels: ["auth", "better-auth", "role-routing", "admin-portal", "client-portal"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - src/lib/auth.ts
  - src/app/api/auth/register/route.ts
  - src/app/api/auth/[...nextauth]/route.ts (deleted)
tests:
  - TypeScript check (npx tsc --noEmit) — PASS
---

## Prompt

"We have a marketing website, Admin portal and Client Portal: Only dilawar Gopang can login to admin portal while rest of all users go to client portal"

## Response snapshot

Enforced role-based portal routing:
1. Fixed admin email default in `register/route.ts` from `hello@taxable.ai` to `dilawar.gopang@gmail.com`
2. Added `databaseHooks.user.create.before` in Better Auth config to auto-assign `admin` role when `dilawar.gopang@gmail.com` registers
3. Deleted conflicting `[...nextauth]/route.ts` (old NextAuth catch-all shadowing Better Auth's `[...all]` handler)
4. Cleared `.next` type cache — TypeScript passes clean

Admin layout redirects non-admin roles → `/client/dashboard`.
Client layout redirects admin/staff/ceo → `/admin/dashboard`.
Login page reads Better Auth session role via `/api/auth/get-session` after sign-in.

## Outcome

- ✅ Impact: Only dilawar.gopang@gmail.com (admin role) can access /admin/* — all other users are redirected to client portal
- 🧪 Tests: TypeScript clean, no build errors
- 📁 Files: 3 changed (1 deleted), 1 committed (549e839)
- 🔁 Next prompts: Test login flow on Vercel; configure GMAIL_USER + GMAIL_APP_PASSWORD for password reset emails
- 🧠 Reflection: The [...nextauth] / [...all] conflict was a silent build issue that could have caused unpredictable routing — resolving it also fixes potential SSR auth failures

## Evaluation notes (flywheel)

- Failure modes observed: Stale .next type cache blocked TypeScript after file deletion; cleared with `rm -rf .next`
- Graders run and results (PASS/FAIL): tsc --noEmit → PASS
- Prompt variant (if applicable): null
- Next experiment: Verify that `/api/auth/get-session` returns the `role` field correctly from Better Auth additionalFields in production
