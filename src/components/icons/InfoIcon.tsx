import React from 'react'

export default function InfoIcon({ className }: { className?: string }){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v.01M12 12v4" />
    </svg>
  )
}
