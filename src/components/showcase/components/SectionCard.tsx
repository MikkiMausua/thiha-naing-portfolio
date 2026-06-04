import React from 'react'
import { cn } from '@/lib/utils'

interface SectionCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

export default function SectionCard({ title, subtitle, children, className = '', icon }: SectionCardProps) {
  return (
    <section className={cn("bg-white rounded-2xl border border-gray-light/60 p-6 shadow-sm", className)}>
      <div className="flex items-center gap-3 border-b border-gray-light/40 pb-4 mb-5">
        {icon && <div className="text-blue flex-shrink-0">{icon}</div>}
        <div>
          <h2 className="text-lg font-bold text-navy leading-tight">{title}</h2>
          {subtitle && <p className="text-xs text-gray mt-0.5 leading-normal">{subtitle}</p>}
        </div>
      </div>
      <div className="text-charcoal leading-relaxed text-sm whitespace-pre-wrap">
        {children}
      </div>
    </section>
  )
}
