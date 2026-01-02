<!--
  Sync Impact Report
  ==================
  Version change: 0.0.0 → 1.0.0 (MAJOR - initial constitution)

  Modified principles: N/A (initial creation)

  Added sections:
    - Core Principles (6 principles)
    - Technology Standards
    - Security & Compliance
    - Governance

  Removed sections: N/A

  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ (compatible)
    - .specify/templates/spec-template.md ✅ (compatible)
    - .specify/templates/tasks-template.md ✅ (compatible)

  Follow-up TODOs: None
-->

# Taxable AI Constitution

## Core Principles

### I. Enterprise-Grade Visual Excellence

The marketing website MUST deliver a stunning, world-class visual experience that establishes immediate credibility for enterprise clients. All UI components MUST be:
- Visually polished with premium aesthetics (smooth animations, micro-interactions, sophisticated color palettes)
- Fully responsive across all device sizes (mobile-first approach)
- Accessible (WCAG 2.1 AA compliant)
- Performance-optimized (Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1)

### II. AI-First Value Proposition

The website MUST prominently showcase AI capabilities as the core differentiator:
- AI Agents for taxation, spreadsheet processing, and document analysis MUST be featured as primary offerings
- AI Chatbot integration MUST be visible and accessible from all pages
- PDF bank statement upload and AI processing MUST be demonstrated as a key conversion path
- Trust signals (security badges, encryption indicators) MUST accompany all AI features

### III. Multi-Jurisdiction Authority

Content MUST establish expertise across all operational regions:
- Pakistan, UK, USA, Saudi Arabia, UAE jurisdictions MUST have dedicated content sections
- Region-specific tax regulations, compliance requirements, and services MUST be clearly articulated
- Currency and language localization MUST be supported where applicable
- Local contact information and operating hours MUST be displayed per region

### IV. Conversion-Optimized Architecture

Every page MUST be designed with clear conversion paths:
- Primary CTA (Get Started / Upload Documents) visible above the fold
- Secondary CTAs strategically placed throughout content
- Trust builders (testimonials, certifications, case studies) positioned near CTAs
- Friction-minimized forms with progressive disclosure
- Clear pricing/service tiers to qualify leads

### V. Security-First Communication

All messaging MUST emphasize data security and compliance:
- Bank-level encryption for document uploads MUST be prominently communicated
- GDPR, SOC 2, and regional compliance certifications MUST be displayed
- Privacy policy and data handling practices MUST be transparent and accessible
- Secure document portal positioning MUST differentiate from competitors

### VI. Professional Service Authority

Content MUST establish chartered accountant expertise:
- Credentials and certifications (ACCA, CPA, etc.) MUST be prominently displayed
- Service depth (taxation, audits, accounts, bookkeeping) MUST be comprehensively covered
- Team expertise and experience MUST be showcased
- Industry-specific knowledge MUST be demonstrated through content

## Technology Standards

**Frontend Framework**: Next.js 14+ with App Router (SSR/SSG for SEO)
**Styling**: Tailwind CSS with custom design system
**Animation**: Framer Motion for premium interactions
**UI Components**: shadcn/ui as foundation with custom enterprise extensions
**Icons**: Lucide React
**Forms**: React Hook Form with Zod validation
**State Management**: React Server Components + minimal client state
**Analytics**: Privacy-respecting analytics (Plausible/Fathom)
**Deployment**: Vercel (optimal Next.js performance)
**AI Integration**: API routes for chatbot and document processing

**Performance Budget**:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Bundle size (initial): < 200KB gzipped

**Browser Support**: Last 2 versions of Chrome, Firefox, Safari, Edge

## Security & Compliance

**Data Handling**:
- All file uploads MUST use encrypted connections (TLS 1.3)
- Uploaded documents MUST NOT be stored on client-side
- PII MUST be handled according to GDPR and regional requirements
- Session management MUST follow OWASP best practices

**Regional Compliance**:
- Pakistan: FBR regulations awareness
- UK: HMRC and ICO compliance
- USA: IRS and state-specific requirements
- Saudi Arabia: ZATCA requirements
- UAE: FTA compliance

**Audit Trail**:
- All user interactions with AI features MUST be logged
- Document upload/processing events MUST be traceable
- Analytics MUST respect DNT headers

## Governance

This constitution establishes the foundational principles for the Taxable AI marketing website. All design decisions, technical implementations, and content strategies MUST align with these principles.

**Amendment Process**:
1. Proposed amendments MUST be documented with rationale
2. Changes affecting security or compliance require stakeholder approval
3. Version increments follow semantic versioning (MAJOR.MINOR.PATCH)

**Compliance Review**:
- All pull requests MUST be checked against constitution principles
- UI/UX changes MUST maintain visual excellence standards
- New features MUST not compromise performance budgets

**Guidance**: For runtime development guidance, refer to `CLAUDE.md` and feature-specific specs.

**Version**: 1.0.0 | **Ratified**: 2026-01-03 | **Last Amended**: 2026-01-03
