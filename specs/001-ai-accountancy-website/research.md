# Research: Taxable AI Marketing Website

**Feature Branch**: `001-ai-accountancy-website`
**Date**: 2026-01-03

## Technology Stack Decisions

### 1. Frontend Framework: Next.js 14+ with App Router

**Decision**: Next.js 14.2+ with App Router (React Server Components)

**Rationale**:
- SSR/SSG capabilities essential for SEO (marketing website)
- App Router provides better performance with React Server Components
- Built-in image optimization for visual excellence
- Excellent Vercel deployment integration
- Constitution mandates Next.js 14+ with App Router

**Alternatives Considered**:
- Gatsby: Good for static sites but less flexible for dynamic features (chatbot, uploads)
- Remix: Excellent but smaller ecosystem, fewer enterprise examples
- Astro: Great for content sites but React integration less seamless

### 2. Styling: Tailwind CSS + shadcn/ui

**Decision**: Tailwind CSS 3.4+ with shadcn/ui component library

**Rationale**:
- Utility-first approach enables rapid premium UI development
- shadcn/ui provides accessible, customizable enterprise components
- Constitution mandates this stack
- Excellent dark mode support (future consideration)
- Small bundle size with purging

**Alternatives Considered**:
- Styled Components: Runtime overhead, less performant
- CSS Modules: More verbose, harder to maintain consistency
- Chakra UI: Heavier bundle, less customizable

### 3. Animation: Framer Motion

**Decision**: Framer Motion 11+

**Rationale**:
- Industry standard for React animations
- Constitution mandates for "premium interactions"
- Excellent scroll-triggered animations (hero sections, reveals)
- GPU-accelerated, performant
- Great developer experience with declarative API

**Alternatives Considered**:
- GSAP: More powerful but steeper learning curve, licensing considerations
- React Spring: Good but less intuitive API
- CSS animations only: Limited for complex interactions

### 4. Form Handling: React Hook Form + Zod

**Decision**: React Hook Form with Zod validation

**Rationale**:
- Constitution mandates this combination
- Minimal re-renders for form performance
- Zod provides TypeScript-first schema validation
- Excellent error handling for user experience

**Alternatives Considered**:
- Formik: More re-renders, larger bundle
- Native forms: Insufficient validation capabilities

### 5. AI Integration Architecture

**Decision**: Next.js API Routes as BFF (Backend for Frontend)

**Rationale**:
- API routes proxy requests to external AI services
- Keeps API keys secure on server
- Enables rate limiting and request transformation
- Supports streaming responses for chatbot

**Architecture**:
```
Client → Next.js API Routes → External AI APIs
                           → Chatbot API
                           → Document Processing API
```

### 6. File Upload Strategy

**Decision**: Direct upload with client-side validation + server processing

**Rationale**:
- Client-side PDF validation (type, size) for immediate feedback
- Server-side processing via API route
- No client-side storage (constitution requirement)
- Progress indicators via upload events

**Flow**:
1. User selects PDF → client validates type/size
2. Upload to API route → server validates
3. Forward to AI processing API → stream progress
4. Return results → display in UI
5. Clear session data after display

### 7. Deployment: Vercel

**Decision**: Vercel hosting platform

**Rationale**:
- Constitution mandates Vercel
- Optimal Next.js performance (same company)
- Edge functions for global performance
- Automatic HTTPS/SSL
- Preview deployments for QA

### 8. Analytics: Plausible

**Decision**: Plausible Analytics (privacy-respecting)

**Rationale**:
- Constitution requires privacy-respecting analytics
- GDPR compliant without cookie consent for basic tracking
- Lightweight script (~1KB)
- No personal data collection

**Alternatives Considered**:
- Fathom: Similar but slightly higher cost
- Google Analytics: Privacy concerns, heavier

## Performance Strategy

### Core Web Vitals Targets (Constitution)
- LCP < 2.5s (target: < 2.0s)
- FID < 100ms (target: < 50ms)
- CLS < 0.1 (target: < 0.05)

### Implementation Approach
1. **Image Optimization**: Next.js Image component with WebP/AVIF
2. **Font Loading**: next/font with font-display: swap
3. **Code Splitting**: Dynamic imports for non-critical components
4. **Lazy Loading**: Intersection Observer for below-fold content
5. **Caching**: ISR for semi-dynamic content, static for marketing pages

## Accessibility Strategy (WCAG 2.1 AA)

1. **Semantic HTML**: Proper heading hierarchy, landmarks
2. **Keyboard Navigation**: Focus management, skip links
3. **Screen Readers**: ARIA labels, live regions for chatbot
4. **Color Contrast**: 4.5:1 minimum, 7:1 for important text
5. **Motion**: Respect prefers-reduced-motion

## Content Architecture

### Page Structure
```
/                       # Homepage (P1)
/services/              # Services overview
/services/taxation/     # Tax services detail
/services/audits/       # Audit services detail
/services/accounting/   # Accounting services detail
/ai-agents/            # AI Agents showcase (P4)
/regions/              # Regional overview
/regions/pakistan/     # Pakistan-specific
/regions/uk/           # UK-specific
/regions/usa/          # USA-specific
/regions/saudi-arabia/ # Saudi Arabia-specific
/regions/uae/          # UAE-specific
/about/                # About & Team (P6)
/contact/              # Contact form (P5)
/demo/                 # AI Demo / Upload (P3)
/privacy/              # Privacy Policy
/terms/                # Terms of Service
```

### Component Architecture
```
components/
├── ui/                 # shadcn/ui base components
├── layout/             # Header, Footer, Navigation
├── sections/           # Homepage sections, reusable blocks
├── features/           # Chatbot, Upload, AI Demos
├── forms/              # Contact, Lead capture
└── shared/             # Cards, Buttons, CTAs
```

## External Dependencies

### Required APIs (Not Built Here)
1. **Chatbot API**: Endpoint for conversational AI
   - Expected: POST /api/chat with message history
   - Returns: Streamed text response

2. **Document Processing API**: PDF bank statement analysis
   - Expected: POST /api/process with PDF file
   - Returns: Extracted transactions, categories, summary

### Third-Party Services
1. **Email Service**: SendGrid or Resend for form notifications
2. **Analytics**: Plausible Cloud or self-hosted
3. **Error Tracking**: Sentry (optional)

## Security Considerations

1. **HTTPS Only**: Enforced via Vercel
2. **CSP Headers**: Strict Content Security Policy
3. **Rate Limiting**: API routes protected
4. **Input Sanitization**: All form inputs validated
5. **No Secrets in Client**: API keys server-side only
