import React from 'react'
import type { ShowcaseItem, GalleryImage } from '@/types'
import CategoryBadge from '../components/CategoryBadge'
import InfoCard from '../components/InfoCard'
import SectionCard from '../components/SectionCard'
import ToolBadgeList from '../components/ToolBadgeList'
import ProcessTimeline from '../components/ProcessTimeline'
import BeforeAfterBlock from '../components/BeforeAfterBlock'
import ImageGallery from '../ImageGallery'

interface AutomationTemplateProps {
  project: ShowcaseItem
  galleryImages: GalleryImage[]
}

export default function AutomationTemplate({ project, galleryImages }: AutomationTemplateProps) {
  const details = project.category_details?.automation || {}

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* Title Hero */}
      <header className="bg-white rounded-3xl border border-gray-light/60 p-8 shadow-sm text-center md:text-left md:flex justify-between items-center gap-6">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
            <CategoryBadge category={project.category} />
            {details.trigger && (
              <span className="text-xs font-semibold text-blue bg-blue/10 border border-blue/20 px-2.5 py-0.5 rounded-full">
                Trigger: {details.trigger}
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
              Workflow Lead
            </span>
            <span className="text-base font-bold text-navy">{project.my_role}</span>
          </div>
        )}
      </header>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Brief */}
          {project.short_description && (
            <SectionCard title="Automation Overview">
              <p className="text-charcoal leading-relaxed text-base">{project.short_description}</p>
            </SectionCard>
          )}

          {/* Business Problem */}
          {details.businessProblem && (
            <SectionCard title="The Problem">
              <p className="text-sm text-charcoal">{details.businessProblem}</p>
            </SectionCard>
          )}

          {/* Before vs After comparison */}
          {(details.manualWorkflowBefore || details.automationGoal) && (
            <SectionCard title="Workflow Re-engineering">
              <BeforeAfterBlock
                beforeContent={details.manualWorkflowBefore}
                afterContent={details.automationGoal}
                beforeTitle="Manual Process (Before)"
                afterTitle="Automated Architecture (After Goal)"
              />
            </SectionCard>
          )}

          {/* Automation Steps / Run list */}
          {details.workflowSteps && (
            <SectionCard title="Step-by-Step Automated Flow">
              <ProcessTimeline steps={details.workflowSteps} />
            </SectionCard>
          )}

          {/* User flow & error handling fallback */}
          {(details.userFlow || details.errorHandlingFallback) && (
            <SectionCard title="Integration Mechanics &amp; Error Handling">
              <div className="space-y-4">
                {details.userFlow && (
                  <div>
                    <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-1">User Journey / Flow</h4>
                    <p className="text-sm text-charcoal">{details.userFlow}</p>
                  </div>
                )}
                {details.errorHandlingFallback && (
                  <div>
                    <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-1">Fallback &amp; Error Mechanics</h4>
                    <p className="text-sm text-charcoal whitespace-pre-wrap">{details.errorHandlingFallback}</p>
                  </div>
                )}
              </div>
            </SectionCard>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Snap metrics */}
          <InfoCard
            title="Automation Snaps"
            items={[
              { label: 'Automation Trigger', value: details.trigger },
              { label: 'Time Saved Estimations', value: details.timeSaved },
            ]}
          />

          {/* Tools integrations pill box */}
          {details.toolsIntegrations && (
            <div className="bg-white rounded-2xl border border-gray-light/60 p-6 shadow-sm">
              <ToolBadgeList tools={details.toolsIntegrations} title="Connected Tools" />
            </div>
          )}

          {project.tools_used && (
            <div className="bg-white rounded-2xl border border-gray-light/60 p-6 shadow-sm">
              <ToolBadgeList tools={project.tools_used} title="Infrastructure Tools" />
            </div>
          )}

          {/* Business Impact card */}
          {(project.results || details.outputResult || details.businessImpact) && (
            <div className="bg-blue-50/20 rounded-2xl border border-blue-100 p-6 space-y-4">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-blue-100/50 pb-2">
                Business Impact &amp; Output
              </h3>
              {details.timeSaved && (
                <div className="bg-white/80 p-3 rounded-xl border border-blue-100 flex items-center gap-3">
                  <span className="text-blue">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <div>
                    <span className="text-[9px] font-bold text-gray uppercase tracking-wider block">Time Saved</span>
                    <span className="text-sm font-extrabold text-navy">{details.timeSaved}</span>
                  </div>
                </div>
              )}
              {details.outputResult && (
                <div>
                  <span className="text-[10px] font-bold text-blue uppercase tracking-wider block">Output Result</span>
                  <p className="text-sm text-charcoal/90 mt-0.5 whitespace-pre-wrap">{details.outputResult}</p>
                </div>
              )}
              {details.businessImpact && (
                <div>
                  <span className="text-[10px] font-bold text-blue uppercase tracking-wider block">Systemic Impact</span>
                  <p className="text-sm text-charcoal/90 mt-0.5 whitespace-pre-wrap">{details.businessImpact}</p>
                </div>
              )}
              {project.results && (
                <div>
                  <span className="text-[10px] font-bold text-blue uppercase tracking-wider block">Result Metrics</span>
                  <p className="text-sm text-charcoal/90 mt-0.5 whitespace-pre-wrap">{project.results}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Gallery diagrams / workflow screens */}
      {galleryImages.length > 0 && (
        <section className="bg-white rounded-2xl border border-gray-light/60 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-navy border-b border-gray-light/40 pb-4 mb-5">
            n8n / Make / Zapier Diagrams &amp; Output Logs
          </h2>
          <ImageGallery images={galleryImages} />
        </section>
      )}

      {/* Full case study */}
      {project.full_case_study && (
        <SectionCard title="Full Automation Case Study">
          <p className="whitespace-pre-wrap text-charcoal leading-relaxed">{project.full_case_study}</p>
        </SectionCard>
      )}
    </div>
  )
}
