import React from 'react'

export default function SmileIcon({ className }: { className?: string }){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 13s1.5 2 4 2 4-2 4-2" />
      <path d="M9 10h.01M15 10h.01" />
    </svg>
  )
}
