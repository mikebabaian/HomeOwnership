import React, { useState } from 'react'
import { Routes, Route, NavLink, Link } from 'react-router-dom'
import LogoImg from './images/icon-rounded-512.png'
import Home from './pages/Home'
import Overview from './pages/Overview'
import CostCalculator from './pages/CostCalculator'
import Guide from './pages/Guide'
import Community from './pages/Community'
import MarketRates from './pages/MarketRates'
import Register from './pages/Register'
import SignIn from './pages/SignIn'

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div>
      {/* Brand Bar - full width */}
      <div className="brand-bar">
        <div className="container brand-container">
          <Link to="/" className="brand-block" aria-label="Home">
            <div className="brand-badge">
              <img src={LogoImg} alt="Own Well Services" />
            </div>
            <div className="brand-lockup">
              <div className="brand-sub">Own Well</div>
              <div className="brand-main">Services</div>
            </div>
          </Link>
          <div className="brand-tagline">Clear guidance for confident home decisions.</div>
        </div>
      </div>

      {/* Nav Bar - full width, sticky */}
      <div className="nav-bar">
        <div className="container nav-container">
          <button className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav className={`nav-left ${mobileMenuOpen ? 'open' : ''}`}>
            <NavLink className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} to="/" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
            <NavLink className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} to="/services" onClick={() => setMobileMenuOpen(false)}>Services</NavLink>
            <NavLink className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} to="/cost-calculator" onClick={() => setMobileMenuOpen(false)}>Cost Calculator</NavLink>
            <NavLink className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} to="/best-market-mortgage-rates" onClick={() => setMobileMenuOpen(false)}>Best Market Rates</NavLink>
          </nav>
          <div className="nav-actions">
            <Link className="btn btn-primary" to="/register">Register</Link>
            <Link className="btn btn-secondary" to="/sign-in" style={{marginLeft: '0.5rem'}}>Sign In</Link>
          </div>
        </div>
      </div>

      

      {/* Main container */}
      <div className="container app-root">
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Overview />} />
            <Route path="/cost-calculator" element={<CostCalculator />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/community" element={<Community />} />
            <Route path="/best-market-mortgage-rates" element={<MarketRates />} />
            <Route path="/register" element={<Register />} />
            <Route path="/sign-in" element={<SignIn />} />
          </Routes>
        </main>
      </div>

      {/* Footer - full width */}
      <footer className="site-footer-full">
        <div className="footer-top-band">
          <div className="container footer-top">
            <div className="footer-brand">
              <div className="footer-badge"><img src={LogoImg} alt="Own Well Services" /></div>
              <div className="footer-mission">Helping people plan, buy, and maintain homes with clarity.</div>
            </div>
          </div>
        </div>

        <div className="footer-links container">
          <div className="copyright">© {new Date().getFullYear()} Own Well Services</div>
          <nav>
            <Link to="/about">About</Link>
            <Link to="/resources">Resources</Link>
            <Link to="/disclaimer">Disclaimer</Link>
            <Link to="/roadmap">Roadmap</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
