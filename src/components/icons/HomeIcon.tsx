import React from 'react'

export default function HomeIcon({ className }: { className?: string }){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M3 11.5L12 4l9 7.5" />
      <path d="M5 21V11h14v10" />
    </svg>
  )
}
