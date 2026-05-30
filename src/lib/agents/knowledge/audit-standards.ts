export const AUDIT_STANDARDS_KNOWLEDGE = `
# AUDIT METHODOLOGY & ISA STANDARDS — KNOWLEDGE BASE
# International Standards on Auditing (ISA) | Updated: June 2025
# Applicable: UK (ISAs UK), Pakistan (ISAs ICAP), Global (IAASB ISAs)

## OVERVIEW OF STATUTORY AUDIT

### What is an Audit?
An independent examination of financial statements to express an opinion on whether they give a "true and fair view" in accordance with the applicable financial reporting framework (IFRS, GAAP).

### Regulatory Framework
- **Global**: ISAs issued by IAASB (International Auditing and Assurance Standards Board)
- **UK**: ISAs (UK) issued by FRC (Financial Reporting Council) — UK-specific additions
- **Pakistan**: ISAs adopted by ICAP (Institute of Chartered Accountants of Pakistan)
- **USA**: PCAOB (Public Company Accounting Oversight Board) standards for listed companies; AICPA SAS for private

### Who Requires a Statutory Audit?
| Jurisdiction | Threshold                                                   |
|--------------|-------------------------------------------------------------|
| UK           | Turnover > £10.2m, assets > £5.1m, employees > 50 (any 2) |
| Pakistan     | All public companies; listed companies mandatory             |
| Saudi Arabia | All companies with external shareholders                     |
| UAE          | All companies (Free Zone + mainland)                        |
| USA          | Public companies (SEC filers); private — lender/investor requirement |

---

## THE AUDIT PROCESS — OVERVIEW

### Phase 1: Planning (ISA 300)

**Understanding the Entity (ISA 315)**
- Business model, industry, regulatory environment
- Internal controls: control environment, risk assessment, control activities, monitoring
- Key financial reporting risks (where material misstatement is most likely)

**Materiality (ISA 320)**
- **Overall materiality**: benchmark × percentage
  - Revenue-based: typically 0.5%–1% of revenue
  - Profit-based: typically 5%–10% of PBT
  - Asset-based: typically 1%–2% of total assets
- **Performance materiality**: 50%–75% of overall materiality (used for testing)
- **Trivial/threshold**: items below this not reported to management (usually 5% of overall)

**Risk Assessment**
- Inherent risk: susceptibility to material misstatement before controls
- Control risk: risk that controls won't prevent/detect misstatement
- Detection risk: risk that audit procedures won't detect misstatement
- **Audit risk = Inherent risk × Control risk × Detection risk**

**High-Risk Areas (Significant Risks — ISA 315)**
- Revenue recognition (especially cut-off, management bias)
- Management override of controls
- Related party transactions
- Estimates and judgements (impairment, provisions, fair values)
- Fraud risk areas

### Phase 2: Testing

**Tests of Controls (ISA 330)**
- Test whether controls are operating effectively
- If controls effective → reduce substantive testing
- Types: inspection, observation, re-performance, inquiry

**Substantive Procedures**
1. **Analytical Procedures (ISA 520)**: compare actual to expected, identify anomalies
2. **Tests of Details**: direct testing of transactions and balances

**Audit Assertions (for balances):**
| Assertion         | Meaning                                              |
|-------------------|------------------------------------------------------|
| Existence         | Assets/liabilities actually exist at period end      |
| Completeness      | All transactions/balances that should be recorded are |
| Valuation/accuracy| Correctly valued, measured, described                |
| Rights & obligations| Entity has rights to assets, obligations for liabilities |
| Cut-off           | Transactions recorded in correct period              |
| Classification    | Properly classified and described                    |
| Presentation      | Properly aggregated/disaggregated in statements      |

### Phase 3: Completion & Reporting

**ISA 560 — Subsequent Events**
- Active search for post-balance-sheet events up to audit report date
- Adjusting events: conditions existing at year end → adjust financial statements
- Non-adjusting events: material → disclose in notes

**Going Concern (ISA 570)**
- Assess whether entity will continue for 12 months from approval date
- Look for: negative cash flows, overdue liabilities, loan covenant breaches, key customer loss
- If doubt exists: disclose; if not going concern: basis of preparation changes fundamentally

**Written Representations (ISA 580)**
- Management letter confirming completeness of information provided
- Not a substitute for audit evidence — corroborates management integrity

---

## AUDIT SAMPLING (ISA 530)

### Why Sample?
Testing 100% of transactions is impractical. Statistical sampling allows conclusions about entire population.

### Sampling Risk
- Risk that sample conclusion differs from conclusion if entire population tested
- **Risk of incorrect rejection** (over-auditing): inefficiency issue
- **Risk of incorrect acceptance** (under-auditing): quality issue

### Sampling Methods

**Statistical Sampling:**
- Random sampling: every item has equal selection probability
- Systematic sampling: every nth item from a list
- Probability-proportional-to-size (PPS/MUS): larger items more likely to be selected

**Non-Statistical (Judgmental) Sampling:**
- Haphazard selection (not random — avoidance bias risk)
- Block selection (periods or locations)

### Monetary Unit Sampling (MUS / PPS)
- Most common for financial audit
- Select based on monetary value: £1,000,000 population, 100 items selected = £10,000 interval
- High-value items more likely to be selected
- Each monetary unit has equal chance of selection

**Sample Size Factors:**
- Higher tolerable misstatement → smaller sample
- Higher population size → larger sample (but log relationship)
- Expected misstatement → if expected errors are high, need more items
- Confidence level → higher confidence = larger sample

### Audit Exceptions
- When testing and finding errors: project error to population
- **Projected misstatement** = (sample error / sample value) × population value
- If projected + known misstatements > tolerable: audit scope insufficient → extend testing or qualify opinion

---

## ISA 240 — FRAUD IN AN AUDIT

### Auditor's Responsibility
- Not to detect all fraud — but to plan procedures to detect **material** misstatement from fraud
- Fraud types: fraudulent financial reporting (management), misappropriation of assets (staff)

### Fraud Risk Factors (Red Flags)
**Incentive/Pressure:**
- Financial performance pressures, debt covenants, management compensation tied to results

**Opportunity:**
- Weak controls, single person dominates accounting, poor segregation of duties

**Rationalisation:**
- Management culture tolerates minor rule-bending, poor ethical tone at top

### Mandatory Procedures When Fraud Risk High
- Unpredictable sampling (don't announce which areas being tested)
- Test journal entries (especially unusual, top-side, round number entries)
- Evaluate estimates for management bias
- Test for revenue cut-off manipulations

---

## AUDIT OPINION TYPES (ISA 700/705/706)

### Unmodified Opinion ("Clean")
- Financial statements give true and fair view
- No material misstatements, no scope limitations
- Standard wording used

### Modified Opinions
| Type                     | Condition                                               |
|--------------------------|--------------------------------------------------------|
| Qualified (Except for)   | Material but not pervasive misstatement or limitation   |
| Adverse                  | Material AND pervasive misstatement (FS misleading)     |
| Disclaimer               | Unable to obtain sufficient evidence — scope limitation (pervasive) |

### Emphasis of Matter (EOM)
- Opinion not modified but something draws reader's attention
- Example: going concern uncertainty, significant subsequent event, regulatory investigation

### Key Audit Matters (KAMs) — ISA 701
- For public interest entities: communicate areas of most significance in the audit
- Why it was a KAM, how it was addressed in the audit
- Not a qualification — just transparency

---

## INTERNAL CONTROLS — COSO FRAMEWORK

### Five Components of Internal Control
1. **Control Environment**: tone at top, ethics, organisational structure
2. **Risk Assessment**: identification and analysis of relevant risks
3. **Control Activities**: policies and procedures (authorisation, segregation of duties, reconciliations)
4. **Information & Communication**: relevant, quality information flows
5. **Monitoring**: ongoing assessments, separate evaluations, corrective actions

### Segregation of Duties (SoD)
- Key principle: no single person should control all aspects of a transaction
- Separate: custody of assets, recording, authorisation, reconciliation
- Common SoD failures: petty cash controlled by one person, same person raises and approves POs

### IT General Controls (ITGCs)
- Access controls: who can log in, admin rights, segregation in systems
- Change management: testing and approval process for system changes
- Operations: backup, recovery, batch processing
- Weakness in ITGCs often increases substantive testing significantly

---

## AUDIT QUALITY INDICATORS

### Engagement Quality Control Review (EQCR)
- Required for audits of public interest entities
- Second partner reviews key judgements, significant risks, opinions before issuing report

### ISQM 1 & 2 (Quality Management Standards — from Dec 2022)
- Proactive quality management approach (replaces ISQC 1)
- Firms must identify quality objectives, risks, and responses
- Annual evaluation of system of quality management

---

## COMPILATION & REVIEW ENGAGEMENTS

### Compilation (ISRS 4410)
- No assurance provided — accountant compiles financial information
- No procedures to verify accuracy
- Report states: "We have compiled these financial statements"
- Common for small businesses not requiring audit

### Review Engagement (ISRE 2400)
- Limited assurance: "nothing has come to our attention"
- Primarily analytical procedures + inquiry (no detailed testing)
- Report states: "Based on our review, nothing has come to our attention..."
- Cheaper than full audit; used for bank covenants, shareholder requirements

### Full Audit
- Reasonable assurance: "true and fair view"
- Extensive substantive testing and controls testing
- Required for statutory purposes
`;
