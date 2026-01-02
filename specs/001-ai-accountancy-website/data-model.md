# Data Model: Taxable AI Marketing Website

**Feature Branch**: `001-ai-accountancy-website`
**Date**: 2026-01-03

## Overview

This document defines the data structures for the Taxable AI marketing website. As a primarily static marketing site with dynamic features (chatbot, uploads), most data is content-driven with minimal runtime persistence.

## Content Entities (Static/CMS)

### Service

Represents a core service offering.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (slug) |
| name | string | Display name (e.g., "Taxation Services") |
| shortName | string | Navigation label (e.g., "Taxation") |
| description | string | Brief description (1-2 sentences) |
| longDescription | string | Full page content (markdown) |
| icon | string | Lucide icon name |
| benefits | string[] | List of key benefits |
| processSteps | ProcessStep[] | Service delivery process |
| regions | string[] | Available region IDs |
| ctaText | string | Call-to-action button text |
| ctaLink | string | CTA destination URL |
| featured | boolean | Show on homepage |
| order | number | Display order |

### ProcessStep

Represents a step in service delivery.

| Field | Type | Description |
|-------|------|-------------|
| step | number | Step number (1, 2, 3...) |
| title | string | Step title |
| description | string | Step description |
| icon | string | Optional icon |

### Region

Represents a supported jurisdiction.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (slug) |
| name | string | Country name |
| code | string | ISO country code (PK, GB, US, SA, AE) |
| flag | string | Flag emoji or image path |
| authority | string | Tax authority name (FBR, HMRC, IRS, ZATCA, FTA) |
| complianceInfo | string | Regulations summary (markdown) |
| services | string[] | Available service IDs |
| contactEmail | string | Regional contact email |
| contactPhone | string | Regional phone number |
| address | string | Office address |
| operatingHours | string | Business hours with timezone |
| currency | string | Primary currency (PKR, GBP, USD, SAR, AED) |

### AIAgent

Represents an AI capability.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (slug) |
| name | string | Agent display name |
| tagline | string | Short description (< 10 words) |
| description | string | Full description (markdown) |
| icon | string | Lucide icon name |
| capabilities | string[] | List of capabilities |
| useCases | UseCase[] | Example use cases |
| demoAvailable | boolean | Has interactive demo |
| demoLink | string | Demo page URL (if available) |
| featured | boolean | Show on homepage |
| order | number | Display order |

### UseCase

Represents an AI agent use case example.

| Field | Type | Description |
|-------|------|-------------|
| title | string | Use case title |
| description | string | Brief description |
| outcome | string | Result/benefit |

### TeamMember

Represents a company team member.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Full name |
| role | string | Job title |
| bio | string | Short biography |
| image | string | Photo URL/path |
| credentials | string[] | Certifications (ACCA, CPA, etc.) |
| linkedin | string | LinkedIn profile URL (optional) |
| featured | boolean | Show on About page |
| order | number | Display order |

### Testimonial

Represents client feedback.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| clientName | string | Client name |
| clientRole | string | Client title/role |
| company | string | Company name |
| quote | string | Testimonial text |
| image | string | Client photo (optional) |
| region | string | Client region ID |
| service | string | Related service ID |
| featured | boolean | Show on homepage |
| order | number | Display order |

## Runtime Entities (Transient)

### Lead

Represents a contact form submission.

| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| name | string | Contact name |
| email | string | Email address |
| phone | string | Phone number (optional) |
| company | string | Company name (optional) |
| serviceInterest | string | Selected service ID |
| region | string | Selected region ID |
| message | string | Inquiry message |
| source | string | Form source (contact, quote, chatbot) |
| submittedAt | ISO datetime | Submission timestamp |

*Note: Leads are sent via email notification; not persisted in website database.*

### ChatMessage

Represents a chatbot conversation message.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Message UUID |
| sessionId | string | Chat session ID |
| role | 'user' \| 'assistant' | Message sender |
| content | string | Message text |
| timestamp | ISO datetime | Message time |

### ChatSession

Represents an active chatbot conversation.

