import React from 'react'

interface TimelineStep {
  title: string
  desc?: string
}

interface ProcessTimelineProps {
  title?: string
  steps: string | TimelineStep[]
}

export default function ProcessTimeline({ title, steps }: ProcessTimelineProps) {
  let parsedSteps: TimelineStep[] = []

  if (typeof steps === 'string') {
    parsedSteps = steps
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map((line, idx) => {
        const parts = line.split(/[:-]/)
        if (parts.length > 1) {
          return {
            title: parts[0].trim(),
            desc: parts.slice(1).join('-').trim()
          }
        }
        return {
          title: `Step ${idx + 1}`,
          desc: line
        }
      })
  } else if (Array.isArray(steps)) {
    parsedSteps = steps
  }

  if (parsedSteps.length === 0) return null

  return (
    <div className="space-y-6">
      {title && (
        <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-4">
          {title}
        </h3>
      )}
      <div className="relative border-l-2 border-blue/20 ml-3 pl-6 space-y-6">
        {parsedSteps.map((step, idx) => (
          <div key={idx} className="relative">
            {/* Timeline indicator circle */}
            <span className="absolute -left-[31px] top-1 flex items-center justify-center w-4 h-4 rounded-full bg-blue text-white ring-4 ring-white border-2 border-white">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </span>
            <div className="bg-slate-50 p-4 rounded-xl border border-gray-light/40">
              <h4 className="font-bold text-navy text-sm">{step.title}</h4>
              {step.desc && (
                <p className="text-xs text-charcoal/80 mt-1 leading-relaxed whitespace-pre-wrap">
                  {step.desc}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
