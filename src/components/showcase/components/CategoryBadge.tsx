import React from 'react'
import { cn } from '@/lib/utils'

interface CategoryBadgeProps {
  category: string
  className?: string
}

export default function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
  const getColors = (cat: string) => {
    const c = cat.toLowerCase().trim()
    if (c.includes('writing') || c.includes('content')) {
      return 'bg-purple-100 text-purple-700 border-purple-200'
    }
    if (c.includes('media') || c.includes('buying') || c.includes('ad')) {
      return 'bg-blue-100 text-blue-700 border-blue-200'
    }
    if (c.includes('event') || c.includes('planning')) {
      return 'bg-amber-100 text-amber-700 border-amber-200'
    }
    if (c.includes('social') || c.includes('media')) {
      return 'bg-rose-100 text-rose-700 border-rose-200'
    }
    if (c.includes('auto') || c.includes('automation') || c.includes('workflow')) {
      return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    }
    return 'bg-gray-100 text-charcoal/80 border-gray-200'
  }

  return (
    <span className={cn(
      "inline-block px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border",
      getColors(category),
      className
    )}>
      {category}
    </span>
  )
}
