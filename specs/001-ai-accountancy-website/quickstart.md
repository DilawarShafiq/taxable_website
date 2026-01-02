# Quickstart: Taxable AI Marketing Website

## Prerequisites

- Node.js 18.17+ (LTS recommended)
- pnpm 8+ (preferred) or npm 10+
- Git

## Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd taxable

# Install dependencies
pnpm install
```

### 2. Environment Configuration

Create `.env.local` from the template:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# AI Integration (required for chatbot and document processing)
CHATBOT_API_URL=https://api.example.com/chat
CHATBOT_API_KEY=your-chatbot-api-key
DOCUMENT_API_URL=https://api.example.com/process
DOCUMENT_API_KEY=your-document-api-key

# Email Notifications (required for contact forms)
EMAIL_SERVICE=resend  # or 'sendgrid'
EMAIL_API_KEY=your-email-api-key
EMAIL_FROM=noreply@taxable.ai
EMAIL_TO=leads@taxable.ai

# Analytics (optional)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=taxable.ai

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_CHATBOT=true
NEXT_PUBLIC_ENABLE_DEMO=true
```

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
taxable/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (marketing)/        # Marketing pages group
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── about/          # About page
│   │   │   ├── contact/        # Contact page
│   │   │   ├── demo/           # AI Demo page
│   │   │   ├── services/       # Services pages
│   │   │   ├── ai-agents/      # AI Agents showcase
│   │   │   └── regions/        # Regional pages
│   │   ├── api/                # API routes
│   │   │   ├── contact/        # Contact form handler
│   │   │   ├── chat/           # Chatbot API
│   │   │   └── upload/         # Document upload API
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Header, Footer, Navigation
│   │   ├── sections/           # Page sections (Hero, Features, etc.)
│   │   ├── features/           # Chatbot, Upload components
│   │   └── forms/              # Form components
│   ├── lib/                    # Utilities and helpers
│   │   ├── utils.ts            # General utilities
│   │   ├── api.ts              # API client functions
│   │   └── validations.ts      # Zod schemas
│   ├── content/                # Static content (JSON/MDX)
│   │   ├── services/           # Service data
│   │   ├── regions/            # Region data
│   │   ├── ai-agents/          # AI Agent data
│   │   ├── team/               # Team member data
│   │   └── testimonials/       # Testimonial data
│   ├── hooks/                  # Custom React hooks
│   └── types/                  # TypeScript type definitions
├── public/
│   ├── images/                 # Static images
│   └── fonts/                  # Custom fonts (if any)
├── specs/                      # Feature specifications
├── .env.example                # Environment template
├── tailwind.config.ts          # Tailwind configuration
├── next.config.js              # Next.js configuration
└── package.json
```

## Key Commands

```bash
# Development
pnpm dev              # Start dev server (port 3000)
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript check

# Testing
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode
pnpm test:e2e         # Run E2E tests (Playwright)

# Code Quality
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting
```

## Development Workflow

### Adding a New Page

1. Create page file in `src/app/(marketing)/`:
   ```tsx
   // src/app/(marketing)/new-page/page.tsx
   export default function NewPage() {
     return <div>New Page Content</div>
   }
   ```

2. Add to navigation in `src/components/layout/Header.tsx`

### Adding UI Components (shadcn/ui)

```bash
pnpm dlx shadcn-ui@latest add button
pnpm dlx shadcn-ui@latest add card
pnpm dlx shadcn-ui@latest add form
```

### Adding Content

1. Add JSON file to appropriate `src/content/` directory
2. Import and use in components

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/contact` | POST | Submit contact form |
| `/api/chat` | POST | Send chat message (streaming) |
| `/api/chat/lead` | POST | Capture lead from chat |
| `/api/upload` | POST | Upload PDF document |
| `/api/upload/[sessionId]/status` | GET | Get processing status |
| `/api/upload/[sessionId]/result` | GET | Get processing results |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

```bash
# Or use Vercel CLI
vercel --prod
```

### Environment Variables in Vercel

Add all variables from `.env.local` to Vercel project settings:
- Settings → Environment Variables
- Add each variable for Production, Preview, and Development

## Troubleshooting

### Common Issues

**Port 3000 in use:**
```bash
pnpm dev -- -p 3001
```

**Dependencies issues:**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**TypeScript errors:**
```bash
pnpm type-check
```

**Build failures:**
```bash
pnpm build 2>&1 | head -50  # See first errors
```

## Performance Testing

```bash
# Run Lighthouse audit
npx lighthouse http://localhost:3000 --view

# Check bundle size
pnpm build
npx @next/bundle-analyzer
```

## Accessibility Testing

```bash
# Run axe accessibility audit
npx axe http://localhost:3000
```
