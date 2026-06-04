import Image from 'next/image'
import type { ShowcaseItem, GalleryImage } from '@/types'
import { cn } from '@/lib/utils'
import ImageGallery from './ImageGallery'

interface CaseStudyLayoutProps {
  project: ShowcaseItem
  galleryImages: GalleryImage[]
}

export default function CaseStudyLayout({ project, galleryImages }: CaseStudyLayoutProps) {
  const tools = project.tools_used
    ? project.tools_used.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  return (
    <div className="min-h-screen bg-white">
      {/* Full-width Hero */}
      {project.cover_image_url ? (
        <section className="relative w-full h-[60vh] overflow-hidden">
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-navy/20" />
          <div className="absolute inset-0 flex items-end">
            <div className="w-full max-w-4xl mx-auto px-6 pb-12 md:pb-16">
              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white bg-blue rounded-full mb-4">
                {project.category}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {project.title}
              </h1>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-navy py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-6">
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white bg-blue rounded-full mb-4">
              {project.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {project.title}
            </h1>
          </div>
        </section>
      )}

      {/* Project Details Horizontal Strip */}
      <section className="bg-bg border-b border-gray-light">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div className="flex flex-wrap items-center gap-6 md:gap-10">
            {project.project_type && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray block">
                  Type
                </span>
                <span className="text-sm text-navy font-medium">{project.project_type}</span>
              </div>
            )}
            {project.my_role && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray block">
                  Role
                </span>
                <span className="text-sm text-navy font-medium">{project.my_role}</span>
              </div>
            )}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray block">
                Category
              </span>
              <span className="inline-block px-2.5 py-0.5 text-xs font-semibold text-blue bg-blue/10 rounded-full mt-0.5">
                {project.category}
              </span>
            </div>
            {project.facebook_post_url && (
              <div className="ml-auto">
                <a
                  href={project.facebook_post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue hover:text-blue/80 font-medium transition-colors"
                >
                  View Facebook Post →
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Overview */}
      {project.short_description && (
        <section className="bg-white py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-6">
            <p className="text-xl md:text-2xl text-charcoal leading-relaxed font-light">
              {project.short_description}
            </p>
          </div>
        </section>
      )}

      {/* Gallery Images */}
      {galleryImages.length > 0 && (
        <section className="bg-bg py-10 md:py-14">
          <div className="max-w-5xl mx-auto px-6">
            <ImageGallery images={galleryImages} />
          </div>
        </section>
      )}

      {/* Content Writing Sample */}
      {project.content_writing_sample && (
        <section className="bg-white py-10 md:py-14">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-navy mb-4">Content Writing Sample</h2>
            <div className="text-charcoal leading-relaxed text-lg whitespace-pre-wrap">
              {project.content_writing_sample}
            </div>
          </div>
        </section>
      )}

      {/* Media Buying Notes */}
      {project.media_buying_notes && (
        <section className="bg-bg py-10 md:py-14">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-navy mb-4">Media Buying Notes</h2>
            <div className="text-charcoal leading-relaxed text-lg whitespace-pre-wrap">
              {project.media_buying_notes}
            </div>
          </div>
        </section>
      )}

      {/* Event Planning Notes */}
      {project.event_planning_notes && (
        <section className="bg-white py-10 md:py-14">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-navy mb-4">Event Planning Notes</h2>
            <div className="text-charcoal leading-relaxed text-lg whitespace-pre-wrap">
              {project.event_planning_notes}
            </div>
          </div>
        </section>
      )}

      {/* Results & Metrics */}
      {project.results && (
        <section className="bg-blue/5 py-10 md:py-14">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-navy mb-4">Results &amp; Metrics</h2>
            <div className="text-charcoal leading-relaxed text-lg whitespace-pre-wrap">
              {project.results}
            </div>
          </div>
        </section>
      )}

      {/* Full Case Study */}
      {project.full_case_study && (
        <section className="bg-white py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-navy mb-6">Full Case Study</h2>
            <div className="text-charcoal leading-relaxed text-lg whitespace-pre-wrap prose prose-lg max-w-none">
              {project.full_case_study}
            </div>
          </div>
        </section>
      )}

      {/* Tools Used Footer */}
      {tools.length > 0 && (
        <section className="bg-bg border-t border-gray-light py-8">
          <div className="max-w-4xl mx-auto px-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray mb-3">
              Tools &amp; Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool) => (
                <span
                  key={tool}
                  className="inline-block px-3 py-1 text-sm font-medium text-charcoal bg-white border border-gray-light rounded-full"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
