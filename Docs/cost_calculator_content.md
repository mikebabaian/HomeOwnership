# Update Spec: /cost-calculator (Mortgage Monthly Payment Calculator)

## Goal
Replace or implement the `/cost-calculator` page as an interactive mortgage monthly payment calculator built with **React + JavaScript** (no backend required).  Changes should update results **in real time** as the user edits inputs.

## Page Location / Routing
- Route: `/cost-calculator`
- If using React Router (or similar), ensure this path renders the new calculator component.
- If the page already exists, update it in-place; do not create a second calculator page.

## UX Requirements
- Show a clean calculator form with inputs and an always-visible results summary.
- Results update as the user types (no “Calculate” button required).
- All currency values are formatted (USD) and show two decimals where appropriate.
- Validate inputs gently:
  - Prevent negative numbers.
  - If an input is blank, treat it as 0 (or restore default on blur).
  - Interest rate and PMI rate should be in percentage terms (e.g., `6.75` means 6.75%).
- Mobile friendly layout: stacked sections on small screens, side-by-side on larger screens.

## Inputs (with defaults)
Use reasonable present-day defaults (not hardcoded as “current” claims, just sensible starting values):

### Home & Loan
- **Home Price** (default: 400000)
- **Down Payment**
  - Allow entry as **$** and/or **%** (choose one UI approach):
    - Preferred: a toggle between `$` and `%`
    - Default down payment: 20% (i.e., 80000 if home price is 400000)
- **Loan Term (years)** (default: 30; allow 15/20/30)
- **Interest Rate (APR %)** (default: 6.75)

### Monthly Escrows / Extras
- **Property Tax (annual $)** (default: 4800)  
  - Also acceptable: a % of home price, but keep it simple unless already used elsewhere.
- **Homeowners Insurance (annual $)** (default: 1500)
- **HOA / Condo Fees (monthly $)** (default: 0)

### PMI
Provide PMI only when down payment is under 20% (or when LTV > 80%):
- **PMI Rate (annual % of loan)** (default: 0.6)
- Display PMI as $/month in results.
- If down payment >= 20%, PMI should be forced to 0 and the PMI rate input can be disabled or visually indicated as not applicable.

### Optional Nice-to-Haves (implement if easy)
- **Extra Principal Payment (monthly $)** (default: 0)
  - If included, show a note that it reduces payoff time (you may omit payoff calculations unless already available).
- **Start Date** (optional, default: current month) is not required.

## Calculations

### Derived Values
- `downPaymentAmount`
- `loanAmount = homePrice - downPaymentAmount`
- `monthlyInterestRate = (interestRatePercent / 100) / 12`
- `numPayments = termYears * 12`

### Principal & Interest (P&I)
Use standard amortization formula:
- If monthlyInterestRate > 0:
  - `pi = loanAmount * (r * (1 + r)^n) / ((1 + r)^n - 1)`
- Else:
  - `pi = loanAmount / n`

Where `r = monthlyInterestRate`, `n = numPayments`.

### PMI
If down payment < 20%:
- `pmiMonthly = (loanAmount * (pmiRatePercent / 100)) / 12`
Else:
- `pmiMonthly = 0`

### Escrows / Fees
- `propertyTaxMonthly = propertyTaxAnnual / 12`
- `homeownersInsMonthly = homeownersInsuranceAnnual / 12`
- `hoaMonthly = hoaMonthly` (already monthly)

### Total Monthly Payment
- `total = pi + pmiMonthly + propertyTaxMonthly + homeownersInsMonthly + hoaMonthly`

## Output / Display
Display a results card that includes at least:
- **Total Monthly Payment**
- Breakdown:
  - Principal & Interest
  - Property Taxes
  - Homeowners Insurance
  - PMI (if applicable)
  - HOA (if > 0)
- Show derived summary:
  - Loan Amount
  - Down Payment (both $ and % if possible)

## Technical Implementation Notes
- Use a single React component for the calculator (e.g., `CostCalculatorPage.jsx`).
- Use React state for inputs and compute outputs from state.
- Prefer `useMemo` for computed values to keep renders clean (not mandatory).
- Keep everything client-side; no API calls.
- Use `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })` for currency formatting.
- Avoid external heavy dependencies unless the project already has them.
- Ensure the component is accessible:
  - `<label>` for each input
  - sensible input types (`number`) with `step` (e.g., rate step 0.01)
  - keyboard friendly

## Acceptance Criteria
- Visiting `/cost-calculator` shows the calculator.
- Defaults load immediately and show a plausible monthly payment.
- Editing any input updates the results in real time.
- PMI turns off automatically when down payment reaches 20% or more.
- No console errors.
- Layout works on mobile and desktop.

## Suggested Component Structure (example)
- `CostCalculatorPage`
  - `CalculatorForm` (inputs)
  - `ResultsSummary` (total + breakdown)

(Structure is flexible; keep it simple and readable.)
