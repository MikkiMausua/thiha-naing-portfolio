import type { ShowcaseItem, GalleryImage } from '@/types'
import { cn } from '@/lib/utils'
import ImageGallery from './ImageGallery'

interface MinimalLayoutProps {
  project: ShowcaseItem
  galleryImages: GalleryImage[]
}

export default function MinimalLayout({ project, galleryImages }: MinimalLayoutProps) {
  const tools = project.tools_used
    ? project.tools_used.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        {/* Header */}
        <header className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue mb-2">
            {project.category}
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight">
            {project.title}
          </h1>

          {/* Project Metadata */}
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray">
            {project.my_role && (
              <span>
                <span className="text-charcoal font-medium">{project.my_role}</span>
              </span>
            )}
            {project.project_type && (
              <span>
                <span className="text-charcoal font-medium">{project.project_type}</span>
              </span>
            )}
            {tools.length > 0 && (
              <span className="text-charcoal font-medium">
                {tools.join(' · ')}
              </span>
            )}
          </div>
        </header>

        {/* Overview */}
        {project.short_description && (
          <section className="mb-8">
            <p className="text-charcoal text-lg leading-relaxed">
              {project.short_description}
            </p>
          </section>
        )}

        {/* Gallery - small inline thumbnails */}
        {galleryImages.length > 0 && (
          <section className="mb-8">
            <ImageGallery images={galleryImages} />
          </section>
        )}

        {/* Content Writing Sample */}
        {project.content_writing_sample && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-navy mb-2">Content Writing Sample</h2>
            <div className="text-charcoal leading-relaxed whitespace-pre-wrap">
              {project.content_writing_sample}
            </div>
          </section>
        )}

        {/* Media Buying Notes */}
        {project.media_buying_notes && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-navy mb-2">Media Buying Notes</h2>
            <div className="text-charcoal leading-relaxed whitespace-pre-wrap">
              {project.media_buying_notes}
            </div>
          </section>
        )}

        {/* Event Planning Notes */}
        {project.event_planning_notes && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-navy mb-2">Event Planning Notes</h2>
            <div className="text-charcoal leading-relaxed whitespace-pre-wrap">
              {project.event_planning_notes}
            </div>
          </section>
        )}

        {/* Results - subtle bordered box */}
        {project.results && (
          <section className="mb-8">
            <div className="border border-gray-light rounded-lg p-5">
              <h2 className="text-lg font-semibold text-navy mb-2">Results &amp; Metrics</h2>
              <div className="text-charcoal leading-relaxed whitespace-pre-wrap">
                {project.results}
              </div>
            </div>
          </section>
        )}

        {/* Full Case Study */}
        {project.full_case_study && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-navy mb-2">Full Case Study</h2>
            <div className="text-charcoal leading-relaxed whitespace-pre-wrap">
              {project.full_case_study}
            </div>
          </section>
        )}

        {/* Facebook Link - simple text link */}
        {project.facebook_post_url && (
          <footer className="pt-6 border-t border-gray-light">
            <a
              href={project.facebook_post_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue hover:text-blue/80 font-medium transition-colors"
            >
              View the original Facebook post →
            </a>
          </footer>
        )}
      </div>
    </div>
  )
}
