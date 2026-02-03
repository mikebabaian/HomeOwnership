import React from 'react'

export default function FlagIcon({ className }: { className?: string }){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M5 3v18" />
      <path d="M19 3s-3 1.5-6 1.5S7 3 7 3v12s3-1.5 6-1.5 6 1.5 6 1.5V3z" />
    </svg>
  )
}
