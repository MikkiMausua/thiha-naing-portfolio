import React from 'react'

interface ConfidentialityNoteProps {
  note?: string | null
}

export default function ConfidentialityNote({ note }: ConfidentialityNoteProps) {
  const defaultNote = "To comply with client confidentiality agreements, sensitive details such as specific brand names, targeting sheets, exact ad spend, and proprietary metrics may be generalized, rounded, or blurred."

  return (
    <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex gap-3 items-start">
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100/80 flex items-center justify-center text-amber-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </span>
      <div>
        <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-0.5">
          Client Confidentiality
        </h4>
        <p className="text-[11px] leading-relaxed text-amber-700/90">
          {note || defaultNote}
        </p>
      </div>
    </div>
  )
}
