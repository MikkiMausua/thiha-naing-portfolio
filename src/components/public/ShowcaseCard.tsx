import Link from 'next/link'
import Image from 'next/image'
import type { ShowcaseItem } from '@/types'

interface ShowcaseCardProps {
  item: ShowcaseItem
}

export default function ShowcaseCard({ item }: ShowcaseCardProps) {
  return (
    <Link
      href={`/showcase/${item.slug}`}
      className="group block rounded-2xl glass-card border border-white/5 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1 hover:border-accent/20"
    >
      {/* Image Container */}
      <div className="aspect-[16/10] relative overflow-hidden">
        {item.cover_image_url ? (
          <Image
            src={item.cover_image_url}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-blue/10 to-navy" />
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F14] via-transparent to-transparent opacity-60" />

        {/* Category Badge */}
        {item.category && (
          <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full glass text-xs font-medium text-white/90 backdrop-blur-sm">
            {item.category}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white line-clamp-1 transition-colors duration-300 group-hover:text-accent">{item.title}</h3>
        {item.short_description && (
          <p className="text-sm text-white/50 mt-1.5 line-clamp-2 leading-relaxed">
            {item.short_description}
          </p>
        )}

        {/* Bottom Row */}
        <div className="flex items-center justify-between mt-4">
          {item.project_type && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/5 text-xs font-medium text-white/60">
              {item.project_type}
            </span>
          )}
          <span className="text-sm font-medium text-accent/80 transition-all duration-300 group-hover:text-accent group-hover:translate-x-1 inline-flex items-center gap-1">
            View Details
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}
