import React from 'react'

interface BeforeAfterBlockProps {
  beforeTitle?: string
  beforeContent?: string | null
  afterTitle?: string
  afterContent?: string | null
  title?: string
}

export default function BeforeAfterBlock({
  beforeTitle = 'Before',
  beforeContent,
  afterTitle = 'After',
  afterContent,
  title
}: BeforeAfterBlockProps) {
  if (!beforeContent && !afterContent) return null

  return (
    <div className="space-y-3">
      {title && (
        <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-2">
          {title}
        </h3>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Before Block */}
        {beforeContent && (
          <div className="bg-red-50/40 rounded-xl border border-red-100 p-5">
            <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 rounded-full mb-3">
              {beforeTitle}
            </span>
            <div className="text-sm text-charcoal/90 whitespace-pre-wrap leading-relaxed">
              {beforeContent}
            </div>
          </div>
        )}

        {/* After Block */}
        {afterContent && (
          <div className="bg-green-50/30 rounded-xl border border-green-100 p-5">
            <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 rounded-full mb-3">
              {afterTitle}
            </span>
            <div className="text-sm text-charcoal/90 whitespace-pre-wrap leading-relaxed font-medium">
              {afterContent}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
