import React from 'react'
import type { ShowcaseItem, GalleryImage } from '@/types'
import CategoryBadge from '../components/CategoryBadge'
import InfoCard from '../components/InfoCard'
import SectionCard from '../components/SectionCard'
import ToolBadgeList from '../components/ToolBadgeList'
import KPIGrid from '../components/KPIGrid'
import ConfidentialityNote from '../components/ConfidentialityNote'
import ImageGallery from '../ImageGallery'

interface MediaBuyingTemplateProps {
  project: ShowcaseItem
  galleryImages: GalleryImage[]
}

export default function MediaBuyingTemplate({ project, galleryImages }: MediaBuyingTemplateProps) {
  const details = project.category_details?.mediaBuying || {}

  // Prepare KPI items, omitting if empty
  const kpiItems = [
    { label: 'Total Spend', value: details.totalSpend },
    { label: 'ROAS', value: details.roas, desc: details.roas ? 'Verified Return on Ad Spend' : null },
    { label: 'Impressions', value: details.impressions },
    { label: 'Reach', value: details.reach },
    { label: 'Clicks', value: details.clicks },
    { label: 'CTR', value: details.ctr },
    { label: 'CPC', value: details.cpc },
    { label: 'CPM', value: details.cpm },
    { label: 'Conversions', value: details.leadsMessagesPurchases },
  ].filter(item => item.value)

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* Title Header */}
      <header className="bg-white rounded-3xl border border-gray-light/60 p-8 shadow-sm text-center md:text-left md:flex justify-between items-end gap-6">
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

      {/* KPI dashboard grid cards */}
      {kpiItems.length > 0 && (
        <section className="bg-bg/40 p-6 rounded-3xl border border-gray-light/50">
          <h2 className="text-sm font-bold text-navy uppercase tracking-wider mb-4">
            Campaign Performance Metrics
          </h2>
          <KPIGrid items={kpiItems} />
        </section>
      )}

      {/* Snap info & main details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main strategy blocks */}
        <div className="md:col-span-2 space-y-8">
          {/* Brief Overview */}
          {project.short_description && (
            <SectionCard title="Campaign Overview &amp; Challenge">
              <p className="text-charcoal leading-relaxed text-base">{project.short_description}</p>
            </SectionCard>
          )}

          {/* Audience & Creative strategies */}
          {(details.audienceStrategy || details.creativeStrategy) && (
            <SectionCard title="Funnel &amp; Creative Strategy">
              <div className="space-y-5">
                {details.audienceStrategy && (
                  <div>
                    <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-1.5">Audience &amp; Targeting Strategy</h4>
                    <p className="text-sm text-charcoal whitespace-pre-wrap">{details.audienceStrategy}</p>
                  </div>
                )}
                {details.creativeStrategy && (
                  <div>
                    <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-1.5">Creative Strategy &amp; Ad Formats</h4>
                    <p className="text-sm text-charcoal whitespace-pre-wrap">{details.creativeStrategy}</p>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* Optimization strategy details */}
          {details.optimizationApproach && (
            <SectionCard title="Optimization &amp; Campaign Iteration">
              <p className="text-sm text-charcoal whitespace-pre-wrap">{details.optimizationApproach}</p>
            </SectionCard>
          )}

          {/* Reporting notes */}
          {details.reportingNotes && (
            <SectionCard title="Performance Analysis &amp; Notes">
              <p className="text-sm text-charcoal whitespace-pre-wrap">{details.reportingNotes}</p>
            </SectionCard>
          )}
        </div>

        {/* Sidebar snaps */}
        <div className="space-y-8">
          <InfoCard
            title="Campaign Details"
            items={[
              { label: 'Ad Platform', value: details.platform },
              { label: 'Campaign Objective', value: details.campaignObjective },
              { label: 'Campaign Run Date', value: details.dateRange },
            ]}
          />

          {project.tools_used && (
            <div className="bg-white rounded-2xl border border-gray-light/60 p-6 shadow-sm">
              <ToolBadgeList tools={project.tools_used} title="Tools Used" />
            </div>
          )}

          {/* Results section */}
          {project.results && (
            <div className="bg-blue-50/20 rounded-2xl border border-blue-100 p-6">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-blue-100/50 pb-2 mb-3">
                Key Findings &amp; Outcomes
              </h3>
              <p className="text-sm text-charcoal whitespace-pre-wrap leading-relaxed">
                {project.results}
              </p>
            </div>
          )}

          {/* Confidentiality card */}
          <ConfidentialityNote />
        </div>
      </div>

      {/* Gallery visual screenshots */}
      {galleryImages.length > 0 && (
        <section className="bg-white rounded-2xl border border-gray-light/60 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-navy border-b border-gray-light/40 pb-4 mb-5">
            KPI Dashboards &amp; Ad Creatives
          </h2>
          <ImageGallery images={galleryImages} />
        </section>
      )}

      {/* Case Study markup */}
      {project.full_case_study && (
        <SectionCard title="Detailed Campaign Case Study">
          <p className="whitespace-pre-wrap text-charcoal leading-relaxed">{project.full_case_study}</p>
        </SectionCard>
      )}
    </div>
  )
}
