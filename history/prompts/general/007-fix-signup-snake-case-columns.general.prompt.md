---
id: 007
title: Fix signup failing — Better Auth snake_case column mapping
stage: green
date: 2026-06-01
surface: agent
model: claude-opus-4-8
feature: none
branch: main
user: dilawar.gopang@gmail.com
command: debug + fix
labels: ["auth", "better-auth", "bugfix", "signup", "database"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/lib/auth.ts
tests:
 - Live DB verification: auth.api.signUpEmail + signInEmail against Cloud SQL (PASS, test row cleaned up)
---

## Prompt

new client tried to create an account but failed why
(follow-ups: "use one system a simple one please" → chose Better Auth;
"use what works best for now i am loosing clients"; "we were able to sign up
previously now its all fucked. its so simple to fix")

## Response snapshot

Root cause: The "Migrate auth from NextAuth v5 to Better Auth" commit switched
auth libraries but did not re-map column names. The existing tables
(user/account/session/verification) use snake_case columns (email_verified,
created_at, user_id, account_id, provider_id, ...) — created under the previous
NextAuth schema and already holding 5 live users. Better Auth defaults to
camelCase column names, so every signup/signin INSERT/SELECT referenced columns
that don't exist → "Registration failed".

Fix (code-only, no DB migration): added explicit `fields` mappings + `modelName`
for user, session, account, and verification models in src/lib/auth.ts so Better
Auth reads/writes the real snake_case columns. Verified by running a real
signUpEmail + signInEmail against the production Cloud SQL database (both PASS),
then deleting the test rows. Existing 5 users now also resolvable.

## Outcome

- ✅ Impact: Signup and signin work again; no data migration needed; existing users preserved.
- 🧪 Tests: Live Better Auth signUp/signIn against Cloud SQL — PASS; test row removed.
- 📁 Files: src/lib/auth.ts (field/modelName mappings added; removed duplicate session block).
- 🔁 Next prompts: Deploy to Vercel; later consolidate the redundant /api/auth/register profiles upsert.
- 🧠 Reflection: When swapping auth libraries against an existing schema, always reconcile column naming (camelCase vs snake_case) before shipping.

## Evaluation notes (flywheel)

- Failure modes observed: Library default column naming silently diverged from existing schema; no migration caught it.
- Graders run and results (PASS/FAIL): Live signup/signin verification PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): Add a startup/CI smoke test that performs a throwaway signUp/signIn against a test DB.
