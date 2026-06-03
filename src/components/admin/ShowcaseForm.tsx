'use client'

import { useActionState } from 'react'
import type { ShowcaseItem } from '@/types'
import { showcaseCategories } from '@/lib/constants'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import Image from 'next/image'

interface ShowcaseFormProps {
  item?: ShowcaseItem
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (prevState: any, formData: FormData) => Promise<any>
}

export default function ShowcaseForm({ item, action }: ShowcaseFormProps) {
  const [state, formAction, isPending] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-8 max-w-4xl">
      {/* Error display */}
      {state?.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {state.error}
        </div>
      )}

      {/* Hidden field for existing cover image URL */}
      {item?.cover_image_url && (
        <input type="hidden" name="existing_cover_image_url" value={item.cover_image_url} />
      )}

      {/* Section: Basic Info */}
      <div className="bg-white rounded-2xl border border-gray-light/60 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-navy border-b border-gray-light/40 pb-3">
          Basic Information
        </h2>

        <Input
          id="title"
          name="title"
          label="Project Title *"
          placeholder="e.g., Brand Awareness Campaign for XYZ"
          defaultValue={item?.title || ''}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label htmlFor="category" className="block text-sm font-medium text-charcoal">
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue={item?.category || ''}
              className="block w-full rounded-lg border border-gray-light bg-white px-4 py-2.5 text-charcoal transition-colors duration-200 focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
            >
              <option value="">Select a category</option>
              {showcaseCategories.filter(c => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <Input
            id="project_type"
            name="project_type"
            label="Project Type"
            placeholder="e.g., Social Campaign, SEO Audit"
            defaultValue={item?.project_type || ''}
          />
        </div>

        <Textarea
          id="short_description"
          name="short_description"
          label="Short Description"
          placeholder="Brief overview of the project (shown on the card)"
          defaultValue={item?.short_description || ''}
          className="min-h-[80px]"
        />

        <Input
          id="my_role"
          name="my_role"
          label="My Role"
          placeholder="e.g., Lead Strategist, Content Manager"
          defaultValue={item?.my_role || ''}
        />
      </div>

      {/* Section: Media */}
      <div className="bg-white rounded-2xl border border-gray-light/60 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-navy border-b border-gray-light/40 pb-3">
          Media
        </h2>

        {/* Cover Image */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-charcoal">Cover Image</label>
          {item?.cover_image_url && (
            <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-gray-light mb-2">
              <Image
                src={item.cover_image_url}
                alt="Current cover"
                fill
                className="object-cover"
              />
              <span className="absolute bottom-1 right-1 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded">
                Current
              </span>
            </div>
          )}
          <input
            type="file"
            id="cover_image"
            name="cover_image"
            accept="image/*"
            className="block w-full text-sm text-gray file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue/10 file:text-blue hover:file:bg-blue/20 file:cursor-pointer cursor-pointer"
          />
          <p className="text-xs text-gray">Recommended: 1600×1000px, JPG or PNG</p>
        </div>

        <Input
          id="facebook_post_url"
          name="facebook_post_url"
          label="Facebook Post URL"
          type="url"
          placeholder="https://www.facebook.com/..."
          defaultValue={item?.facebook_post_url || ''}
        />
      </div>

      {/* Section: Content */}
      <div className="bg-white rounded-2xl border border-gray-light/60 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-navy border-b border-gray-light/40 pb-3">
          Content Details
        </h2>

        <Textarea
          id="content_writing_sample"
          name="content_writing_sample"
          label="Content Writing Sample"
          placeholder="Paste a sample of the content created for this project"
          defaultValue={item?.content_writing_sample || ''}
        />

        <Textarea
          id="media_buying_notes"
          name="media_buying_notes"
          label="Media Buying Notes"
          placeholder="Ad spend, targeting, platform details, and strategy notes"
          defaultValue={item?.media_buying_notes || ''}
        />

        <Textarea
          id="event_planning_notes"
          name="event_planning_notes"
          label="Event Planning Notes"
          placeholder="Event details, logistics, and planning notes"
          defaultValue={item?.event_planning_notes || ''}
        />
      </div>

      {/* Section: Results */}
      <div className="bg-white rounded-2xl border border-gray-light/60 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-navy border-b border-gray-light/40 pb-3">
          Results & Details
        </h2>

        <Textarea
          id="results"
          name="results"
          label="Results & Metrics"
          placeholder="Key results, KPIs, and measurable outcomes"
          defaultValue={item?.results || ''}
        />

        <Input
          id="tools_used"
          name="tools_used"
          label="Tools Used"
          placeholder="e.g., Meta Ads Manager, Google Analytics, ManyChat (comma separated)"
          defaultValue={item?.tools_used || ''}
        />

        <Textarea
          id="full_case_study"
          name="full_case_study"
          label="Full Case Study"
          placeholder="Detailed case study write-up with background, approach, and outcomes"
          defaultValue={item?.full_case_study || ''}
          className="min-h-[200px]"
        />
      </div>

      {/* Section: Status & Submit */}
      <div className="bg-white rounded-2xl border border-gray-light/60 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-navy border-b border-gray-light/40 pb-3">
          Publishing
        </h2>

        <div className="space-y-1.5">
          <label htmlFor="status" className="block text-sm font-medium text-charcoal">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={item?.status || 'draft'}
            className="block w-full rounded-lg border border-gray-light bg-white px-4 py-2.5 text-charcoal transition-colors duration-200 focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
          >
            <option value="draft">Draft — Not visible on public site</option>
            <option value="published">Published — Visible on public site</option>
          </select>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isPending} size="lg">
            {isPending
              ? 'Saving...'
              : item
              ? 'Update Project'
              : 'Create Project'}
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={() => window.history.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}
