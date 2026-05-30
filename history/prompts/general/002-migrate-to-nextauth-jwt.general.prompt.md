---
id: "002"
title: "Migrate to NextAuth JWT Auth"
stage: general
date: "2026-05-25"
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: dilawar.gopang@gmail.com
command: "chat"
labels: ["auth", "nextauth", "firebase-removal", "vercel-deploy"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - src/auth.ts
  - src/auth.config.ts
  - src/proxy.ts
  - src/types/next-auth.d.ts
  - src/app/api/auth/[...nextauth]/route.ts
  - src/app/api/auth/register/route.ts
  - src/app/api/auth/session/route.ts
  - src/app/auth/login/page.tsx
  - src/app/auth/register/page.tsx
  - src/app/auth/reset-password/page.tsx
  - src/lib/auth/session.ts
  - src/components/Providers.tsx
  - src/app/layout.tsx
  - next.config.ts
  - vercel.json
  - scripts/add-password-hash.mjs
tests: []
---

## PROMPT_TEXT

User: "can we not simplify things and use better auth?"
Selected: NextAuth.js (Auth.js) from a presented choice of NextAuth, Clerk, or fix Firebase.

## RESPONSE_TEXT

Replaced Firebase Auth entirely with NextAuth.js v5 (beta) using JWT sessions:

1. Installed `next-auth@beta bcryptjs @types/bcryptjs`
2. Created `src/auth.ts` (Credentials provider with bcrypt password verification)
3. Created `src/auth.config.ts` (edge-safe config for proxy)
4. Created `src/proxy.ts` (Next.js 16 proxy using `getToken` from next-auth/jwt)
5. Created `src/types/next-auth.d.ts` (type extensions for role/uid in session)
6. Created `src/app/api/auth/[...nextauth]/route.ts` (NextAuth handler)
7. Created `src/app/api/auth/register/route.ts` (registration with bcrypt, ADMIN_EMAIL check)
8. Updated login/register/reset-password pages to use next-auth/react
9. Updated `src/lib/auth/session.ts` to use `auth()` from NextAuth
10. Added `SessionProvider` wrapper via `src/components/Providers.tsx`
11. Ran DB migration: added `password_hash text` column + `UNIQUE` constraint on `profiles.email`, deleted stale Firebase profile
12. Set `AUTH_SECRET` and `ADMIN_EMAIL` on Vercel
13. Deployed to production — build clean, endpoints 200

**Admin setup**: `dilawar.gopang@gmail.com` needs to register fresh at /auth/register. Email is in ADMIN_EMAIL env var so they get role=admin automatically.

Deployment: https://taxablewebsite.vercel.app
