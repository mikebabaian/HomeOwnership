# Feature: Dashboard Enhancements (Best Rates + Budget Pie + “In the Red” Alert)

## Goal
Upgrade the authenticated **Dashboard** page to show:
1) “Best Rate” cards for **Mortgage Rate** and **Homeowner’s Insurance** based on the values in `UserProfile`, labeled **“Best Rate as of <UpdatedUtc date>”** (UTC date only, no time), with a **green check** visual.
2) A **pie chart** that compares **Monthly Take Home** (income) vs **Total Monthly Expenses** and shows **Remaining** (income - expenses).
   - If expenses exceed income, show a **red warning indicator** that the user is “in the red” for the month.

Pages should remain clean and visually pleasing (cards/panels, clear typography, friendly icons).

---

## Data Sources
Use existing tables:
- `UserProfiles` (fields used: `CurrentMortgageRate`, `HomeOwnersInsuranceMonthly`, `MonthlyTakeHome`, `UpdatedUtc`)
- `BudgetItems` (sum all items for monthly expenses; optional: grouped totals by category)

---

## Backend Requirements

### Add a dashboard endpoint
Create:
- `GET /api/dashboard/summary` (Authorized)

Return a single payload the Dashboard can use without multiple calls.

#### Response Contract: DashboardSummaryResponse
```json
{
  "profileUpdatedUtc": "2026-03-02T21:08:29Z",
  "currentMortgageRate": 6.75,
  "homeOwnersInsuranceMonthly": 210.50,
  "monthlyTakeHome": 5200.00,
  "totalMonthlyExpenses": 3450.00,
  "remainingThisMonth": 1750.00,
  "isInTheRed": false,
  "expenseByCategory": [
    { "category": "Housing", "total": 2200.00 },
    { "category": "Utilities", "total": 350.00 },
    { "category": "Insurance", "total": 260.50 }
  ]
}