import React from 'react'

interface KPICard {
  label: string
  value?: string | number | null
  desc?: string | null
  verified?: boolean
}

interface KPIGridProps {
  items: KPICard[]
}

export default function KPIGrid({ items }: KPIGridProps) {
  // Filter out items with empty value
  const activeItems = items.filter(item => item.value !== undefined && item.value !== null && item.value !== '')

  if (activeItems.length === 0) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {activeItems.map((kpi, idx) => (
        <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-light/60 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray block mb-1">
              {kpi.label}
            </span>
            <span className="text-2xl md:text-3xl font-extrabold text-navy leading-none block">
              {kpi.value}
            </span>
          </div>
          {kpi.desc && (
            <p className="text-xs text-gray mt-2 leading-relaxed">
              {kpi.desc}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
