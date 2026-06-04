import React from 'react'

interface InfoItem {
  label: string
  value?: string | number | null
}

interface InfoCardProps {
  title?: string
  items: InfoItem[]
  className?: string
}

export default function InfoCard({ title, items, className = '' }: InfoCardProps) {
  const activeItems = items.filter(item => item.value !== undefined && item.value !== null && item.value !== '')

  if (activeItems.length === 0) return null

  return (
    <div className={`bg-white rounded-2xl border border-gray-light/60 p-6 shadow-sm ${className}`}>
      {title && (
        <h3 className="font-bold text-navy text-sm uppercase tracking-wider mb-4 border-b border-gray-light/40 pb-2">
          {title}
        </h3>
      )}
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activeItems.map((item, idx) => (
          <div key={idx} className="flex flex-col">
            <dt className="text-xs font-semibold text-gray uppercase tracking-wider mb-0.5">
              {item.label}
            </dt>
            <dd className="text-sm font-semibold text-navy leading-normal">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