| Field | Type | Description |
|-------|------|-------------|
| sessionId | string | UUID |
| messages | ChatMessage[] | Conversation history |
| leadCaptured | boolean | Lead info collected |
| leadData | Partial<Lead> | Captured lead info (optional) |
| createdAt | ISO datetime | Session start |
| lastActivity | ISO datetime | Last message time |

*Note: Chat sessions are client-side only; not persisted server-side.*

### DocumentUpload

Represents a PDF upload for AI processing.

| Field | Type | Description |
|-------|------|-------------|
| sessionId | string | Upload session UUID |
| fileName | string | Original file name |
| fileSize | number | File size in bytes |
| status | UploadStatus | Processing status |
| progress | number | Progress percentage (0-100) |
| result | ProcessingResult | Extracted data (when complete) |
| createdAt | ISO datetime | Upload start time |
| expiresAt | ISO datetime | Session expiry (auto-cleanup) |

### UploadStatus

Enum for document processing states.

| Value | Description |
|-------|-------------|
| uploading | File being transferred |
| processing | AI analyzing document |
| complete | Results ready |
| error | Processing failed |

### ProcessingResult

Represents extracted bank statement data.

| Field | Type | Description |
|-------|------|-------------|
| transactions | Transaction[] | Extracted transactions |
| summary | Summary | Aggregated statistics |
| categories | CategoryBreakdown[] | Spending by category |

### Transaction

Represents an extracted bank transaction.

| Field | Type | Description |
|-------|------|-------------|
| date | string | Transaction date |
| description | string | Transaction description |
| amount | number | Transaction amount |
| type | 'credit' \| 'debit' | Transaction type |
| category | string | AI-assigned category |
| confidence | number | Category confidence (0-1) |

### Summary

Represents statement summary statistics.

| Field | Type | Description |
|-------|------|-------------|
| totalCredits | number | Sum of credits |
| totalDebits | number | Sum of debits |
| netChange | number | Credits - Debits |
| transactionCount | number | Total transactions |
| dateRange | { start: string, end: string } | Statement period |

### CategoryBreakdown

Represents spending by category.

| Field | Type | Description |
|-------|------|-------------|
| category | string | Category name |
| amount | number | Total amount |
| percentage | number | Percentage of total |
| count | number | Transaction count |

## Type Definitions (TypeScript)

```typescript
// Content types
interface Service {
  id: string;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  icon: string;
  benefits: string[];
  processSteps: ProcessStep[];
  regions: string[];
  ctaText: string;
  ctaLink: string;
  featured: boolean;
  order: number;
}

interface Region {
  id: string;
  name: string;
  code: string;
  flag: string;
  authority: string;
  complianceInfo: string;
  services: string[];
  contactEmail: string;
  contactPhone: string;
  address: string;
  operatingHours: string;
  currency: string;
}

interface AIAgent {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  capabilities: string[];
  useCases: UseCase[];
  demoAvailable: boolean;
  demoLink?: string;
  featured: boolean;
  order: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  credentials: string[];
  linkedin?: string;
  featured: boolean;
  order: number;
}

interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  company: string;
  quote: string;
  image?: string;
  region: string;
  service: string;
  featured: boolean;
  order: number;
}

// Runtime types
interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceInterest: string;
  region: string;
  message: string;
  source: 'contact' | 'quote' | 'chatbot';
  submittedAt: string;
}

interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
  leadCaptured: boolean;
  leadData?: Partial<Lead>;
  createdAt: string;
  lastActivity: string;
}

interface DocumentUpload {
  sessionId: string;
  fileName: string;
  fileSize: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  progress: number;
  result?: ProcessingResult;
  error?: string;
  createdAt: string;
  expiresAt: string;
}
```

## Data Sources

| Entity | Source | Notes |
|--------|--------|-------|
| Service | Static JSON/MDX | Content in `/content/services/` |
| Region | Static JSON | Content in `/content/regions/` |
| AIAgent | Static JSON/MDX | Content in `/content/ai-agents/` |
| TeamMember | Static JSON | Content in `/content/team/` |
| Testimonial | Static JSON | Content in `/content/testimonials/` |
| Lead | API Route → Email | No database persistence |
| ChatSession | Client State | React state, no server storage |
| DocumentUpload | Client State + API | Transient processing only |
