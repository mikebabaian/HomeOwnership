import React from 'react'
import { Routes, Route, NavLink, Link } from 'react-router-dom'
import LogoImg from './images/icon-rounded-512.png'
import Home from './pages/Home'
import Overview from './pages/Overview'
import CostCalculator from './pages/CostCalculator'
import Guide from './pages/Guide'
import Community from './pages/Community'
import Mission from './pages/Mission'

export default function App() {
  return (
    <div>
      {/* Brand Bar - full width */}
      <div className="brand-bar">
        <div className="container brand-container">
          <Link to="/" className="brand-block" aria-label="Home">
            <div className="brand-badge">
              <img src={LogoImg} alt="Home Owner Steward" />
            </div>
            <div className="brand-lockup">
              <div className="brand-sub">Home Owner</div>
              <div className="brand-main">Steward</div>
            </div>
          </Link>
          <div className="brand-tagline">Clear guidance for confident home decisions.</div>
        </div>
      </div>

      {/* Nav Bar - full width, sticky */}
      <div className="nav-bar">
        <div className="container nav-container">
          <nav className="nav-left">
            <NavLink className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} to="/">Home</NavLink>
            <NavLink className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} to="/services">Services</NavLink>
            <NavLink className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} to="/cost-calculator">Cost Calculator</NavLink>
            <NavLink className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} to="/guide">Guide</NavLink>
            <NavLink className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} to="/community">Community</NavLink>
            <NavLink className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} to="/mission">Mission</NavLink>
          </nav>
          <div className="nav-actions">
            <Link className="btn btn-primary" to="/cost-calculator">Estimate Cost</Link>
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
            <Route path="/mission" element={<Mission />} />
          </Routes>
        </main>
      </div>

      {/* Footer - full width */}
      <footer className="site-footer-full">
        <div className="footer-top-band">
          <div className="container footer-top">
            <div className="footer-brand">
              <div className="footer-badge"><img src={LogoImg} alt="Home Owner Steward" /></div>
              <div className="footer-mission">Helping people plan, buy, and maintain homes with clarity.</div>
            </div>
            <div>
              <Link className="btn btn-ghost" to="/cost-calculator">Estimate Cost</Link>
            </div>
          </div>
        </div>

        <div className="footer-links container">
          <div className="copyright">© {new Date().getFullYear()} Home Owner Steward</div>
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
