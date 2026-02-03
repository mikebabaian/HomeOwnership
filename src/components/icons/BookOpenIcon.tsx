import React from 'react'

export default function BookOpenIcon({ className }: { className?: string }){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M2 7s4-3 10-3 10 3 10 3v13s-4-3-10-3S2 20 2 20V7z" />
      <path d="M12 4v16" />
    </svg>
  )
}
