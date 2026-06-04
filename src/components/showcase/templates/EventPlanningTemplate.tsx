import React from 'react'
import type { ShowcaseItem, GalleryImage } from '@/types'
import CategoryBadge from '../components/CategoryBadge'
import InfoCard from '../components/InfoCard'
import SectionCard from '../components/SectionCard'
import ToolBadgeList from '../components/ToolBadgeList'
import ProcessTimeline from '../components/ProcessTimeline'
import ImageGallery from '../ImageGallery'

interface EventPlanningTemplateProps {
  project: ShowcaseItem
  galleryImages: GalleryImage[]
}

export default function EventPlanningTemplate({ project, galleryImages }: EventPlanningTemplateProps) {
  const details = project.category_details?.eventPlanning || {}

  // Parse responsibilities as list if comma/newline separated
  const responsibilitiesList = details.myResponsibilities
    ? details.myResponsibilities.split('\n').map((r: string) => r.trim()).filter(Boolean)
    : []

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* Event Title Hero Card */}
      <header className="bg-white rounded-3xl border border-gray-light/60 p-8 shadow-sm text-center md:text-left md:flex justify-between items-center gap-6">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
            <CategoryBadge category={project.category} />
            {details.eventType && (
              <span className="text-xs font-semibold text-blue bg-blue/10 border border-blue/20 px-2.5 py-0.5 rounded-full">
                {details.eventType}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-navy leading-tight">
            {details.eventName || project.title}
          </h1>
          {project.project_type && (
            <p className="text-sm font-medium text-gray mt-2">{project.project_type}</p>
          )}
        </div>
        {project.my_role && (
          <div className="mt-4 md:mt-0 flex-shrink-0 bg-bg px-6 py-4 rounded-2xl border border-gray-light/40 text-center md:text-right">
            <span className="text-[10px] font-semibold text-gray uppercase tracking-wider block">
              Organizer Role
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
            <SectionCard title="Event Overview">
              <p className="text-charcoal leading-relaxed text-base">{project.short_description}</p>
            </SectionCard>
          )}

          {/* Planning Scope & Objective */}
          {(details.eventObjective || details.planningScope || details.deliverables) && (
            <SectionCard title="Planning Scope &amp; Deliverables">
              <div className="space-y-5">
                {details.eventObjective && (
                  <div>
                    <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-1.5">Event Objective</h4>
                    <p className="text-sm text-charcoal">{details.eventObjective}</p>
                  </div>
                )}
                {details.planningScope && (
                  <div>
                    <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-1.5">Event Planning Scope</h4>
                    <p className="text-sm text-charcoal whitespace-pre-wrap">{details.planningScope}</p>
                  </div>
                )}
                {details.deliverables && (
                  <div>
                    <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-1.5">Key Deliverables</h4>
                    <p className="text-sm text-charcoal whitespace-pre-wrap">{details.deliverables}</p>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* Timeline / Run of Show */}
          {details.timelineRunOfShow && (
            <SectionCard title="Event Run of Show / Timeline">
              <ProcessTimeline steps={details.timelineRunOfShow} />
            </SectionCard>
          )}

          {/* Challenges Solved */}
          {details.challengesSolved && (
            <SectionCard title="Event Logistics &amp; Challenges Solved">
              <p className="text-sm text-charcoal whitespace-pre-wrap">{details.challengesSolved}</p>
            </SectionCard>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <InfoCard
            title="Event Snaps"
            items={[
              { label: 'Event Name', value: details.eventName },
              { label: 'Event Date', value: details.eventDate },
              { label: 'Venue Location', value: details.venue },
              { label: 'Attendee Count', value: details.attendeeCount },
              { label: 'Organizer Brand', value: details.organizerBrand },
              { label: 'Vendors / Partners', value: details.vendorsPartners },
            ]}
          />

          {/* Responsibilities list card */}
          {responsibilitiesList.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-light/60 p-6 shadow-sm">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-gray-light/40 pb-2 mb-4">
                My Responsibilities
              </h3>
              <ul className="space-y-2">
                {responsibilitiesList.map((item: string, idx: number) => (
                  <li key={idx} className="text-xs text-charcoal flex gap-2.5 items-start">
                    <span className="text-blue flex-shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.tools_used && (
            <div className="bg-white rounded-2xl border border-gray-light/60 p-6 shadow-sm">
              <ToolBadgeList tools={project.tools_used} title="Planning Tools" />
            </div>
          )}

          {/* Event Outcomes */}
          {(project.results || details.eventOutcome) && (
            <div className="bg-blue-50/20 rounded-2xl border border-blue-100 p-6 space-y-4">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-blue-100/50 pb-2">
                Event Outcome
              </h3>
              {details.eventOutcome && (
                <div>
                  <span className="text-[10px] font-bold text-blue uppercase tracking-wider block">Qualitative Outcome</span>
                  <p className="text-sm text-charcoal/90 mt-0.5 whitespace-pre-wrap">{details.eventOutcome}</p>
                </div>
              )}
              {project.results && (
                <div>
                  <span className="text-[10px] font-bold text-blue uppercase tracking-wider block">Metrics Results</span>
                  <p className="text-sm text-charcoal/90 mt-0.5 whitespace-pre-wrap">{project.results}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Gallery photos */}
      {galleryImages.length > 0 && (
        <section className="bg-white rounded-2xl border border-gray-light/60 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-navy border-b border-gray-light/40 pb-4 mb-5">
            Event Recap Photos &amp; Program Designs
          </h2>
          <ImageGallery images={galleryImages} />
        </section>
      )}

      {/* Full case study */}
      {project.full_case_study && (
        <SectionCard title="Full Event Planning Case Study">
          <p className="whitespace-pre-wrap text-charcoal leading-relaxed">{project.full_case_study}</p>
        </SectionCard>
      )}
    </div>
  )
}
