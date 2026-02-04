# Best Market Mortgage Rates

## Page Description
Create a new page in the application that displays a comparison of **current mortgage interest rates** from major lenders and national averages.  

The purpose of this page is to help users understand what competitive mortgage rates look like in the broader market before estimating monthly payments or requesting personalized quotes.

This page is informational only. Rates shown are examples and will vary based on borrower profile, credit score, loan amount, location, and market conditions.

---

## Route
- `/best-market-mortgage-rates`

---

## Technology
- React
- JavaScript
- Bootstrap for layout and styling
- Client-side only (no API calls)

---

## UI Requirements
- Page title: **Best Market Mortgage Rates**
- Short explanatory paragraph under the title
- Responsive comparison table using Bootstrap
- Rates displayed for **15-year fixed** and **30-year fixed** mortgages
- Currency and percentage values formatted cleanly
- Mobile-friendly and accessible

---

## Mortgage Rate Dataset

This dataset must be embedded directly in the page or component and used as the source of truth for rendering the table.

```js
const mortgageRates = [
  {
    lender: "Bankrate National Average",
    rate15: 5.63,
    rate30: 6.19,
    apr: "Average",
    lastUpdated: "Today"
  },
  {
    lender: "Freddie Mac PMMS (Weekly Average)",
    rate15: 5.49,
    rate30: 6.10,
    apr: "Average",
    lastUpdated: "This Week"
  },
  {
    lender: "Wells Fargo",
    rate15: 5.38,
    rate30: 6.13,
    apr: "Varies",
    lastUpdated: "Today"
  },
  {
    lender: "Bank of America",
    rate15: 5.63,
    rate30: 6.25,
    apr: "Varies",
    lastUpdated: "Today"
  },
  {
    lender: "U.S. Bank",
    rate15: null,
    rate30: 5.99,
    apr: "Varies",
    lastUpdated: "Today"
  },
  {
    lender: "Zillow / NerdWallet Aggregated Average",
    rate15: 5.49,
    rate30: 5.98,
    apr: "Average",
    lastUpdated: "Today"
  },
  {
    lender: "Mortgage News Daily Index",
    rate15: 5.76,
    rate30: 6.20,
    apr: "Average",
    lastUpdated: "Today"
  },
  {
    lender: "Rocket Mortgage (Personalized Quotes)",
    rate15: null,
    rate30: null,
    apr: "Personalized",
    lastUpdated: "Today"
  },
  {
    lender: "Local Credit Union (Example)",
    rate15: null,
    rate30: null,
    apr: "TBD",
    lastUpdated: "—"
  },
  {
    lender: "Online Mortgage Lender (Example)",
    rate15: null,
    rate30: null,
    apr: "TBD",
    lastUpdated: "—"
  }
];
