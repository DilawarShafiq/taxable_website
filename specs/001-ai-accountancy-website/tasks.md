# Tasks: Taxable AI Marketing Website

**Input**: Design documents from `/specs/001-ai-accountancy-website/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.yaml, quickstart.md

**Tests**: Not explicitly requested - test tasks omitted. Add if needed.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project Structure**: Next.js App Router with `src/` directory
- Pages: `src/app/(marketing)/`
- Components: `src/components/`
- Content: `src/content/`
- API: `src/app/api/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize Next.js 14+ project with TypeScript in project root
- [ ] T002 Install core dependencies (tailwindcss, framer-motion, lucide-react, react-hook-form, zod)
- [ ] T003 [P] Configure Tailwind CSS in tailwind.config.ts with custom theme colors
- [ ] T004 [P] Initialize shadcn/ui with base configuration in components.json
- [ ] T005 [P] Create global styles in src/app/globals.css with Tailwind directives
- [ ] T006 [P] Create TypeScript types in src/types/content.ts for all content entities
- [ ] T007 [P] Create TypeScript types in src/types/api.ts for API request/response
- [ ] T008 Create utility functions in src/lib/utils.ts (cn helper, formatters)
- [ ] T009 [P] Create Zod validation schemas in src/lib/validations.ts
- [ ] T010 Create .env.example with all required environment variables

**Checkpoint**: Project initialized with all dependencies and configuration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T011 Install shadcn/ui components: button, card, input, form, dialog, select, textarea, badge, separator, skeleton, toast
- [ ] T012 Create root layout in src/app/layout.tsx with metadata, fonts, and global providers
- [ ] T013 [P] Create Header component in src/components/layout/Header.tsx with logo and navigation
- [ ] T014 [P] Create Footer component in src/components/layout/Footer.tsx with links and contact info
- [ ] T015 [P] Create MobileMenu component in src/components/layout/MobileMenu.tsx with slide-out navigation
- [ ] T016 Create Navigation component in src/components/layout/Navigation.tsx with menu items
- [ ] T017 [P] Create AnimatedSection wrapper in src/components/shared/AnimatedSection.tsx with Framer Motion
- [ ] T018 [P] Create useInView hook in src/hooks/useInView.ts for scroll animations
- [ ] T019 Create 404 page in src/app/not-found.tsx with navigation back to home
- [ ] T020 [P] Create custom animation styles in src/styles/animations.css

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Discover Services and Build Trust (Priority: P1) 🎯 MVP

**Goal**: Deliver stunning homepage with hero, services overview, AI showcase, regions, testimonials, and trust indicators. Visitors immediately understand value proposition.

**Independent Test**: Load homepage, verify hero displays within 3 seconds, scroll to see all sections, click navigation to service/region pages.

### Content Data for US1

- [ ] T021 [P] [US1] Create services content in src/content/services/taxation.json
- [ ] T022 [P] [US1] Create services content in src/content/services/audits.json
- [ ] T023 [P] [US1] Create services content in src/content/services/accounting.json
- [ ] T024 [P] [US1] Create regions content in src/content/regions/pakistan.json
- [ ] T025 [P] [US1] Create regions content in src/content/regions/uk.json
- [ ] T026 [P] [US1] Create regions content in src/content/regions/usa.json
- [ ] T027 [P] [US1] Create regions content in src/content/regions/saudi-arabia.json
- [ ] T028 [P] [US1] Create regions content in src/content/regions/uae.json
- [ ] T029 [P] [US1] Create testimonials content in src/content/testimonials/testimonials.json
- [ ] T030 [P] [US1] Create team members content in src/content/team/members.json

### Homepage Sections for US1

- [ ] T031 [US1] Create Hero section in src/components/sections/Hero.tsx with animated headline, value proposition, CTA
- [ ] T032 [P] [US1] Create ServiceCard component in src/components/shared/ServiceCard.tsx
- [ ] T033 [US1] Create ServicesOverview section in src/components/sections/ServicesOverview.tsx with 3 service cards
- [ ] T034 [US1] Create AICapabilities section in src/components/sections/AICapabilities.tsx showcasing AI features
- [ ] T035 [P] [US1] Create RegionCard component in src/components/shared/RegionCard.tsx
- [ ] T036 [US1] Create RegionsMap section in src/components/sections/RegionsMap.tsx with 5 regions
- [ ] T037 [P] [US1] Create TestimonialCard component in src/components/shared/TestimonialCard.tsx
- [ ] T038 [US1] Create Testimonials section in src/components/sections/Testimonials.tsx with carousel/grid
- [ ] T039 [US1] Create TrustIndicators section in src/components/sections/TrustIndicators.tsx with badges
- [ ] T040 [US1] Create CTASection component in src/components/sections/CTASection.tsx

### Pages for US1

