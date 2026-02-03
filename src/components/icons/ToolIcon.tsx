import React from 'react'

export default function ToolIcon({ className }: { className?: string }){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M14.7 10.3l-7.4 7.4-3-3 7.4-7.4" />
      <path d="M20.4 7.6a4 4 0 0 0-5.6 0l-1.4 1.4 5.6 5.6 1.4-1.4a4 4 0 0 0 0-5.6z" />
    </svg>
  )
}
