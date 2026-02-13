import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faClock, faWrench, faCalendar, faKey, faBookOpen, faEye, faSmile } from '@fortawesome/free-solid-svg-icons'
import ShieldIcon from '../components/icons/ShieldIcon'
import ChatHero from '../images/OwnWellLogo.png'

export default function Home() {
  return (
    <div>
      <section className="hero">
        <div className="meta">
          <h1>Own Well Services</h1>
  <p class="hero-tagline">
    A guided companion for buying, owning, and improving a home.
  </p>

  <p class="hero-description">
    Understand the true costs, compare your options, and make confident decisions at every stage of homeownership, from first offer to long-term upkeep.
  </p>
          <div>
            <Link className="btn btn-primary" to="/cost-calculator">Estimate Home Payment</Link>
            <a className="btn btn-ghost" href="#how-it-works" style={{marginLeft:8}}>How it works</a>
          </div>
        </div>
        <div className="hero-illustration" aria-hidden>
          <img src={ChatHero} alt="hero" className="hero-chat-image" />
        </div>
      </section>


      <section className="content-block combined-section">
        <div className="combined-content">
          {/* What You Get */}
          <div className="what-you-get">
            <h2 className="combined-title">What You Get</h2>
            <p className="muted">Practical tools and clear explanations to plan, buy, and steward your home.</p>
            <div className="grid">
              <div className="card">
                <div className="feature">
                  <span className="icon-badge"><FontAwesomeIcon icon={faHome} /></span>
                  <div className="text-stack">
                    <h4>Save for a Home</h4>
                    <p className="muted">Set goals and track what you'll need for down payment and closing.</p>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="feature">
                  <span className="icon-badge"><FontAwesomeIcon icon={faClock} /></span>
                  <div className="text-stack">
                    <h4>Understand Total Cost</h4>
                    <p className="muted">See your true monthly cost, not just the mortgage payment.</p>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="feature">
                  <span className="icon-badge"><FontAwesomeIcon icon={faWrench} /></span>
                  <div className="text-stack">
                    <h4>Maintain Your Home</h4>
                    <p className="muted">Stay ahead of upkeep with simple checklists and reminders.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr className="combined-divider" />
          {/* How It Works */}
          <div className="how-it-works timeline-section">
            <h2 className="combined-title" id="how-it-works">How It Works</h2>
            <p className="muted">Simple steps to guide you through each stage of homeownership.</p>
            <div className="timeline-redesign">
              <div className="timeline-step-redesign">
                <div className="timeline-circle">
                  <FontAwesomeIcon icon={faCalendar} />
                  <div className="timeline-title">Plan</div>
                </div>
                <div className="timeline-support">Estimate costs, build a savings plan, and learn the basics.</div>
              </div>
              <div className="timeline-arrow-redesign">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="var(--hos-green)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="16" y1="32" x2="48" y2="32" />
                  <polyline points="40 24 48 32 40 40" />
                </svg>
              </div>
              <div className="timeline-step-redesign">
                <div className="timeline-circle">
                  <FontAwesomeIcon icon={faKey} />
                  <div className="timeline-title">Purchase</div>
                </div>
                <div className="timeline-support">Find support, compare options, and avoid surprises.</div>
              </div>
              <div className="timeline-arrow-redesign">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="var(--hos-green)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="16" y1="32" x2="48" y2="32" />
                  <polyline points="40 24 48 32 40 40" />
                </svg>
              </div>
              <div className="timeline-step-redesign">
                <div className="timeline-circle">
                  <span style={{width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <ShieldIcon className="timeline-shield-icon" />
                  </span>
                  <div className="timeline-title">Steward</div>
                </div>
                <div className="timeline-support">Follow maintenance routines and improve wisely.</div>
              </div>
            </div>
          </div>
          <hr className="combined-divider" />
          {/* Our Commitments */}
          <div className="our-commitments">
            <h2 className="combined-title">Our Commitments</h2>
            <div className="grid">
              <div className="card">
                <div className="feature">
                  <span className="icon-badge"><FontAwesomeIcon icon={faBookOpen} /></span>
                  <div className="text-stack">
                    <h4>Education first</h4>
                    <p className="muted">We explain the why behind every decision, not just the numbers.</p>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="feature">
                  <span className="icon-badge"><FontAwesomeIcon icon={faEye} /></span>
                  <div className="text-stack">
                    <h4>Transparent by default</h4>
                    <p className="muted">No hidden assumptions, no unclear calculations, no surprises.</p>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="feature">
                  <span className="icon-badge"><FontAwesomeIcon icon={faSmile} /></span>
                  <div className="text-stack">
                    <h4>No pressure, ever</h4>
                    <p className="muted">We provide guidance, not sales tactics or urgency.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-block footer-cta">
        <p>Start with your monthly cost estimate.</p>
        <Link className="btn btn-primary" to="/cost-calculator">Open Calculator</Link>
      </section>
    </div>
  )
}
