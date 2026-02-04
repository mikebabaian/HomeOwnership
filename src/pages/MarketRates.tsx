import React from 'react'

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

export default function MarketRates(){
  const formatRate = (rate: number | null) => rate !== null ? `${rate.toFixed(2)}%` : "—";

  return (
    <div>
      <section className="content-block">
        <h2>Best Market Mortgage Rates</h2>
        <p className="muted">Compare current mortgage interest rates from major lenders and national averages. These rates are examples and will vary based on your borrower profile, credit score, loan amount, location, and market conditions. This page is informational only.</p>

        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Lender</th>
                <th>15-Year Fixed Rate</th>
                <th>30-Year Fixed Rate</th>
                <th>APR</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {mortgageRates.map((rate, index) => (
                <tr key={index}>
                  <td>{rate.lender}</td>
                  <td>{formatRate(rate.rate15)}</td>
                  <td>{formatRate(rate.rate30)}</td>
                  <td>{rate.apr}</td>
                  <td>{rate.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
