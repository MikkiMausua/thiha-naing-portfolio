import React from 'react'
import type { ShowcaseItem, GalleryImage } from '@/types'
import CategoryBadge from '../components/CategoryBadge'
import InfoCard from '../components/InfoCard'
import SectionCard from '../components/SectionCard'
import ToolBadgeList from '../components/ToolBadgeList'
import ImageGallery from '../ImageGallery'

interface SocialMediaTemplateProps {
  project: ShowcaseItem
  galleryImages: GalleryImage[]
}

export default function SocialMediaTemplate({ project, galleryImages }: SocialMediaTemplateProps) {
  const details = project.category_details?.socialMedia || {}

  // Parse content pillars
  const contentPillarsList = details.contentPillars
    ? details.contentPillars.split('\n').map((p: string) => p.trim()).filter(Boolean)
    : []

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* Social Media Title Hero Banner */}
      <header className="bg-white rounded-3xl border border-gray-light/60 p-8 shadow-sm text-center md:text-left md:flex justify-between items-center gap-6">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
            <CategoryBadge category={project.category} />
            {details.platform && (
              <span className="text-xs font-semibold text-blue bg-blue/10 border border-blue/20 px-2.5 py-0.5 rounded-full">
                {details.platform}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-navy leading-tight">
            {project.title}
          </h1>
          {project.project_type && (
            <p className="text-sm font-medium text-gray mt-2">{project.project_type}</p>
          )}
        </div>
        {project.my_role && (
          <div className="mt-4 md:mt-0 flex-shrink-0 bg-bg px-6 py-4 rounded-2xl border border-gray-light/40 text-center md:text-right">
            <span className="text-[10px] font-semibold text-gray uppercase tracking-wider block">
              My Role
            </span>
            <span className="text-base font-bold text-navy">{project.my_role}</span>
          </div>
        )}
      </header>

      {/* Main split grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Brief */}
          {project.short_description && (
            <SectionCard title="Brand &amp; Campaign Overview">
              <p className="text-charcoal leading-relaxed text-base">{project.short_description}</p>
            </SectionCard>
          )}

          {/* Strategies */}
          {(details.creativeDirection || details.captionStrategy || details.brandVoice) && (
            <SectionCard title="Social Content Strategy">
              <div className="space-y-5">
                {details.brandVoice && (
                  <div>
                    <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-1.5">Brand Voice &amp; Tone</h4>
                    <p className="text-sm text-charcoal">{details.brandVoice}</p>
                  </div>
                )}
                {details.creativeDirection && (
                  <div>
                    <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-1.5">Creative Direction &amp; Formats</h4>
                    <p className="text-sm text-charcoal whitespace-pre-wrap">{details.creativeDirection}</p>
                  </div>
                )}
                {details.captionStrategy && (
                  <div>
                    <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-1.5">Caption &amp; Copywriting Strategy</h4>
                    <p className="text-sm text-charcoal whitespace-pre-wrap">{details.captionStrategy}</p>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* Social post examples or caption guidelines */}
          {details.bestPerformingPosts && (
            <SectionCard title="Top Performing Content Samples">
              <div className="bg-bg/40 p-6 rounded-2xl border border-gray-light/40 text-charcoal text-sm leading-relaxed whitespace-pre-wrap">
                {details.bestPerformingPosts}
              </div>
            </SectionCard>
          )}

          {/* Content pillars lists */}
          {contentPillarsList.length > 0 && (
            <SectionCard title="Content Pillars">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contentPillarsList.map((pillar: string, idx: number) => {
                  const parts = pillar.split(/[:-]/)
                  const title = parts[0]?.trim() || `Pillar ${idx + 1}`
                  const desc = parts.slice(1).join('-').trim()
                  return (
                    <div key={idx} className="bg-bg/30 p-4 rounded-xl border border-gray-light/40">
                      <h4 className="font-bold text-navy text-xs uppercase tracking-wider">{title}</h4>
                      {desc && <p className="text-xs text-charcoal/80 mt-1 leading-relaxed">{desc}</p>}
                    </div>
                  )
                })}
              </div>
            </SectionCard>
          )}

          {/* Monthly plan or calendar notes */}
          {details.monthlyPlanCalendar && (
            <SectionCard title="Content Calendar &amp; Scheduling Workflow">
              <p className="text-sm text-charcoal whitespace-pre-wrap">{details.monthlyPlanCalendar}</p>
            </SectionCard>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <InfoCard
            title="Channel Metadata"
            items={[
              { label: 'Platform Channel', value: details.platform },
              { label: 'Campaign Page Type', value: details.campaignPageType },
              { label: 'Content Formats', value: details.contentFormats },
              { label: 'Posting Frequency', value: details.postingFrequency },
              { label: 'Community Management', value: details.communityManagementNotes },
            ]}
          />

          {project.tools_used && (
            <div className="bg-white rounded-2xl border border-gray-light/60 p-6 shadow-sm">
              <ToolBadgeList tools={project.tools_used} title="Tools Used" />
            </div>
          )}

          {/* Outcomes & Highlights */}
          {(project.results || details.engagementMetrics) && (
            <div className="bg-blue-50/20 rounded-2xl border border-blue-100 p-6 space-y-4">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-blue-100/50 pb-2">
                Outcomes &amp; Results
              </h3>
              {details.engagementMetrics && (
                <div>
                  <span className="text-[10px] font-bold text-blue uppercase tracking-wider block">Engagement Highlights</span>
                  <p className="text-sm text-charcoal/90 mt-0.5 whitespace-pre-wrap">{details.engagementMetrics}</p>
                </div>
              )}
              {project.results && (
                <div>
                  <span className="text-[10px] font-bold text-blue uppercase tracking-wider block">Campaign Results</span>
                  <p className="text-sm text-charcoal/90 mt-0.5 whitespace-pre-wrap">{project.results}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Gallery visual samples */}
      {galleryImages.length > 0 && (
        <section className="bg-white rounded-2xl border border-gray-light/60 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-navy border-b border-gray-light/40 pb-4 mb-5">
            Social Posts Feed &amp; Carousel Creative Visuals
          </h2>
          <ImageGallery images={galleryImages} />
        </section>
      )}

      {/* Case Study */}
      {project.full_case_study && (
        <SectionCard title="Full Social Media Case Study">
          <p className="whitespace-pre-wrap text-charcoal leading-relaxed">{project.full_case_study}</p>
        </SectionCard>
      )}
    </div>
  )
}
