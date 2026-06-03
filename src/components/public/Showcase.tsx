'use client'

import { useState } from 'react'
import type { ShowcaseItem } from '@/types'
import { showcaseCategories } from '@/lib/constants'
import ShowcaseCard from '@/components/public/ShowcaseCard'
import EmptyState from '@/components/ui/EmptyState'

interface ShowcaseProps {
  items: ShowcaseItem[]
}

export default function Showcase({ items }: ShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredItems =
    activeCategory === 'All'
      ? items
      : items.filter((item) => item.category === activeCategory)

  return (
    <section id="showcase" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Showcase</h2>
          <div className="w-[60px] h-[3px] bg-blue mx-auto" />
        </div>

        {items.length === 0 ? (
          <EmptyState
            title="Showcase projects coming soon"
            description="Stay tuned — projects will be added here as they're completed."
          />
        ) : (
          <>
            {/* Category Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
              {showcaseCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-navy text-white shadow-sm'
                      : 'bg-white text-charcoal border border-gray-light hover:bg-navy/5 hover:border-navy/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <ShowcaseCard key={item.id} item={item} />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray">No projects found in this category.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