- [ ] T041 [US1] Create Homepage in src/app/(marketing)/page.tsx combining all sections
- [ ] T042 [P] [US1] Create Services overview page in src/app/(marketing)/services/page.tsx
- [ ] T043 [P] [US1] Create Taxation service page in src/app/(marketing)/services/taxation/page.tsx
- [ ] T044 [P] [US1] Create Audits service page in src/app/(marketing)/services/audits/page.tsx
- [ ] T045 [P] [US1] Create Accounting service page in src/app/(marketing)/services/accounting/page.tsx
- [ ] T046 [P] [US1] Create Regions overview page in src/app/(marketing)/regions/page.tsx
- [ ] T047 [P] [US1] Create Pakistan region page in src/app/(marketing)/regions/pakistan/page.tsx
- [ ] T048 [P] [US1] Create UK region page in src/app/(marketing)/regions/uk/page.tsx
- [ ] T049 [P] [US1] Create USA region page in src/app/(marketing)/regions/usa/page.tsx
- [ ] T050 [P] [US1] Create Saudi Arabia region page in src/app/(marketing)/regions/saudi-arabia/page.tsx
- [ ] T051 [P] [US1] Create UAE region page in src/app/(marketing)/regions/uae/page.tsx

**Checkpoint**: Homepage and core pages fully functional - MVP complete

---

## Phase 4: User Story 2 - Interact with AI Chatbot (Priority: P2)

**Goal**: AI chatbot widget accessible from all pages, responds to queries, captures leads.

**Independent Test**: Click chatbot icon on any page, send message, receive response, submit lead info.

### Chatbot Implementation for US2

- [ ] T052 [US2] Create useChat hook in src/hooks/useChat.ts for chat state management
- [ ] T053 [P] [US2] Create ChatMessage component in src/components/features/Chatbot/ChatMessage.tsx
- [ ] T054 [P] [US2] Create ChatInput component in src/components/features/Chatbot/ChatInput.tsx
- [ ] T055 [US2] Create ChatWindow component in src/components/features/Chatbot/ChatWindow.tsx
- [ ] T056 [US2] Create ChatWidget component in src/components/features/Chatbot/ChatWidget.tsx (floating button + window)
- [ ] T057 [US2] Create chat API route in src/app/api/chat/route.ts for message handling
- [ ] T058 [US2] Create chat lead capture API in src/app/api/chat/lead/route.ts
- [ ] T059 [US2] Add ChatWidget to root layout in src/app/layout.tsx

**Checkpoint**: Chatbot functional on all pages

---

## Phase 5: User Story 3 - Upload Bank Statement for AI Processing (Priority: P3)

**Goal**: Secure PDF upload with AI processing demo showing extracted transactions and categories.

**Independent Test**: Navigate to demo page, upload PDF, see progress, view extracted results.

### Upload Feature for US3

- [ ] T060 [US3] Create useUpload hook in src/hooks/useUpload.ts for upload state management
- [ ] T061 [P] [US3] Create UploadZone component in src/components/features/Upload/UploadZone.tsx (drag & drop)
- [ ] T062 [P] [US3] Create UploadProgress component in src/components/features/Upload/UploadProgress.tsx
- [ ] T063 [US3] Create ResultsDisplay component in src/components/features/Upload/ResultsDisplay.tsx
- [ ] T064 [US3] Create upload API route in src/app/api/upload/route.ts
- [ ] T065 [P] [US3] Create status API route in src/app/api/upload/[sessionId]/status/route.ts
- [ ] T066 [P] [US3] Create result API route in src/app/api/upload/[sessionId]/result/route.ts
- [ ] T067 [US3] Create Demo page in src/app/(marketing)/demo/page.tsx with upload interface

**Checkpoint**: Document upload demo fully functional

---

## Phase 6: User Story 4 - Learn About AI Agents (Priority: P4)

**Goal**: Showcase page for all AI agents with descriptions, capabilities, and visual demos.

**Independent Test**: Navigate to AI Agents page, view all agent cards, see capabilities for each.

### AI Agents Showcase for US4

- [ ] T068 [P] [US4] Create AI agents content in src/content/ai-agents/tax-agent.json
- [ ] T069 [P] [US4] Create AI agents content in src/content/ai-agents/spreadsheet-agent.json
- [ ] T070 [P] [US4] Create AI agents content in src/content/ai-agents/document-agent.json
- [ ] T071 [P] [US4] Create AI agents content in src/content/ai-agents/bookkeeping-agent.json
- [ ] T072 [US4] Create AgentCard component in src/components/shared/AgentCard.tsx
- [ ] T073 [US4] Create AI Agents page in src/app/(marketing)/ai-agents/page.tsx

**Checkpoint**: AI Agents showcase complete

---

## Phase 7: User Story 5 - Request Consultation or Quote (Priority: P5)

**Goal**: Contact form with validation, email notifications, and confirmation.

**Independent Test**: Fill contact form, submit, see confirmation, verify email sent.

### Contact Form for US5

