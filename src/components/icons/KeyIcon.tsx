import React from 'react'

export default function KeyIcon({ className }: { className?: string }){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M21 2l-9 9" />
      <circle cx="7" cy="14" r="4" />
      <path d="M21 2l-2 2" />
    </svg>
  )
}
