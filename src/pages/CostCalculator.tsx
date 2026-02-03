import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalculator, faHome, faShieldAlt, faPercent } from '@fortawesome/free-solid-svg-icons'

export default function CostCalculator(){
  return (
    <div>
      <section className="content-block">
        <h2><span className="icon-badge"><FontAwesomeIcon icon={faCalculator} /></span> Cost Calculator</h2>
        <p className="muted">Estimate down payment, closing costs, and monthly ownership expenses including mortgage, PMI, taxes, and insurance.</p>
        <p className="muted">Use this tool to understand monthly totals and upfront cash needed.</p>

        <h3>Inputs (v1)</h3>
        <ul>
          <li><span className="icon-badge"><FontAwesomeIcon icon={faHome} /></span> Home price</li>
          <li><span className="icon-badge"><FontAwesomeIcon icon={faPercent} /></span> Down payment (amount or %)</li>
          <li>Loan term (30yr default, optional 15yr)</li>
          <li>Interest rate (APR)</li>
          <li>Property taxes (annual or monthly)</li>
          <li><span className="icon-badge"><FontAwesomeIcon icon={faShieldAlt} /></span> Homeowners insurance (annual or monthly)</li>
          <li>PMI (auto-estimate or manual)</li>
          <li>HOA dues (optional)</li>
          <li>Utilities (optional)</li>
        </ul>

        <h3>Outputs (v1)</h3>
        <ul>
          <li>Principal &amp; Interest</li>
          <li>PMI (if applicable)</li>
          <li>Property taxes</li>
          <li>Homeowners insurance</li>
          <li>HOA &amp; utilities (if entered)</li>
          <li><strong>Total Monthly Cost</strong></li>
        </ul>

        <p className="muted">(Interactive form and live results will be added in the next iteration.)</p>
      </section>
    </div>
  )
}
