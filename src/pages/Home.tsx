import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faClock, faWrench, faCalendar, faKey, faBookOpen, faEye, faSmile } from '@fortawesome/free-solid-svg-icons'
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

      <section className="content-block">
        <h2>What You Get</h2>
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
      </section>

      <section id="how-it-works" className="content-block">
        <h2>How It Works</h2>
        <p className="muted">Simple steps to guide you through each stage of homeownership.</p>
        <div className="steps">
          <div className="step">
            <span className="icon-badge"><FontAwesomeIcon icon={faCalendar} /></span>
            <div className="text-stack">
              <h4>Plan</h4>
              <p className="muted">Estimate costs, build a savings plan, and learn the basics.</p>
            </div>
          </div>
          <div className="step">
            <span className="icon-badge"><FontAwesomeIcon icon={faKey} /></span>
            <div className="text-stack">
              <h4>Purchase</h4>
              <p className="muted">Find support, compare options, and avoid surprises.</p>
            </div>
          </div>
          <div className="step">
            <span className="icon-badge"><FontAwesomeIcon icon={faWrench} /></span>
            <div className="text-stack">
              <h4>Steward</h4>
              <p className="muted">Follow maintenance routines and improve wisely.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-block trust-band">
        <h3>Our Commitments</h3>
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
      </section>

      <section className="content-block footer-cta">
        <p>Start with your monthly cost estimate.</p>
        <Link className="btn btn-primary" to="/cost-calculator">Open Calculator</Link>
      </section>
    </div>
  )
}