- [ ] T074 [US5] Create ContactForm component in src/components/forms/ContactForm.tsx with React Hook Form + Zod
- [ ] T075 [P] [US5] Create QuoteForm component in src/components/forms/QuoteForm.tsx (extended contact)
- [ ] T076 [P] [US5] Create LeadCaptureForm component in src/components/forms/LeadCaptureForm.tsx (minimal)
- [ ] T077 [US5] Create contact API route in src/app/api/contact/route.ts with email integration
- [ ] T078 [US5] Create Contact page in src/app/(marketing)/contact/page.tsx

**Checkpoint**: Contact form fully functional with email notifications

---

## Phase 8: User Story 6 - Explore About and Team (Priority: P6)

**Goal**: About page with company story, mission, values, and team member profiles.

**Independent Test**: Navigate to About page, view company info, see team profiles with credentials.

### About Page for US6

- [ ] T079 [US6] Create TeamMemberCard component in src/components/shared/TeamMemberCard.tsx
- [ ] T080 [US6] Create TeamGrid section in src/components/sections/TeamGrid.tsx
- [ ] T081 [US6] Create About page in src/app/(marketing)/about/page.tsx

**Checkpoint**: About page complete with team profiles

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Performance optimization, accessibility, legal pages, final polish

### Legal & Compliance

- [ ] T082 [P] Create Privacy Policy page in src/app/(marketing)/privacy/page.tsx
- [ ] T083 [P] Create Terms of Service page in src/app/(marketing)/terms/page.tsx
- [ ] T084 Create cookie consent component in src/components/shared/CookieConsent.tsx

### Performance & Accessibility

- [ ] T085 Add metadata and SEO optimization to all pages
- [ ] T086 Implement image optimization with next/image throughout
- [ ] T087 Add loading states with Skeleton components to all async sections
- [ ] T088 Audit and fix accessibility (ARIA labels, focus states, keyboard navigation)
- [ ] T089 Add scroll-triggered animations to all major sections

### Final Validation

- [ ] T090 Run Lighthouse audit and fix performance issues
- [ ] T091 Test responsive design on mobile, tablet, desktop
- [ ] T092 Validate all forms and error states
- [ ] T093 Test chatbot and upload flows end-to-end
- [ ] T094 Run quickstart.md validation - verify all setup steps work

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Phase 2 completion
  - US1 (P1) → US2 (P2) → US3 (P3) → US4 (P4) → US5 (P5) → US6 (P6)
  - Can run in parallel after Phase 2 if team capacity allows
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (Homepage/Services)**: No dependencies - core foundation
- **US2 (Chatbot)**: Independent, but benefits from US1 pages existing
- **US3 (Upload Demo)**: Independent, but benefits from US1 navigation
- **US4 (AI Agents)**: Independent
- **US5 (Contact)**: Independent
- **US6 (About)**: Independent

### Within Each User Story

- Content data before components
- Shared components before pages
- API routes before features that use them
- Core implementation before integration

### Parallel Opportunities

**Phase 1 (Setup)**:
```
T003, T004, T005, T006, T007, T009, T010 can run in parallel
```

**Phase 2 (Foundational)**:
```
T013, T014, T015, T17, T018, T020 can run in parallel
```

**Phase 3 (US1 Content)**:
```
T021-T030 (all content files) can run in parallel
T042-T051 (all page files) can run in parallel after components
```

**Phase 4-8 (User Stories)**:
```
Different user stories can run in parallel with different developers
Within each story: [P] marked tasks can run in parallel
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T010)
2. Complete Phase 2: Foundational (T011-T020)
3. Complete Phase 3: User Story 1 (T021-T051)
4. **STOP and VALIDATE**: Test homepage and all core pages
5. Deploy to Vercel for demo

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Homepage MVP → Deploy
3. Add User Story 2 → Chatbot live → Deploy
4. Add User Story 3 → AI Demo live → Deploy
5. Add User Story 4-6 → Full feature set → Deploy
6. Polish phase → Production ready

### Parallel Team Strategy

With multiple developers after Phase 2:
- Developer A: User Story 1 (Homepage/Services)
- Developer B: User Story 2 (Chatbot)
- Developer C: User Story 3 (Upload Demo)
- Then: US4, US5, US6 as capacity allows

---

## Task Summary

| Phase | Description | Task Count |
|-------|-------------|------------|
| Phase 1 | Setup | 10 |
| Phase 2 | Foundational | 10 |
| Phase 3 | US1 - Homepage/Services | 31 |
| Phase 4 | US2 - Chatbot | 8 |
| Phase 5 | US3 - Upload Demo | 8 |
| Phase 6 | US4 - AI Agents | 6 |
| Phase 7 | US5 - Contact | 5 |
| Phase 8 | US6 - About | 3 |
| Phase 9 | Polish | 13 |
| **Total** | | **94** |

**Parallel Opportunities**: 45+ tasks can run in parallel
**MVP Scope**: Phases 1-3 (51 tasks)

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All file paths are relative to project root
