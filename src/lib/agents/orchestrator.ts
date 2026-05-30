/**
 * Multi-Agent Orchestrator
 *
 * Reads the user's message + context and routes to the most appropriate
 * specialist agent system prompt. Each agent has different priorities,
 * response formats, and knowledge loading strategies.
 */

import { buildTaxAdvisorPrompt } from "./prompts/tax-advisor";
import { buildDocumentAnalyzerPrompt } from "./prompts/document-analyzer";
import { buildCompliancePrompt } from "./prompts/compliance-monitor";
import type { AgentType, AgentContext } from "./types";

// ─── Intent detection ──────────────────────────────────────────────────────────

const DOCUMENT_PATTERNS = [
  /upload/i, /analyse|analyze/i, /statement/i, /invoice/i, /receipt/i,
  /payslip|payroll/i, /p60|p11d|p45/i, /spreadsheet|excel|csv/i,
  /extract|parse/i, /what does this/i, /check this/i, /review this/i,
];

const COMPLIANCE_PATTERNS = [
  /deadline/i, /when.*due/i, /due date/i, /filing date/i, /late.*penalt/i,
  /register/i, /compliance/i, /regulation/i, /must.*file/i, /remind/i,
  /upcoming/i, /calendar/i, /schedule/i, /what.*need.*do/i,
];

const MARKET_PATTERNS = [
  /investment/i, /stock|share/i, /crypto|bitcoin|ethereum/i, /property price/i,
  /market.*performance/i, /portfolio/i, /asset.*comparison/i, /forecast/i,
  /s&p|ftse|nasdaq|kse|tasi/i, /real estate.*market/i, /capital gain/i,
];

function detectIntent(message: string): AgentType {
  if (DOCUMENT_PATTERNS.some((p) => p.test(message))) return "document_analyzer";
  if (COMPLIANCE_PATTERNS.some((p) => p.test(message))) return "compliance_monitor";
  if (MARKET_PATTERNS.some((p) => p.test(message))) return "market_analyst";
  return "tax_advisor"; // default — most queries are tax advice
}

// ─── System prompt builder ─────────────────────────────────────────────────────

function buildClientProfile(context: AgentContext): string {
  const lines: string[] = [];
  if (context.clientName) lines.push(`- Name: ${context.clientName}`);
  if (context.companyName) lines.push(`- Company: ${context.companyName}`);
  if (context.businessType) lines.push(`- Business type: ${context.businessType.replace(/_/g, " ")}`);
  if (context.jurisdictions?.length) lines.push(`- Tax jurisdictions: ${context.jurisdictions.join(", ")}`);
  if (!lines.length) return "";
  return `## CLIENT PROFILE\nAlways personalise responses using this client's details:\n${lines.join("\n")}\n\nAddress the client by first name when greeting. Tailor all advice, rates, and deadlines to their specific jurisdictions and business type.\n`;
}

export function buildSystemPrompt(
  latestMessage: string,
  context: AgentContext
): { systemPrompt: string; agentType: AgentType } {
  // Allow explicit override from context (e.g. user selected an agent)
  const detectedAgent = context.agentType !== "general"
    ? context.agentType
    : detectIntent(latestMessage);

  const jurisdictions = context.jurisdictions?.length > 0
    ? context.jurisdictions
    : ["pakistan", "uk", "usa", "saudi", "uae"]; // default: all jurisdictions

  const profileBlock = buildClientProfile({ ...context, jurisdictions });

  let agentPrompt: string;

  switch (detectedAgent) {
    case "document_analyzer":
      agentPrompt = buildDocumentAnalyzerPrompt(jurisdictions);
      break;
    case "compliance_monitor":
      agentPrompt = buildCompliancePrompt(jurisdictions);
      break;
    case "market_analyst":
      agentPrompt = buildMarketAnalystPrompt(jurisdictions, context);
      break;
    default:
      agentPrompt = buildTaxAdvisorPrompt(jurisdictions);
  }

  // Prepend client profile so every agent personalises its responses
  const systemPrompt = profileBlock ? `${profileBlock}\n---\n\n${agentPrompt}` : agentPrompt;

  return { systemPrompt, agentType: detectedAgent };
}

// ─── Market analyst prompt (inline — references asset knowledge) ───────────────

function buildMarketAnalystPrompt(jurisdictions: string[], context: AgentContext): string {
  return `You are a Financial Market Analyst and Investment Tax Advisor at Taxable AI. You have deep knowledge of investment taxation across Pakistan, UK, USA, Saudi Arabia, and UAE, combined with expertise in multi-asset portfolio analysis.

## YOUR CAPABILITIES

1. **Asset Class Analysis**: Stocks, crypto, real estate — performance, risk, and tax treatment
2. **Investment Taxation**: CGT rules, holding period optimisation, loss harvesting strategies
3. **Portfolio Comparisons**: Compare returns across asset classes with tax-adjusted perspective
4. **Cross-Jurisdiction Tax Planning**: Identify optimal jurisdictions for investment holding
5. **Market Intelligence**: Interpret market data, trends, and economic indicators

## INVESTMENT TAX RULES BY JURISDICTION

### Pakistan (FBR)
- Listed shares held > 3 years: **0% CGT**
- Shares held < 1 year: **15% CGT** (filer) / 20% (non-filer)
- Crypto: treated as capital asset — CGT applies on disposal
- Foreign investments must be declared in wealth statement (Section 116)
- Dividend income: 15% WHT (section 150)

### UK (HMRC)
- Annual CGT exemption: **£3,000**
- Basic rate payers: 10% on investments, 18% on residential property
- Higher rate payers: 20% on investments, 24% on residential property
- ISA wrapper: up to £20,000/year — all gains and income tax-free permanently
- Crypto: capital asset — each disposal is taxable event
- Bed & ISA strategy for crystallising gains within exemption

### USA (IRS)
- Long-term CGT (>1 year): 0%, 15%, or 20% depending on income
- Short-term: taxed as ordinary income
- Crypto: capital asset — every trade, sale, or exchange is taxable
- Wash sale rule: applies to stocks (NOT yet crypto)
- 1031 Exchange: defer gains on real estate by reinvesting
- Opportunity Zones: powerful deferral and exclusion tool

### Saudi Arabia (ZATCA)
- No capital gains tax on listed Saudi stocks for Saudi nationals
- Non-resident investors: 20% CIT on Saudi-source income
- Real Estate Transaction Tax (RETT): 5% on property transactions
- Dividends from Saudi companies to non-residents: 5% WHT

### UAE (FTA)
- **No personal income tax** — individuals pay zero on investment gains
- No CGT for individuals on shares, crypto, or real estate
- Dubai Land Department: 4% transfer fee on property purchases
- Corporate investors: 9% CIT on profits above AED 375,000
- Free Zone entities: 0% on qualifying income (conditions apply)
- No WHT on dividends or interest payments to individuals
- Crypto: no specific tax guidance yet for individuals; companies subject to CT if above threshold

## RESPONSE GUIDELINES

- When asked about performance: present data in table format with % returns
- When comparing assets: use side-by-side tables showing returns AND tax-adjusted returns
- When advising on timing: calculate holding period impact on tax explicitly
- Always present both pre-tax and after-tax return estimates

Today: ${new Date().toISOString().split("T")[0]}
Client jurisdictions: ${jurisdictions.join(", ")}`;
}
