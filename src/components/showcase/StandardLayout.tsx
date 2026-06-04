import Image from 'next/image'
import type { ShowcaseItem, GalleryImage } from '@/types'
import { cn } from '@/lib/utils'
import ImageGallery from './ImageGallery'

interface StandardLayoutProps {
  project: ShowcaseItem
  galleryImages: GalleryImage[]
}

export default function StandardLayout({ project, galleryImages }: StandardLayoutProps) {
  const tools = project.tools_used
    ? project.tools_used.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  return (
    <div className="min-h-screen bg-bg">
      {/* Cover Image Hero */}
      {project.cover_image_url ? (
        <section className="relative w-full h-[45vh] overflow-hidden">
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-6xl mx-auto">
              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white bg-blue rounded-full mb-3">
                {project.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {project.title}
              </h1>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-navy py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white bg-blue rounded-full mb-3">
              {project.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {project.title}
            </h1>
          </div>
        </section>
      )}

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            {project.short_description && (
              <section>
                <h2 className="text-xl font-bold text-navy mb-3">Overview</h2>
                <p className="text-charcoal leading-relaxed">{project.short_description}</p>
              </section>
            )}

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-navy mb-4">Gallery</h2>
                <ImageGallery images={galleryImages} />
              </section>
            )}

            {/* Content Writing Sample */}
            {project.content_writing_sample && (
              <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-light">
                <h2 className="text-xl font-bold text-navy mb-3">Content Writing Sample</h2>
                <div className="text-charcoal leading-relaxed whitespace-pre-wrap">
                  {project.content_writing_sample}
                </div>
              </section>
            )}

            {/* Media Buying Notes */}
            {project.media_buying_notes && (
              <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-light">
                <h2 className="text-xl font-bold text-navy mb-3">Media Buying Notes</h2>
                <div className="text-charcoal leading-relaxed whitespace-pre-wrap">
                  {project.media_buying_notes}
                </div>
              </section>
            )}

            {/* Event Planning Notes */}
            {project.event_planning_notes && (
              <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-light">
                <h2 className="text-xl font-bold text-navy mb-3">Event Planning Notes</h2>
                <div className="text-charcoal leading-relaxed whitespace-pre-wrap">
                  {project.event_planning_notes}
                </div>
              </section>
            )}

            {/* Results & Metrics */}
            {project.results && (
              <section className="bg-blue/5 rounded-xl p-6 border border-blue/20">
                <h2 className="text-xl font-bold text-navy mb-3">Results &amp; Metrics</h2>
                <div className="text-charcoal leading-relaxed whitespace-pre-wrap">
                  {project.results}
                </div>
              </section>
            )}

            {/* Full Case Study */}
            {project.full_case_study && (
              <section>
                <h2 className="text-xl font-bold text-navy mb-3">Full Case Study</h2>
                <div className="text-charcoal leading-relaxed whitespace-pre-wrap">
                  {project.full_case_study}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Project Details Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-light">
                <h3 className="text-lg font-bold text-navy mb-4">Project Details</h3>
                <dl className="space-y-3">
                  {project.project_type && (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-gray">
                        Project Type
                      </dt>
                      <dd className="text-sm text-navy font-medium mt-0.5">
                        {project.project_type}
                      </dd>
                    </div>
                  )}
                  {project.my_role && (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-gray">
                        My Role
                      </dt>
                      <dd className="text-sm text-navy font-medium mt-0.5">{project.my_role}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-gray">
                      Category
                    </dt>
                    <dd className="mt-1">
                      <span className="inline-block px-2.5 py-0.5 text-xs font-semibold text-blue bg-blue/10 rounded-full">
                        {project.category}
                      </span>
                    </dd>
                  </div>
                  {tools.length > 0 && (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-gray mb-1.5">
                        Tools Used
                      </dt>
                      <dd className="flex flex-wrap gap-1.5">
                        {tools.map((tool) => (
                          <span
                            key={tool}
                            className="inline-block px-2.5 py-0.5 text-xs font-medium text-charcoal bg-gray-light rounded-full"
                          >
                            {tool}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Facebook Post Link */}
              {project.facebook_post_url && (
                <a
                  href={project.facebook_post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl',
                    'bg-blue text-white font-semibold text-sm',
                    'hover:bg-blue/90 transition-colors duration-200',
                    'shadow-sm'
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  View Facebook Post
                </a>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
