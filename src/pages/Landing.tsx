import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard, faSearch, faWrench } from '@fortawesome/free-solid-svg-icons'

export default function Landing(){
  return (
    <div>
      <section className="hero">
        <div className="meta">
          <div className="kicker">Welcome</div>
          <h2>Own Well Services</h2>
          <p className="muted">A guided, end-to-end companion for the journey into and through home ownership.</p>
          <div>
            <Link className="btn btn-primary" to="/services">Explore the Service</Link>
            <Link className="btn btn-ghost" to="/cost-calculator" style={{marginLeft:8}}>Try the Cost Calculator</Link>
          </div>
        </div>
      </section>

      <div style={{height:18}} />

      <section className="content-block">
        <h3>Who this is for</h3>
        <p className="muted">First-time buyers, renters planning to buy, new homeowners, and anyone looking to protect or grow home value.</p>
        <div className="grid">
          <div className="card">
            <div className="row"><span className="icon-badge"><FontAwesomeIcon icon={faCreditCard} /></span><h3>Plan</h3></div>
            <p className="muted">Personalized savings plans and timeline-based goal tracking.</p>
          </div>
          <div className="card">
            <div className="row"><span className="icon-badge"><FontAwesomeIcon icon={faSearch} /></span><h3>Buy</h3></div>
            <p className="muted">Agent matching, home selection guidance, and value-focused advice.</p>
          </div>
          <div className="card">
            <div className="row"><span className="icon-badge"><FontAwesomeIcon icon={faWrench} /></span><h3>Maintain</h3></div>
            <p className="muted">Maintenance schedules, contractor matching, and long-term stewardship.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
