import React from 'react'

interface ToolBadgeListProps {
  tools: string | string[]
  title?: string
}

export default function ToolBadgeList({ tools, title }: ToolBadgeListProps) {
  let parsedTools: string[] = []

  if (typeof tools === 'string') {
    parsedTools = tools
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
  } else if (Array.isArray(tools)) {
    parsedTools = tools.filter(Boolean)
  }

  if (parsedTools.length === 0) return null

  return (
    <div className="space-y-2">
      {title && (
        <span className="text-xs font-semibold uppercase tracking-wider text-gray block mb-1">
          {title}
        </span>
      )}
      <div className="flex flex-wrap gap-1.5">
        {parsedTools.map((tool, idx) => (
          <span
            key={idx}
            className="inline-block px-3 py-1 text-xs font-semibold text-charcoal bg-gray-light/65 rounded-full border border-gray-light"
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  )
}
