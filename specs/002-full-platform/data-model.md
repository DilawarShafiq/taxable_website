# Data Model: Taxable AI Full Platform

**Date**: 2026-05-25 | **Plan**: [plan.md](./plan.md)

---

## Entity Relationship Overview

```
auth.users (Supabase)
    └── profiles (1:1)
         ├── clients (1:1 via profile_id)   ← role = 'client'
         └── staff accounts                  ← role = 'staff'|'admin'|'ceo'

clients
    ├── cases (1:many)
    │    ├── documents (1:many)
    │    ├── messages (1:many)
    │    └── invoices (1:many)
    └── appointments (1:many)

leads (standalone — not linked to clients until converted)

asset_cache (standalone — financial data cache)

audit_log (standalone — immutable event log)
```

---

## Asset Comparison: Supported Instruments

### Stocks
| Symbol | Name | Exchange | Jurisdiction |
|--------|------|----------|--------------|
| `^GSPC` | S&P 500 Index | NYSE | USA |
| `^FTSE` | FTSE 100 Index | LSE | UK |
| `^KSE` | KSE-100 Index | PSX | Pakistan |
| `^TASI` | Tadawul All Share Index | Tadawul | Saudi Arabia |
| `^NDX` | NASDAQ-100 | NASDAQ | USA |

### Crypto
| Symbol | Name |
|--------|------|
| `BTC` | Bitcoin |
| `ETH` | Ethereum |
| `BNB` | BNB |
| `SOL` | Solana |
| `XRP` | XRP |

### Real Estate Indices
| Symbol | Name | Data Source |
|--------|------|-------------|
| `RE_US` | US Case-Shiller National HPI | FRED API |
| `RE_UK` | UK Average House Price Index | ONS / Land Registry |
| `RE_SA` | Saudi Real Estate Price Index | Proxy / Cityscape |
| `RE_PK` | Pakistan Property Price Index | Proxy / Zameen / SBP |

---

## Tax Rules Config Structure (mcp-tax-rules JSON)

```json
{
  "jurisdiction": "uk",
  "year": 2026,
  "capital_gains_tax": {
    "stock": {
      "annual_exempt": 3000,
      "basic_rate_pct": 18,
      "higher_rate_pct": 24,
      "holding_period_short_days": 0,
      "notes": "No short vs long-term distinction in UK; rates depend on income band"
    },
    "crypto": {
      "annual_exempt": 3000,
      "basic_rate_pct": 18,
      "higher_rate_pct": 24,
      "notes": "HMRC treats crypto as capital asset; each disposal is a taxable event"
    },
    "real_estate": {
      "primary_residence_exempt": true,
      "basic_rate_pct": 18,
      "higher_rate_pct": 28,
      "notes": "Private Residence Relief applies to primary home; BTL at higher rate"
    }
  },
  "income_tax_bands": [...],
  "filing_deadlines": {
    "self_assessment": "2027-01-31",
    "corporation_tax": "9 months after accounting period end"
  },
  "compliance_authority": "HMRC",
  "authority_url": "https://www.gov.uk/capital-gains-tax"
}
```

---

## Claude Forecast Prompt Structure

```typescript
// Input context sent to Claude for asset forecasting
interface ForecastContext {
  selected_assets: Array<{
    symbol: string;
    name: string;
    asset_type: "stock" | "crypto" | "real_estate";
    historical_data: DataPoint[];          // Last 5-10 years
    current_value: number;
    ytd_pct_change: number;
  }>;
  user_jurisdiction: "usa" | "uk" | "saudi" | "pakistan";
  time_range: "1y" | "3y" | "5y" | "10y";
  today: string;                            // ISO date
}

// Expected Claude response structure
interface ForecastResponse {
  summary: string;                          // 2-3 sentence overview
  assets: Array<{
    symbol: string;
    outlook_1yr: { low_pct: number; mid_pct: number; high_pct: number };
    outlook_3yr: { low_pct: number; mid_pct: number; high_pct: number };
    outlook_5yr: { low_pct: number; mid_pct: number; high_pct: number };
    key_risks: string[];
    key_tailwinds: string[];
    narrative: string;                      // Per-asset analysis paragraph
  }>;
  comparison_insight: string;               // How the assets compare to each other
  tax_reminder: string;                     // Jurisdiction-specific tax note
  disclaimer: string;                       // "Not financial advice"
  generated_at: string;
}
```

---

## Supabase Storage Buckets

| Bucket | Access | Purpose |
|--------|--------|---------|
| `client-documents` | Private (RLS) | Client-uploaded tax docs, bank statements |
| `case-files` | Private (RLS) | Staff-uploaded case working papers |
| `invoices` | Private (RLS) | Generated invoice PDFs |
| `public-assets` | Public | Website images, blog assets |

---

## Realtime Subscriptions (Client Portal)

```typescript
// Client listens for case status changes
supabase
  .channel(`case:${caseId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'cases',
    filter: `id=eq.${caseId}`
  }, (payload) => updateCaseStatus(payload.new.status))
  .subscribe();

// Client listens for new messages
supabase
  .channel(`messages:${caseId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `case_id=eq.${caseId}`
  }, (payload) => appendMessage(payload.new))
  .subscribe();
```
