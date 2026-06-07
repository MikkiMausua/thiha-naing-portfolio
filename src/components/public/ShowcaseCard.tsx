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
      className="group block rounded-2xl glass-dark border border-white/10 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-1 hover:border-accent/50"
    >
      {/* Image Container */}
      <div className="aspect-[16/10] relative overflow-hidden">
        {item.cover_image_url ? (
          <Image
            src={item.cover_image_url}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy/80 via-blue/60 to-indigo-500/40" />
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />

        {/* Category Badge */}
        {item.category && (
          <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full glass text-xs font-medium text-white backdrop-blur-sm">
            {item.category}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white line-clamp-1">{item.title}</h3>
        {item.short_description && (
          <p className="text-sm text-white/70 mt-1 line-clamp-2 leading-relaxed">
            {item.short_description}
          </p>
        )}

        {/* Bottom Row */}
        <div className="flex items-center justify-between mt-4">
          {item.project_type && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/10 text-xs font-medium text-white/80">
              {item.project_type}
            </span>
          )}
          <span className="text-sm font-medium text-accent transition-colors duration-200 group-hover:text-white">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  )
}
