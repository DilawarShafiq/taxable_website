export const IFRS_ACCOUNTING_KNOWLEDGE = `
# IFRS / IAS ACCOUNTING STANDARDS — KNOWLEDGE BASE
# International Financial Reporting Standards | Updated: June 2025
# Used globally: Pakistan (ICAP/SECP), UK (ICAEW/FRC), UAE, Saudi Arabia

## OVERVIEW OF IFRS

### What is IFRS?
International Financial Reporting Standards (IFRS) issued by the International Accounting Standards Board (IASB). Required or permitted in 140+ countries. US uses US GAAP; UK listed companies must use IFRS; UK private companies may use UK GAAP (FRS 102).

### IFRS vs US GAAP — Key Differences
| Issue                       | IFRS                          | US GAAP                   |
|-----------------------------|-------------------------------|---------------------------|
| Inventory method            | FIFO or weighted average      | FIFO, LIFO, or WA         |
| Intangible assets (R&D)     | Development costs capitalizable| Expensed immediately      |
| Investment property         | Fair value or cost model       | Cost model only           |
| Revaluation of PP&E         | Permitted                     | Not permitted             |
| Revenue recognition         | IFRS 15 (5-step model)        | ASC 606 (very similar)    |
| Leases                      | IFRS 16 (all on balance sheet) | ASC 842 (similar)        |

---

## FINANCIAL STATEMENTS — STRUCTURE

### 1. Statement of Financial Position (Balance Sheet)

**ASSETS**
- Non-current assets: PP&E, intangibles, goodwill, investment property, long-term investments
- Current assets: inventories, trade receivables, cash and equivalents

**EQUITY**
- Share capital, share premium, retained earnings, other comprehensive income (OCI)

**LIABILITIES**
- Non-current: long-term debt, deferred tax, provisions
- Current: trade payables, accruals, short-term borrowings, current portion of long-term debt

### 2. Statement of Profit or Loss and OCI (Income Statement)

**P&L Section:**
- Revenue
- Cost of sales
- Gross profit
- Distribution/selling costs
- Administrative expenses
- Other income
- Operating profit (EBIT)
- Finance costs (interest expense)
- Profit before tax
- Income tax expense
- Profit for the period

**Other Comprehensive Income (OCI):**
- Items that may be reclassified to P&L: foreign exchange translation, cash flow hedges
- Items that will NOT be reclassified: revaluation surplus, actuarial gains/losses on pensions

### 3. Statement of Changes in Equity
- Opening balances
- Comprehensive income for the period
- Dividends paid
- Share issues/buybacks
- Closing balances

### 4. Statement of Cash Flows (IAS 7)

**Operating Activities:**
- Start with profit before tax
- Add back: depreciation, amortisation, impairment losses
- Adjust: working capital changes (receivables, payables, inventories)
- Subtract: tax paid
- Result: Net cash from operating activities

**Investing Activities:**
- Purchase/sale of PP&E and intangibles
- Acquisition/disposal of investments
- Receipts from investments (dividends, interest received)

**Financing Activities:**
- Proceeds from share issues
- Repayment of borrowings
- Payment of lease liabilities
- Dividends paid to shareholders

**Two methods:**
- **Direct method**: shows actual cash receipts and payments (preferred)
- **Indirect method**: starts with profit, adjusts for non-cash items (more commonly used)

---

## IFRS 15 — REVENUE RECOGNITION (5-STEP MODEL)

### The Five Steps

**Step 1: Identify the Contract**
- Written, oral, or implied agreement
- Has commercial substance
- Rights to goods/services and payment terms are identifiable
- Probable that consideration will be collected

**Step 2: Identify Performance Obligations**
- A promise to transfer a distinct good or service
- Distinct = customer can benefit from it on its own AND it is separable from other promises
- Examples: software license + implementation = two obligations (if sold separately)

**Step 3: Determine Transaction Price**
- Total consideration expected
- Includes: variable consideration (bonuses, refunds — estimate and constrain)
- Excludes: amounts collected on behalf of third parties (taxes)
- Significant financing component if payment > 12 months before/after delivery

**Step 4: Allocate Transaction Price**
- Allocate based on relative standalone selling prices
- Observable prices preferred; estimate if not available

**Step 5: Recognise Revenue as Performance Obligations Satisfied**
- **Point in time**: when control transfers (risk/rewards, physical possession, acceptance)
- **Over time**: if customer simultaneously receives and consumes, entity creates asset customer controls, or no alternative use and right to payment for work to date

### Common IFRS 15 Issues
| Scenario                         | Revenue Recognition                         |
|----------------------------------|---------------------------------------------|
| SaaS subscription                | Rateably over subscription period           |
| Software license (perpetual)     | At point of delivery                        |
| Construction contract            | Over time (% completion)                    |
| Retail sale with right of return | At point of sale, estimate refund liability |
| Customer loyalty points          | Allocate portion of price to loyalty points |
| Agent vs principal               | Principal = gross; Agent = net (commission) |

---

## IFRS 16 — LEASES

### What Changed from IAS 17?
- Under old IAS 17: operating leases kept off-balance sheet
- Under IFRS 16: nearly all leases are ON balance sheet (right-of-use asset + lease liability)
- Exceptions: short-term leases (< 12 months) and low-value assets (< ~$5,000)

### Lessee Accounting

**At Commencement:**
- Record **Right-of-Use (ROU) Asset** = PV of lease payments + initial direct costs + prepayments
- Record **Lease Liability** = PV of future lease payments (discounted at implicit rate or incremental borrowing rate)

**Ongoing:**
- ROU Asset: depreciated over shorter of useful life or lease term
- Lease Liability: unwound using effective interest method
- P&L: depreciation charge + interest expense (front-loaded interest cost)

**Example:**
5-year lease, £100,000/year, 5% discount rate:
- Lease liability at start = PV of 5 payments at 5% = £432,948
- Year 1 interest = £432,948 × 5% = £21,647
- Year 1 repayment = £100,000 − £21,647 = £78,353
- ROU asset = £432,948 (depreciated over 5 years = £86,590/year)

### Lessor Accounting
- Finance lease: lessor recognises receivable; recognises interest income over lease term
- Operating lease: lessor continues to recognise asset; recognises rental income on straight-line basis

### IFRS 16 Impact on Financial Ratios
- EBITDA increases (lease payment shifts from opex to depreciation + interest)
- Debt increases (lease liability now on balance sheet)
- Return on assets may decrease initially
- Important for covenant monitoring (may breach covenants if not renegotiated)

---

## IAS 16 — PROPERTY, PLANT & EQUIPMENT (PP&E)

### Measurement Models
**Cost Model:**
- Record at cost − accumulated depreciation − impairment losses
- Cost: purchase price + directly attributable costs + decommissioning provision (discounted)

**Revaluation Model:**
- Revalue to fair value at regular intervals
- Revaluation surplus: goes to OCI (not P&L), held in revaluation reserve
- If asset then impaired below original cost: impairment goes to P&L

### Depreciation
| Method           | Calculation                                       | Best for                   |
|------------------|---------------------------------------------------|----------------------------|
| Straight-line    | (Cost − Residual value) ÷ Useful life             | Buildings, office equipment |
| Reducing balance | Carrying amount × depreciation rate               | Vehicles, tech equipment   |
| Units of production | (Cost − RV) × units produced ÷ total expected | Mining equipment, machinery |

### Useful Life Guidance
- Buildings: 20–50 years (land is NOT depreciated)
- Plant and machinery: 5–15 years
- Motor vehicles: 3–7 years
- Computer equipment: 3–5 years
- Fixtures and fittings: 5–10 years

### Component Accounting
- Significant parts of an asset must be depreciated separately
- Example: Aircraft — airframe (25y), engines (15y), interior (10y) — all depreciated separately

---

## IAS 36 — IMPAIRMENT OF ASSETS

### When to Test for Impairment?
- Annually: for goodwill and indefinite-life intangibles
- When indicators exist: for other assets (internal or external indicators)

### Impairment Indicators
| External                              | Internal                                  |
|---------------------------------------|-------------------------------------------|
| Significant decline in market value   | Evidence of obsolescence/physical damage  |
| Adverse changes in technology/market  | Asset idle or being restructured          |
| Increase in market interest rates     | Worse economic performance than expected  |
| Carrying amount > market capitalisation | Plans to discontinue/restructure        |

### Recoverable Amount Calculation
Recoverable Amount = Higher of:
1. **Fair Value Less Costs of Disposal (FVLCD)**: market price − selling costs
2. **Value in Use (VIU)**: PV of expected future cash flows from continued use

### Impairment Loss
- Carrying amount > Recoverable amount → impairment loss
- Impairment loss charged to P&L
- For revalued assets: first reduce revaluation reserve, then P&L

### Cash-Generating Units (CGUs)
- If individual asset impairment cannot be measured: group into CGU
- Goodwill allocated to CGUs on reasonable basis
- Test CGU as a whole against recoverable amount

### Impairment Reversal
- Permitted (except goodwill — goodwill impairment NEVER reversed)
- Reversal limited to what carrying amount would have been without impairment

---

## IAS 38 — INTANGIBLE ASSETS

### Recognition Criteria
- Identifiable (separable or arises from contractual rights)
- Probable future economic benefits
- Cost reliably measurable

### Research vs Development Phase
| Phase       | Treatment       | Examples                                      |
|-------------|-----------------|-----------------------------------------------|
| Research    | Expense always  | Laboratory investigations, search for alternatives |
| Development | Capitalise if 6 criteria met | Prototype design, testing         |

**6 Criteria for Development Capitalisation (PIRATE acronym):**
- **P**robability of completion
- **I**ntention to complete and use/sell
- **R**esources adequate to complete
- **A**bility to use or sell
- **T**echnical feasibility of completion
- **E**conomic benefits probable

### Goodwill
- Internally generated goodwill: NEVER recognised
- Purchased goodwill (from business combination per IFRS 3): recognised on balance sheet
- Goodwill tested annually for impairment (IAS 36)
- NOT amortised (under IFRS — under US GAAP and UK GAAP FRS 102 it is amortised)

### Examples of Intangible Assets
| Asset                | Recognition under IFRS        |
|----------------------|-------------------------------|
| Brand (internally generated) | No                   |
| Customer list (acquired) | Yes                       |
| Patents (purchased)  | Yes — amortise over useful life |
| Licences             | Yes                           |
| Software (purchased) | Yes                           |
| Software (developed internally) | Development phase only |
| Website              | Development costs if IAS 38 met |

---

## IAS 2 — INVENTORIES

### Measurement
- Lower of cost or net realisable value (NRV)
- NRV = estimated selling price − costs to complete and sell

### Cost Formulas
- **FIFO (First In First Out)**: oldest items assumed sold first
- **Weighted Average Cost (WAC)**: average of all units
- Note: LIFO is NOT permitted under IFRS (only under US GAAP)

### What's Included in Cost?
- Purchase price + import duties + transport − trade discounts
- Conversion costs: direct labour + production overhead (allocated based on normal capacity)
- NOT included: abnormal waste, storage, administrative overheads

---

## BUSINESS COMBINATIONS — IFRS 3

### Acquisition Method
All business combinations are accounted for using the **acquisition method**:

1. **Identify acquirer** (usually the entity paying consideration)
2. **Determine acquisition date** (when control is obtained)
3. **Recognise identifiable assets and liabilities** at **fair value** at acquisition date
4. **Recognise goodwill** = Purchase consideration − Fair value of net identifiable assets

### Goodwill Calculation
| Item                                   | Amount      |
|----------------------------------------|-------------|
| Purchase consideration paid            | £5,000,000  |
| Fair value of identifiable net assets  | (£3,500,000)|
| Goodwill recognised                    | £1,500,000  |

### Non-Controlling Interest (NCI)
- If parent acquires < 100%: NCI measured at:
  1. Fair value (full goodwill method), or
  2. Proportionate share of net identifiable assets (partial goodwill)

---

## DEFERRED TAX — IAS 12

### Why Deferred Tax Exists?
Timing differences between accounting profit and taxable profit create temporary differences:
- Accounting depreciation ≠ tax depreciation (capital allowances)
- Revenue recognised differently for accounting vs tax
- Provisions recognised in accounts but deductible only when paid

### Deferred Tax Liability (DTL)
- Created when: taxable income < accounting income (tax deferred to future)
- Example: Accelerated tax depreciation > accounting depreciation → DTL

### Deferred Tax Asset (DTA)
- Created when: taxable income > accounting income (tax paid in advance)
- Example: Provision for bad debts recognised in accounts but deductible only when written off → DTA
- Also: unused tax losses that can be carried forward (if recovery probable)

### Balance Sheet Approach
- DT calculated on all temporary differences between carrying amount and tax base
- Rate: enacted tax rate expected when temporary difference reverses
`;
