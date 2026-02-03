import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faHome, faWrench } from '@fortawesome/free-solid-svg-icons'

export default function Overview() {
  return (
    <div>
      <section className="hero">
        <div className="meta">
          <div className="kicker">Services</div>
          <h2>Support for the full home ownership journey</h2>
          <p className="muted">From saving and planning to maintenance and improvements, Home Owner Steward keeps everything understandable and organized.</p>
          <div>
            <a className="btn btn-primary" href="#">Choose your stage</a>
          </div>
        </div>
      </section>

      <div style={{height:18}} />

      <section className="content-block">
        <h3>Choose your stage</h3>
        <p className="muted">Preparing to Buy · Buying · After Purchase</p>
        <div className="grid">
          <div className="card">
            <div className="row"><span className="icon-badge"><FontAwesomeIcon icon={faClock} /></span><h3>Preparing to Buy</h3></div>
            <p className="muted">Plan savings, timeline goals, cost breakdowns, and readiness checklists.</p>
            <ul>
              <li>Home price &amp; down payment planning</li>
              <li>Estimate monthly total cost</li>
              <li>Education: terminology &amp; next steps</li>
            </ul>
            <div><a className="btn" href="/cost-calculator">Estimate cost</a></div>
          </div>
          <div className="card">
            <div className="row"><span className="icon-badge"><FontAwesomeIcon icon={faHome} /></span><h3>Buying</h3></div>
            <p className="muted">Inspection checklists, negotiation guidance, and selecting the right options.</p>
            <ul>
              <li>Agent &amp; listing selection support</li>
              <li>Inspection checklist &amp; negotiation guidance</li>
              <li>Estimated ROI on common improvements</li>
            </ul>
          </div>
          <div className="card">
            <div className="row"><span className="icon-badge"><FontAwesomeIcon icon={faWrench} /></span><h3>After Purchase</h3></div>
            <p className="muted">Maintenance schedules, contractor matching, and long-term stewardship planning.</p>
            <ul>
              <li>Seasonal maintenance checklist</li>
              <li>Contractor search &amp; matching</li>
              <li>Maintenance budgeting and reminders</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="content-block">
        <h3>Capabilities</h3>
        <div className="grid">
          <div className="card">
            <h4>Financial Planning</h4>
            <p className="muted">Plan savings and understand up-front and ongoing costs.</p>
          </div>
          <div className="card">
            <h4>Cost Education</h4>
            <p className="muted">Plain-language breakdowns of PMI, taxes, insurance, and more.</p>
          </div>
          <div className="card">
            <h4>Maintenance Guidance</h4>
            <p className="muted">Checklists and routines that prevent expensive repairs.</p>
          </div>
        </div>

        <h3 style={{marginTop:18}}>What this is not</h3>
        <p className="muted">We clarify scope to build trust.</p>
        <ul>
          <li>Not a mortgage lender</li>
          <li>Not legal or financial advice</li>
          <li>Not a contractor warranty or guaranteed recommendation</li>
        </ul>
      </section>
    </div>
  )
}
