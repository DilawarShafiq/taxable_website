export const BUSINESS_VALUATION_KNOWLEDGE = `
# BUSINESS VALUATION & FINANCIAL ANALYSIS — KNOWLEDGE BASE
# Methods: DCF, Multiples, Asset-Based | M&A Advisory | Updated: June 2025

## OVERVIEW OF BUSINESS VALUATION

### Why Valuation Matters
- **M&A transactions**: buying or selling a business
- **Tax purposes**: HMRC/FBR/IRS require valuation for gift/estate tax, share schemes
- **Investment**: raising equity from investors
- **Litigation/divorce**: business asset disputes
- **ESOP/share schemes**: setting option exercise prices

### The Three Approaches
1. **Income Approach** — value based on future earning capacity (DCF)
2. **Market Approach** — value based on comparable companies or transactions (multiples)
3. **Asset Approach** — value based on net assets (book or fair value)

---

## DISCOUNTED CASH FLOW (DCF) ANALYSIS

### Concept
Value = Present value of all future free cash flows discounted at a rate reflecting risk.

### Step-by-Step DCF

**Step 1: Project Free Cash Flow (FCF)**
Free Cash Flow to Firm (FCFF):
- EBIT × (1 − tax rate) [= NOPAT]
- + Depreciation & amortisation
- − Capital expenditure
- − Increase in working capital
= **Free Cash Flow**

**Step 2: Determine the Discount Rate (WACC)**
Weighted Average Cost of Capital:
- WACC = (E/V × Ke) + (D/V × Kd × (1−T))
- E = market value of equity, D = market value of debt, V = E+D
- Ke = cost of equity (CAPM: Rf + β × (Rm−Rf) + size/specific risk premium)
- Kd = pre-tax cost of debt, T = tax rate

**CAPM Inputs:**
- Risk-free rate (Rf): 10-year government bond yield (UK: ~4.5%, US: ~4.3%, Pakistan: ~12%)
- Market risk premium (Rm−Rf): typically 4%–6% for developed markets, 6%–9% emerging markets
- Beta (β): measures systematic risk — 1.0 = same as market, >1 = more volatile, <1 = less volatile

**Example WACC:**
- Equity: £8m (67%), Debt: £4m (33%)
- Cost of equity (CAPM): 4.5% + 1.2 × 5.5% = **11.1%**
- Cost of debt: 5% pre-tax × (1−25%) = **3.75%**
- WACC = 67% × 11.1% + 33% × 3.75% = **8.7%**

**Step 3: Calculate Terminal Value**
After explicit forecast period (typically 5–10 years):
- **Gordon Growth Model**: TV = FCF_n × (1 + g) ÷ (WACC − g)
  - g = long-term sustainable growth rate (typically GDP growth: 2%–3% developed, 4%–6% emerging)
- **Exit Multiple**: TV = EBITDA_n × exit multiple

**Step 4: Discount All Cash Flows**
- DCF Value = Σ [FCF_t ÷ (1+WACC)^t] + TV ÷ (1+WACC)^n

**Step 5: Arrive at Equity Value**
- Enterprise Value (EV) = DCF Value
- Equity Value = EV − Net Debt (debt − cash)

### DCF Sensitivity Analysis
Always present a sensitivity table showing value at different WACC and growth rate combinations:
| WACC → | 7%    | 8.7%  | 10%   |
|--------|-------|-------|-------|
| g = 2% | £X    | £Y    | £Z    |
| g = 3% | £X    | £Y    | £Z    |
| g = 4% | £X    | £Y    | £Z    |

---

## MARKET MULTIPLES APPROACH

### Enterprise Value Multiples (Most Common)

| Multiple          | Formula               | Typical Range (mid-market) |
|-------------------|-----------------------|-----------------------------|
| EV/EBITDA         | EV ÷ EBITDA           | 4x–12x (sector dependent)   |
| EV/EBIT           | EV ÷ EBIT             | 6x–15x                      |
| EV/Revenue        | EV ÷ Revenue          | 0.5x–4x (SaaS: 3x–15x)     |
| EV/EBITDA-Capex   | EV ÷ (EBITDA−Capex)   | Capital-intensive sectors    |

**Equity Multiples:**
| Multiple          | Formula               | Use                         |
|-------------------|-----------------------|-----------------------------|
| P/E               | Price ÷ EPS           | Profitable companies         |
| P/Book            | Price ÷ Book Value    | Financial institutions       |
| P/Sales           | Price ÷ Revenue       | Pre-profit companies         |

### Sector-Specific EBITDA Multiples (Indicative)
| Sector                      | EV/EBITDA Range |
|-----------------------------|-----------------|
| SaaS / Tech                 | 8x – 20x        |
| Professional services       | 5x – 10x        |
| Manufacturing               | 4x – 8x         |
| Retail                      | 3x – 7x         |
| Healthcare                  | 7x – 15x        |
| Real estate                 | Asset-based (cap rate approach) |
| Financial services          | P/Book 0.8x – 2.5x |

### Comparable Companies Analysis (Public Comps)
1. Select 5–10 publicly traded comparable companies
2. Calculate EV for each: market cap + net debt
3. Compute multiples: EV/EBITDA, P/E
4. Apply median/mean multiple to subject company's metrics
5. Apply control premium (+20%–40% for private M&A transactions)
6. Apply DLOM (Discount for Lack of Marketability: 10%–35% for private companies)

### Precedent Transactions Analysis
- Look at actual M&A deal multiples in the sector
- Control premium already embedded in transaction prices
- Data sources: Capital IQ, Mergermarket, Bloomberg, PitchBook

---

## ASSET-BASED APPROACH

### Net Asset Value (NAV) / Book Value
- Equity = Total Assets − Total Liabilities (from balance sheet)
- Simple but understates intangible value (goodwill, brands, customer lists)

### Adjusted Net Asset Value
- Revalue all assets to fair market value
- Include off-balance-sheet assets (internally generated brands, patents)
- Deduct contingent liabilities at expected value
- Add tax on unrealised gains
- Result: **Adjusted NAV**

### When to Use Asset Approach
- Asset-heavy businesses (property, investment holding companies)
- Distressed businesses where income approach is unreliable
- Regulated businesses (utilities, banks — often use P/Book)
- Dissolution or liquidation scenarios

---

## GOODWILL

### What is Goodwill?
The premium paid over fair value of identifiable net assets — represents:
- Customer relationships, brand reputation
- Workforce in place, know-how
- Synergies expected from the acquisition

### Accounting Treatment
- **IFRS**: Goodwill not amortised — tested annually for impairment
- **US GAAP**: Private companies may amortise over 10 years (simplified option)
- **UK GAAP (FRS 102)**: Goodwill amortised over useful life (max 10 years if can't estimate)
- **Pakistan (IFRS-based)**: Follows IFRS — annual impairment test, no amortisation

### Goodwill Impairment
- If recoverable amount of CGU < carrying amount (including goodwill): impair
- Impairment: first written off against goodwill, then allocated to other assets
- Cannot be reversed once impaired

### Personal Goodwill vs Business Goodwill
- **Personal goodwill**: value tied to specific individual (e.g., doctor's practice)
  - Reduces on sale if key person leaves
  - Lower value, lower transferability
- **Institutional goodwill**: value in the business itself (brand, systems, processes)
  - Fully transferable on sale
  - Commands higher multiple

---

## FINANCIAL ANALYSIS RATIOS

### Profitability
| Ratio                    | Formula                              | Benchmark (varies by sector) |
|--------------------------|--------------------------------------|------------------------------|
| Gross Margin             | Gross Profit ÷ Revenue               | > 40% (SaaS), 20% (manufacturing) |
| EBITDA Margin            | EBITDA ÷ Revenue                     | > 15% healthy                |
| Net Profit Margin        | PAT ÷ Revenue                        | Varies widely                |
| Return on Equity (ROE)   | PAT ÷ Average Equity                 | > 15% good                   |
| Return on Capital (ROCE) | EBIT ÷ (Equity + Debt)               | > WACC is value-creating      |

### Liquidity
| Ratio                    | Formula                              | Benchmark                    |
|--------------------------|--------------------------------------|------------------------------|
| Current Ratio            | Current Assets ÷ Current Liabilities | 1.5 – 2.5                   |
| Quick Ratio (Acid Test)  | (CA − Inventories) ÷ CL             | > 1.0                        |
| Cash Ratio               | Cash ÷ CL                            | Industry dependent           |

### Leverage / Gearing
| Ratio                    | Formula                              | Benchmark                    |
|--------------------------|--------------------------------------|------------------------------|
| Debt/Equity              | Total Debt ÷ Equity                  | < 1.0 for most sectors       |
| Net Debt/EBITDA          | Net Debt ÷ EBITDA                    | < 2x comfortable, > 4x high  |
| Interest Coverage        | EBIT ÷ Interest Expense             | > 3x (covenant often 2x)     |

### Efficiency
| Ratio                    | Formula                              |
|--------------------------|--------------------------------------|
| Debtor Days (DSO)        | Trade Receivables ÷ (Revenue/365)   |
| Creditor Days (DPO)      | Trade Payables ÷ (COGS/365)         |
| Inventory Days           | Inventory ÷ (COGS/365)              |
| Cash Conversion Cycle    | DSO + Inventory Days − DPO          |

---

## M&A PROCESS OVERVIEW

### Buy-Side Process
1. Strategic rationale — why this acquisition?
2. Target identification and initial outreach
3. Letter of Intent (LOI) / Term Sheet — non-binding, key terms
4. Due diligence (financial, legal, tax, commercial, technical)
5. SPA (Share Purchase Agreement) negotiation
6. Completion / Closing
7. Post-merger integration (PMI)

### Key Due Diligence Areas
- **Financial DD**: quality of earnings, normalised EBITDA, working capital, debt, capex
- **Tax DD**: historic tax positions, transfer pricing, employee taxes, R&D credits
- **Legal DD**: contracts, IP ownership, litigation, employment agreements
- **Commercial DD**: market position, customer concentration, competitive landscape

### Working Capital Normalisation
- Typically agree "normalised" working capital = average of last 12 months
- Price adjusted up or down vs normalised working capital at completion
- Key items: debtors, creditors, inventory, accruals, deferred income

### Earn-Out Provisions
- Portion of purchase price deferred, contingent on future performance
- Aligns buyer/seller interests
- Common trigger: EBITDA target in years 1–3 post-acquisition
- Tax treatment: earn-out instalments may be capital or income depending on structure (HMRC guidance)

### Tax Structuring of Acquisitions
- **Share purchase**: buyer acquires company with all historic liabilities (tax, legal, operational)
- **Asset purchase**: buyer cherry-picks assets, avoids inherit historic liabilities
- **UK SDLT**: asset purchase triggers SDLT on property; share purchase does not (but 0.5% stamp on shares)
- **Capital allowances**: asset purchase allows fresh start on allowances; share purchase inherits existing pool
`;
