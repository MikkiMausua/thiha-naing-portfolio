import React from 'react'
import type { ShowcaseItem, GalleryImage } from '@/types'
import CategoryBadge from '../components/CategoryBadge'
import InfoCard from '../components/InfoCard'
import SectionCard from '../components/SectionCard'
import ToolBadgeList from '../components/ToolBadgeList'
import BeforeAfterBlock from '../components/BeforeAfterBlock'
import ImageGallery from '../ImageGallery'

interface ContentWritingTemplateProps {
  project: ShowcaseItem
  galleryImages: GalleryImage[]
}

export default function ContentWritingTemplate({ project, galleryImages }: ContentWritingTemplateProps) {
  const details = project.category_details?.contentWriting || {}

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* Title Hero Banner */}
      <header className="bg-white rounded-3xl border border-gray-light/60 p-8 shadow-sm text-center md:text-left md:flex justify-between items-center gap-6">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
            <CategoryBadge category={project.category} />
            {details.contentType && (
              <span className="text-xs font-semibold text-blue bg-blue/10 border border-blue/20 px-2.5 py-0.5 rounded-full">
                {details.contentType}
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

      {/* Info strip & Meta Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Brief / Short Description */}
          {project.short_description && (
            <SectionCard title="Project Brief">
              <p className="text-charcoal leading-relaxed text-base">{project.short_description}</p>
            </SectionCard>
          )}

          {/* Strategy & Challenge */}
          {(details.contentGoal || details.keyMessage || details.targetAudience) && (
            <SectionCard title="Content Strategy & Goals">
              <div className="space-y-4">
                {details.contentGoal && (
                  <div>
                    <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-1">Content Goal</h4>
                    <p className="text-sm text-charcoal">{details.contentGoal}</p>
                  </div>
                )}
                {details.keyMessage && (
                  <div>
                    <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-1">Key Message</h4>
                    <p className="text-sm text-charcoal">{details.keyMessage}</p>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* Writing Samples */}
          {details.writingSamples && (
            <SectionCard title="Writing Sample / Copy">
              <div className="bg-bg/40 p-6 rounded-2xl border border-gray-light/40 text-charcoal whitespace-pre-wrap font-mono text-sm leading-relaxed max-h-[400px] overflow-y-auto">
                {details.writingSamples}
              </div>
            </SectionCard>
          )}

          {/* Before & After copy */}
          {(details.beforeCopy || details.afterCopy) && (
            <SectionCard title="Copy Revision Comparison">
              <BeforeAfterBlock
                beforeContent={details.beforeCopy}
                afterContent={details.afterCopy}
                beforeTitle="Original Copy"
                afterTitle="Revised Copy"
              />
            </SectionCard>
          )}
        </div>

        {/* Sidebar details */}
        <div className="space-y-8">
          <InfoCard
            title="Campaign Details"
            items={[
              { label: 'Client / Brand Type', value: details.clientBrandType },
              { label: 'Target Audience', value: details.targetAudience },
              { label: 'Tone of Voice', value: details.toneOfVoice },
              { label: 'Distribution Channel', value: details.distributionChannel },
            ]}
          />

          {project.tools_used && (
            <div className="bg-white rounded-2xl border border-gray-light/60 p-6 shadow-sm">
              <ToolBadgeList tools={project.tools_used} title="Tools & Platforms" />
            </div>
          )}

          {/* Results / Outcomes */}
          {(project.results || details.performanceMetrics || details.ctaOutcome) && (
            <div className="bg-blue-50/20 rounded-2xl border border-blue-100 p-6 space-y-4">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-blue-100/50 pb-2">
                Results &amp; Impact
              </h3>
              {details.performanceMetrics && (
                <div>
                  <span className="text-[10px] font-bold text-blue uppercase tracking-wider block">Performance Metrics</span>
                  <p className="text-sm text-charcoal/90 mt-0.5">{details.performanceMetrics}</p>
                </div>
              )}
              {project.results && (
                <div>
                  <span className="text-[10px] font-bold text-blue uppercase tracking-wider block">Metrics Outcome</span>
                  <p className="text-sm text-charcoal/90 mt-0.5 whitespace-pre-wrap">{project.results}</p>
                </div>
              )}
              {details.ctaOutcome && (
                <div>
                  <span className="text-[10px] font-bold text-blue uppercase tracking-wider block">Call to Action (CTA)</span>
                  <p className="text-sm font-semibold text-navy mt-0.5">{details.ctaOutcome}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Gallery images */}
      {galleryImages.length > 0 && (
        <section className="bg-white rounded-2xl border border-gray-light/60 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-navy border-b border-gray-light/40 pb-4 mb-5">
            Visual Assets &amp; Post Screenshots
          </h2>
          <ImageGallery images={galleryImages} />
        </section>
      )}

      {/* Full Case Study (if present) */}
      {project.full_case_study && (
        <SectionCard title="Full Campaign Context &amp; Details">
          <p className="whitespace-pre-wrap text-charcoal leading-relaxed">{project.full_case_study}</p>
        </SectionCard>
      )}
    </div>
  )
}
