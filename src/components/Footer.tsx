import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faBookOpen, faFlag } from '@fortawesome/free-solid-svg-icons'

export default function Footer(){
  return (
    <footer className="site-footer">
      <div className="copyright">© {new Date().getFullYear()} Own Well Services</div>
      <nav>
        <Link to="/about"><FontAwesomeIcon icon={faCircleInfo} className="logo-icon" style={{verticalAlign:'middle', marginRight:8} as any}/>About</Link>
        <Link to="/resources"><FontAwesomeIcon icon={faBookOpen} className="logo-icon" style={{verticalAlign:'middle', marginRight:8} as any}/>Resources</Link>
        <Link to="/roadmap"><FontAwesomeIcon icon={faFlag} className="logo-icon" style={{verticalAlign:'middle', marginRight:8} as any}/>Roadmap</Link>
      </nav>
    </footer>
  )
}
