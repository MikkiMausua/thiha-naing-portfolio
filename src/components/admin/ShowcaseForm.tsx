'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ShowcaseItem, GalleryImage } from '@/types'
import { showcaseCategories } from '@/lib/constants'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import Image from 'next/image'
import { deleteGalleryImage } from '@/app/admin/actions'
import { createClient as createBrowserClient } from '@/utils/supabase/client'

interface ShowcaseFormProps {
  item?: ShowcaseItem
  existingGallery?: GalleryImage[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (prevState: any, formData: FormData) => Promise<any>
}

export default function ShowcaseForm({ item, existingGallery = [], action }: ShowcaseFormProps) {
  const [state, formAction, isPending] = useActionState(action, null)
  const router = useRouter()
  const [clientError, setClientError] = useState<string | null>(null)
  
  // Client-side uploading status
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)

  const [localGallery, setLocalGallery] = useState<GalleryImage[]>(existingGallery)
  const [newGalleryFiles, setNewGalleryFiles] = useState<{ id: string; file: File; preview: string; caption: string }[]>([])
  
  // Category selection and warning states
  const [selectedCategory, setSelectedCategory] = useState(item?.category || '')
  const [showCategoryWarning, setShowCategoryWarning] = useState(false)

  // Category details JSON state
  const [detailsState, setDetailsState] = useState<Record<string, any>>(item?.category_details || {})

  // Controlled states for generic fallbacks
  const [resultsValue, setResultsValue] = useState(item?.results || '')
  const [caseStudyValue, setCaseStudyValue] = useState(item?.full_case_study || '')

  // Sync state if existingGallery changes
  useEffect(() => {
    setLocalGallery(existingGallery)
  }, [existingGallery])

  // Redirect on success
  useEffect(() => {
    if (state?.success) {
      router.push('/admin')
    }
  }, [state, router])

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextVal = e.target.value
    if (selectedCategory && nextVal !== selectedCategory) {
      setShowCategoryWarning(true)
      // Hide warning automatically after 5 seconds
      setTimeout(() => setShowCategoryWarning(false), 6000)
    }
    setSelectedCategory(nextVal)
  }

  const handleDetailFieldChange = (categoryKey: string, fieldName: string, value: string) => {
    setDetailsState(prev => ({
      ...prev,
      [categoryKey]: {
        ...(prev[categoryKey] || {}),
        [fieldName]: value
      }
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    
    const newItems = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      caption: ''
    }))

    setNewGalleryFiles(prev => [...prev, ...newItems])
  }

  const handleCaptionChange = (id: string, caption: string) => {
    setNewGalleryFiles(prev => prev.map(item => item.id === id ? { ...item, caption } : item))
  }

  const handleRemoveNewImage = (id: string) => {
    setNewGalleryFiles(prev => {
      const target = prev.find(item => item.id === id)
      if (target) URL.revokeObjectURL(target.preview)
      return prev.filter(item => item.id !== id)
    })
  }

  const handleDeleteExistingImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this gallery image?')) return
    const result = await deleteGalleryImage(imageId)
    if (result.success) {
      setLocalGallery(prev => prev.filter(img => img.id !== imageId))
    } else {
      setClientError('Failed to delete gallery image: ' + result.error)
    }
  }

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      newGalleryFiles.forEach(item => URL.revokeObjectURL(item.preview))
    }
  }, [newGalleryFiles])

  // Direct client-side upload to Supabase to bypass Vercel serverless request limits
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setClientError(null)
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const supabase = createBrowserClient()

    try {
      // 1. Upload Cover Image (if a new file is chosen)
      let cover_image_url = item?.cover_image_url || ''
      const coverFile = formData.get('cover_image') as File
      if (coverFile && coverFile.size > 0) {
        if (coverFile.size > 4 * 1024 * 1024) {
          setClientError('Cover image must be under 4MB.')
          setIsSubmitting(false)
          return
        }
        setUploadProgress('Uploading cover image...')
        const fileExt = coverFile.name.split('.').pop()
        const filePath = `cover-${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('showcase-images')
          .upload(filePath, coverFile, { cacheControl: '3600', upsert: false })

        if (uploadError) {
          setClientError(`Cover image upload failed: ${uploadError.message}`)
          setIsSubmitting(false)
          return
        }

        const { data: { publicUrl } } = supabase.storage
          .from('showcase-images')
          .getPublicUrl(filePath)

        cover_image_url = publicUrl
      }

      // 2. Upload New Gallery Images
      const uploadedGalleryItems: { image_url: string; caption: string | null }[] = []
      
      for (let i = 0; i < newGalleryFiles.length; i++) {
        const galleryItem = newGalleryFiles[i]
        if (galleryItem.file.size > 4 * 1024 * 1024) {
          setClientError(`Gallery image "${galleryItem.file.name}" exceeds the 4MB limit.`)
          setIsSubmitting(false)
          return
        }
        
        setUploadProgress(`Uploading gallery image ${i + 1} of ${newGalleryFiles.length}...`)
        
        const fileExt = galleryItem.file.name.split('.').pop()
        const filePath = `gallery/${Date.now()}-${i}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('showcase-images')
          .upload(filePath, galleryItem.file, { cacheControl: '3600', upsert: false })

        if (uploadError) {
          setClientError(`Gallery image upload failed: ${uploadError.message}`)
          setIsSubmitting(false)
          return
        }

        const { data: { publicUrl } } = supabase.storage
          .from('showcase-images')
          .getPublicUrl(filePath)

        uploadedGalleryItems.push({
          image_url: publicUrl,
          caption: galleryItem.caption || null
        })
      }

      setUploadProgress('Saving project details...')
      
      // Setup payload values
      formData.set('cover_image_url', cover_image_url)
      formData.set('category_json', JSON.stringify(detailsState))
      
      // Delete large binaries from being submitted to the Server Action
      formData.delete('cover_image')
      formData.delete('gallery_images')
      
      formData.set('gallery_json', JSON.stringify(uploadedGalleryItems))

      // Trigger the server action
      formAction(formData)
    } catch (err) {
      setClientError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsSubmitting(false)
      setUploadProgress(null)
    }
  }

  // Determine category key for nested JSON details
  const getCategoryKey = (cat: string) => {
    const c = cat.toLowerCase().trim()
    if (c.includes('writing') || c.includes('content')) return 'contentWriting'
    if (c.includes('buying') || c.includes('media') || c.includes('ad')) return 'mediaBuying'
    if (c.includes('event') || c.includes('planning')) return 'eventPlanning'
    if (c.includes('social') || c.includes('media')) return 'socialMedia'
    if (c.includes('auto') || c.includes('automation') || c.includes('workflow')) return 'automation'
    return null
  }

  const categoryKey = getCategoryKey(selectedCategory)
  const categoryDetails = categoryKey ? (detailsState[categoryKey] || {}) : {}

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Error display */}
      {(state?.error || clientError) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {clientError || state?.error}
        </div>
      )}

      {/* Category Change Warning */}
      {showCategoryWarning && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
          ⚠️ <strong>Notice:</strong> Switching category will change the layout structure and hide some category-specific fields. Already entered data will be preserved, but will only render in the selected category's layout.
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
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              required
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

      {/* Section: Dynamic Category Specific Details */}
      {categoryKey === 'contentWriting' && (
        <div className="bg-white rounded-2xl border border-gray-light/60 p-6 space-y-5">
          <div className="border-b border-gray-light/40 pb-3">
            <h2 className="text-lg font-semibold text-navy">Content Writing Fields</h2>
            <p className="text-xs text-gray mt-0.5">Custom configurations for copywriting, articles, brand storytelling, and email copy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-charcoal">Content Type</label>
              <select
                value={categoryDetails.contentType || ''}
                onChange={(e) => handleDetailFieldChange('contentWriting', 'contentType', e.target.value)}
                className="block w-full rounded-lg border border-gray-light bg-white px-4 py-2.5 text-charcoal focus:border-blue focus:outline-none"
              >
                <option value="">Select Content Type</option>
                <option value="Article">Article</option>
                <option value="Social Caption">Social Caption</option>
                <option value="Campaign Copy">Campaign Copy</option>
                <option value="Email">Email</option>
                <option value="Script">Script</option>
                <option value="SEO Content">SEO Content</option>
                <option value="Brand Story">Brand Story</option>
              </select>
            </div>
            <Input
              label="Client / Brand Type"
              placeholder="e.g., E-commerce startup, Tech company"
              value={categoryDetails.clientBrandType || ''}
              onChange={(e) => handleDetailFieldChange('contentWriting', 'clientBrandType', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Target Audience"
              placeholder="e.g., Gen-Z, B2B executives"
              value={categoryDetails.targetAudience || ''}
              onChange={(e) => handleDetailFieldChange('contentWriting', 'targetAudience', e.target.value)}
            />
            <Input
              label="Tone of Voice"
              placeholder="e.g., Conversational, professional, educational"
              value={categoryDetails.toneOfVoice || ''}
              onChange={(e) => handleDetailFieldChange('contentWriting', 'toneOfVoice', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Content Goal"
              placeholder="e.g., Drive conversions, improve domain authority"
              value={categoryDetails.contentGoal || ''}
              onChange={(e) => handleDetailFieldChange('contentWriting', 'contentGoal', e.target.value)}
            />
            <Input
              label="Distribution Channel"
              placeholder="e.g., Website blog, newsletter list, FB page"
              value={categoryDetails.distributionChannel || ''}
              onChange={(e) => handleDetailFieldChange('contentWriting', 'distributionChannel', e.target.value)}
            />
          </div>

          <Input
            label="Key Message"
            placeholder="What was the main core message/hook of the content?"
            value={categoryDetails.keyMessage || ''}
            onChange={(e) => handleDetailFieldChange('contentWriting', 'keyMessage', e.target.value)}
          />

          <Textarea
            label="Writing Samples / Copy Content"
            placeholder="Paste your writing sample, article intro, script, or campaign copy here..."
            value={categoryDetails.writingSamples || ''}
            onChange={(e) => handleDetailFieldChange('contentWriting', 'writingSamples', e.target.value)}
            className="min-h-[160px]"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Textarea
              label="Before Copy (If applicable)"
              placeholder="Original headline/text before editing"
              value={categoryDetails.beforeCopy || ''}
              onChange={(e) => handleDetailFieldChange('contentWriting', 'beforeCopy', e.target.value)}
              className="min-h-[100px]"
            />
            <Textarea
              label="After Copy (If applicable)"
              placeholder="Your revised headline/text version"
              value={categoryDetails.afterCopy || ''}
              onChange={(e) => handleDetailFieldChange('contentWriting', 'afterCopy', e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Performance Metrics (If available)"
              placeholder="e.g., 45% open rate, ranked #1 for keyword"
              value={categoryDetails.performanceMetrics || ''}
              onChange={(e) => handleDetailFieldChange('contentWriting', 'performanceMetrics', e.target.value)}
            />
            <Input
              label="CTA Outcome"
              placeholder="e.g., Led to 500+ signups, 20% sales uplift"
              value={categoryDetails.ctaOutcome || ''}
              onChange={(e) => handleDetailFieldChange('contentWriting', 'ctaOutcome', e.target.value)}
            />
          </div>
        </div>
      )}

      {categoryKey === 'mediaBuying' && (
        <div className="bg-white rounded-2xl border border-gray-light/60 p-6 space-y-5">
          <div className="border-b border-gray-light/40 pb-3">
            <h2 className="text-lg font-semibold text-navy">Media Buying Fields</h2>
            <p className="text-xs text-gray mt-0.5">Track ad spends, CPMs, CTRs, optimization strategies, and campaign dashboards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Input
              label="Ad Platform"
              placeholder="e.g., Meta Ads, Google Ads"
              value={categoryDetails.platform || ''}
              onChange={(e) => handleDetailFieldChange('mediaBuying', 'platform', e.target.value)}
            />
            <Input
              label="Campaign Objective"
              placeholder="e.g., Sales Conversions, Leads"
              value={categoryDetails.campaignObjective || ''}
              onChange={(e) => handleDetailFieldChange('mediaBuying', 'campaignObjective', e.target.value)}
            />
            <Input
              label="Date Range"
              placeholder="e.g., Jan 2026 - Mar 2026"
              value={categoryDetails.dateRange || ''}
              onChange={(e) => handleDetailFieldChange('mediaBuying', 'dateRange', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label="Total Spend"
              placeholder="e.g., $15,000"
              value={categoryDetails.totalSpend || ''}
              onChange={(e) => handleDetailFieldChange('mediaBuying', 'totalSpend', e.target.value)}
            />
            <Input
              label="Impressions"
              placeholder="e.g., 2.4 Million"
              value={categoryDetails.impressions || ''}
              onChange={(e) => handleDetailFieldChange('mediaBuying', 'impressions', e.target.value)}
            />
            <Input
              label="Reach"
              placeholder="e.g., 1.8 Million"
              value={categoryDetails.reach || ''}
              onChange={(e) => handleDetailFieldChange('mediaBuying', 'reach', e.target.value)}
            />
            <Input
              label="Clicks"
              placeholder="e.g., 45,000"
              value={categoryDetails.clicks || ''}
              onChange={(e) => handleDetailFieldChange('mediaBuying', 'clicks', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label="CTR (%)"
              placeholder="e.g., 2.34%"
              value={categoryDetails.ctr || ''}
              onChange={(e) => handleDetailFieldChange('mediaBuying', 'ctr', e.target.value)}
            />
            <Input
              label="CPM"
              placeholder="e.g., $6.25"
              value={categoryDetails.cpm || ''}
              onChange={(e) => handleDetailFieldChange('mediaBuying', 'cpm', e.target.value)}
            />
            <Input
              label="CPC"
              placeholder="e.g., $0.33"
              value={categoryDetails.cpc || ''}
              onChange={(e) => handleDetailFieldChange('mediaBuying', 'cpc', e.target.value)}
            />
            <Input
              label="ROAS (Leave empty if unverified)"
              placeholder="e.g., 3.8x"
              value={categoryDetails.roas || ''}
              onChange={(e) => handleDetailFieldChange('mediaBuying', 'roas', e.target.value)}
            />
          </div>

          <Input
            label="Conversions (Leads / Messages / Purchases)"
            placeholder="e.g., 1,200 Purchases, 3,400 leads"
            value={categoryDetails.leadsMessagesPurchases || ''}
            onChange={(e) => handleDetailFieldChange('mediaBuying', 'leadsMessagesPurchases', e.target.value)}
          />

          <Textarea
            label="Audience &amp; Targeting Strategy"
            placeholder="Describe your target audiences, lookalikes, interests, retargeting setup..."
            value={categoryDetails.audienceStrategy || ''}
            onChange={(e) => handleDetailFieldChange('mediaBuying', 'audienceStrategy', e.target.value)}
          />

          <Textarea
            label="Creative Strategy"
            placeholder="Describe creative direction, hooks, best-performing visuals/videos..."
            value={categoryDetails.creativeStrategy || ''}
            onChange={(e) => handleDetailFieldChange('mediaBuying', 'creativeStrategy', e.target.value)}
          />

          <Textarea
            label="Optimization Approach"
            placeholder="Detail custom optimizations: scaling, budget optimization (CBO/ABO), bid tactics..."
            value={categoryDetails.optimizationApproach || ''}
            onChange={(e) => handleDetailFieldChange('mediaBuying', 'optimizationApproach', e.target.value)}
          />

          <Textarea
            label="Reporting Notes / Analysis"
            placeholder="Insights from reporting, customer journey analyses..."
            value={categoryDetails.reportingNotes || ''}
            onChange={(e) => handleDetailFieldChange('mediaBuying', 'reportingNotes', e.target.value)}
          />
        </div>
      )}

      {categoryKey === 'eventPlanning' && (
        <div className="bg-white rounded-2xl border border-gray-light/60 p-6 space-y-5">
          <div className="border-b border-gray-light/40 pb-3">
            <h2 className="text-lg font-semibold text-navy">Event Planning Fields</h2>
            <p className="text-xs text-gray mt-0.5">Recap event timelines, attendee count statistics, venues, and team responsibilities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Event Name"
              placeholder="e.g., Tech Startup Conference 2026"
              value={categoryDetails.eventName || ''}
              onChange={(e) => handleDetailFieldChange('eventPlanning', 'eventName', e.target.value)}
            />
            <Input
              label="Event Type"
              placeholder="e.g., Corporate Conference, Concert, Webinar"
              value={categoryDetails.eventType || ''}
              onChange={(e) => handleDetailFieldChange('eventPlanning', 'eventType', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Input
              label="Event Date"
              placeholder="e.g., March 15, 2026"
              value={categoryDetails.eventDate || ''}
              onChange={(e) => handleDetailFieldChange('eventPlanning', 'eventDate', e.target.value)}
            />
            <Input
              label="Venue Location"
              placeholder="e.g., Lotte Hotel Hall, Yangon"
              value={categoryDetails.venue || ''}
              onChange={(e) => handleDetailFieldChange('eventPlanning', 'venue', e.target.value)}
            />
            <Input
              label="Attendee Count"
              placeholder="e.g., 500+ Attendees"
              value={categoryDetails.attendeeCount || ''}
              onChange={(e) => handleDetailFieldChange('eventPlanning', 'attendeeCount', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Organizer / Sponsor Brand"
              placeholder="e.g., Myanmar Tech Association"
              value={categoryDetails.organizerBrand || ''}
              onChange={(e) => handleDetailFieldChange('eventPlanning', 'organizerBrand', e.target.value)}
            />
            <Input
              label="Vendors &amp; Partners"
              placeholder="e.g., JCGV Catering, Lighting Partners"
              value={categoryDetails.vendorsPartners || ''}
              onChange={(e) => handleDetailFieldChange('eventPlanning', 'vendorsPartners', e.target.value)}
            />
          </div>

          <Textarea
            label="My Responsibilities (One per line)"
            placeholder="Manage catering contracts&#10;Coordinate lighting crew&#10;Design venue floor plan..."
            value={categoryDetails.myResponsibilities || ''}
            onChange={(e) => handleDetailFieldChange('eventPlanning', 'myResponsibilities', e.target.value)}
            className="min-h-[100px]"
          />

          <Textarea
            label="Event Objective"
            placeholder="What was the main purpose of organizing the event?"
            value={categoryDetails.eventObjective || ''}
            onChange={(e) => handleDetailFieldChange('eventPlanning', 'eventObjective', e.target.value)}
          />

          <Textarea
            label="Planning Scope"
            placeholder="Details about budgeting, scheduling, marketing plan, resource allocations..."
            value={categoryDetails.planningScope || ''}
            onChange={(e) => handleDetailFieldChange('eventPlanning', 'planningScope', e.target.value)}
          />

          <Textarea
            label="Run of Show Timeline (Format: Time - Details, one per line)"
            placeholder="08:00 AM - Registrations open&#10;09:00 AM - Keynote speaker start&#10;12:00 PM - Buffet Lunch networking..."
            value={categoryDetails.timelineRunOfShow || ''}
            onChange={(e) => handleDetailFieldChange('eventPlanning', 'timelineRunOfShow', e.target.value)}
            className="min-h-[140px]"
          />

          <Textarea
            label="Key Deliverables"
            placeholder="What were the core assets, program flow sheets, invitation cards designed?"
            value={categoryDetails.deliverables || ''}
            onChange={(e) => handleDetailFieldChange('eventPlanning', 'deliverables', e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Textarea
              label="Event Outcome"
              placeholder="Client feedback, visitor satisfaction, qualitative review..."
              value={categoryDetails.eventOutcome || ''}
              onChange={(e) => handleDetailFieldChange('eventPlanning', 'eventOutcome', e.target.value)}
              className="min-h-[100px]"
            />
            <Textarea
              label="Challenges Solved"
              placeholder="What logical or unexpected problems arose and how did you solve them?"
              value={categoryDetails.challengesSolved || ''}
              onChange={(e) => handleDetailFieldChange('eventPlanning', 'challengesSolved', e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
      )}

      {categoryKey === 'socialMedia' && (
        <div className="bg-white rounded-2xl border border-gray-light/60 p-6 space-y-5">
          <div className="border-b border-gray-light/40 pb-3">
            <h2 className="text-lg font-semibold text-navy">Social Media Fields</h2>
            <p className="text-xs text-gray mt-0.5">Capture page management metrics, content pillars, publishing calendar notes, and engagement.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Platform Channel"
              placeholder="e.g., Facebook Page, Instagram, LinkedIn"
              value={categoryDetails.platform || ''}
              onChange={(e) => handleDetailFieldChange('socialMedia', 'platform', e.target.value)}
            />
            <Input
              label="Campaign / Page Type"
              placeholder="e.g., Business page growth, product launch campaign"
              value={categoryDetails.campaignPageType || ''}
              onChange={(e) => handleDetailFieldChange('socialMedia', 'campaignPageType', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Input
              label="Posting Frequency"
              placeholder="e.g., 3 posts per week"
              value={categoryDetails.postingFrequency || ''}
              onChange={(e) => handleDetailFieldChange('socialMedia', 'postingFrequency', e.target.value)}
            />
            <Input
              label="Content Formats"
              placeholder="e.g., Reels, Carousels, Short videos"
              value={categoryDetails.contentFormats || ''}
              onChange={(e) => handleDetailFieldChange('socialMedia', 'contentFormats', e.target.value)}
            />
            <Input
              label="Brand Voice"
              placeholder="e.g., Humorous, authoritative, friendly"
              value={categoryDetails.brandVoice || ''}
              onChange={(e) => handleDetailFieldChange('socialMedia', 'brandVoice', e.target.value)}
            />
          </div>

          <Textarea
            label="Content Pillars (Format: Pillar Name - Description, one per line)"
            placeholder="Educational - Tips on growth marketing&#10;Behind-the-scenes - Showcase team culture&#10;Promotional - Feature service package discounts..."
            value={categoryDetails.contentPillars || ''}
            onChange={(e) => handleDetailFieldChange('socialMedia', 'contentPillars', e.target.value)}
            className="min-h-[120px]"
          />

          <Textarea
            label="Creative Direction"
            placeholder="Details about graphic designs, color palettes, video editing styles..."
            value={categoryDetails.creativeDirection || ''}
            onChange={(e) => handleDetailFieldChange('socialMedia', 'creativeDirection', e.target.value)}
          />

          <Textarea
            label="Caption Strategy"
            placeholder="Hook strategies, call-to-actions, hashtag structures..."
            value={categoryDetails.captionStrategy || ''}
            onChange={(e) => handleDetailFieldChange('socialMedia', 'captionStrategy', e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Textarea
              label="Community Management Notes"
              placeholder="Comment replies, DM auto-responses, engagement tactics..."
              value={categoryDetails.communityManagementNotes || ''}
              onChange={(e) => handleDetailFieldChange('socialMedia', 'communityManagementNotes', e.target.value)}
              className="min-h-[100px]"
            />
            <Textarea
              label="Monthly Plan / Calendar Strategy"
              placeholder="Scheduling workflow, content approval processes..."
              value={categoryDetails.monthlyPlanCalendar || ''}
              onChange={(e) => handleDetailFieldChange('socialMedia', 'monthlyPlanCalendar', e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Textarea
            label="Engagement Metrics Overview"
            placeholder="e.g., +25% follower growth, average 5% engagement rate"
            value={categoryDetails.engagementMetrics || ''}
            onChange={(e) => handleDetailFieldChange('socialMedia', 'engagementMetrics', e.target.value)}
            className="min-h-[80px]"
          />

          <Textarea
            label="Top Performing Posts Details"
            placeholder="Highlight 2-3 posts that went viral or got highest reach, with links/copy..."
            value={categoryDetails.bestPerformingPosts || ''}
            onChange={(e) => handleDetailFieldChange('socialMedia', 'bestPerformingPosts', e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      )}

      {categoryKey === 'automation' && (
        <div className="bg-white rounded-2xl border border-gray-light/60 p-6 space-y-5">
          <div className="border-b border-gray-light/40 pb-3">
            <h2 className="text-lg font-semibold text-navy">Automation Fields</h2>
            <p className="text-xs text-gray mt-0.5">Map Zapier/Make connections, trigger-action workflow steps, and business time-saved metrics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Input
              label="Automation Trigger"
              placeholder="e.g., Customer purchases on Shopify"
              value={categoryDetails.trigger || ''}
              onChange={(e) => handleDetailFieldChange('automation', 'trigger', e.target.value)}
            />
            <Input
              label="Connected Tools / Integrations"
              placeholder="e.g., ManyChat, Google Sheets, Make (comma separated)"
              value={categoryDetails.toolsIntegrations || ''}
              onChange={(e) => handleDetailFieldChange('automation', 'toolsIntegrations', e.target.value)}
            />
            <Input
              label="Time Saved Estimation"
              placeholder="e.g., 10 hours per week"
              value={categoryDetails.timeSaved || ''}
              onChange={(e) => handleDetailFieldChange('automation', 'timeSaved', e.target.value)}
            />
          </div>

          <Textarea
            label="Business Problem"
            placeholder="What manual workflow needed to be automated? What was the bottleneck?"
            value={categoryDetails.businessProblem || ''}
            onChange={(e) => handleDetailFieldChange('automation', 'businessProblem', e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Textarea
              label="Manual Workflow Before Automation"
              placeholder="Steps employees had to perform manually..."
              value={categoryDetails.manualWorkflowBefore || ''}
              onChange={(e) => handleDetailFieldChange('automation', 'manualWorkflowBefore', e.target.value)}
              className="min-h-[100px]"
            />
            <Textarea
              label="Automation Architecture Goal"
              placeholder="What was the targeted automated flow architecture?"
              value={categoryDetails.automationGoal || ''}
              onChange={(e) => handleDetailFieldChange('automation', 'automationGoal', e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Textarea
            label="Workflow Steps (Format: Step Name - Details, one per line)"
            placeholder="Step 1 - Receive webhook from Shopify&#10;Step 2 - Filter purchases by category&#10;Step 3 - Add email to ActiveCampaign list&#10;Step 4 - Send coupon code in Telegram chat..."
            value={categoryDetails.workflowSteps || ''}
            onChange={(e) => handleDetailFieldChange('automation', 'workflowSteps', e.target.value)}
            className="min-h-[140px]"
          />

          <Textarea
            label="System Output / Output Result"
            placeholder="Describe the final output, automated messages sent, or sheets created..."
            value={categoryDetails.outputResult || ''}
            onChange={(e) => handleDetailFieldChange('automation', 'outputResult', e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Textarea
              label="User Flow Context"
              placeholder="How does the customer interface with this automation?"
              value={categoryDetails.userFlow || ''}
              onChange={(e) => handleDetailFieldChange('automation', 'userFlow', e.target.value)}
              className="min-h-[100px]"
            />
            <Textarea
              label="Error Handling &amp; Fallback Mechanisms"
              placeholder="What happens if an API call fails? Email alerts, slack notifications, retries..."
              value={categoryDetails.errorHandlingFallback || ''}
              onChange={(e) => handleDetailFieldChange('automation', 'errorHandlingFallback', e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Textarea
            label="Business Impact Summary"
            placeholder="Reduced manual errors by 100%, increased lead speed times..."
            value={categoryDetails.businessImpact || ''}
            onChange={(e) => handleDetailFieldChange('automation', 'businessImpact', e.target.value)}
          />
        </div>
      )}

      {/* Section: Media */}
      <div className="bg-white rounded-2xl border border-gray-light/60 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-navy border-b border-gray-light/40 pb-3">
          Media
        </h2>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-charcoal">Cover Image</label>
          {item?.cover_image_url && (
            <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-gray-light mb-2">
              <Image src={item.cover_image_url} alt="Current cover" fill className="object-cover" />
              <span className="absolute bottom-1 right-1 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded">Current</span>
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

      {/* Section: Project Gallery */}
      <div className="bg-white rounded-2xl border border-gray-light/60 p-6 space-y-5">
        <div className="border-b border-gray-light/40 pb-3 md:flex justify-between items-center gap-4">
          <h2 className="text-lg font-semibold text-navy">
            Project Gallery
          </h2>
          {categoryKey && (
            <span className="text-[10px] font-bold text-blue uppercase tracking-wider bg-blue/10 px-2 py-0.5 rounded">
              Suggested Image Types Available
            </span>
          )}
        </div>

        {/* Suggested Image types uploader guidance card */}
        {categoryKey === 'contentWriting' && (
          <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl text-purple-700 text-xs">
            💡 <strong>Suggested visuals for Content Writing:</strong> Post/article screenshots, client content calendar overview, before/after copy comparisons, distribution analytics dashboard.
          </div>
        )}
        {categoryKey === 'mediaBuying' && (
          <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-blue-700 text-xs">
            💡 <strong>Suggested visuals for Media Buying:</strong> Ads Manager dashboard screens (blur sensitive client info), visual performance reports, top ad creative grids, conversion graphs.
          </div>
        )}
        {categoryKey === 'eventPlanning' && (
          <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-amber-700 text-xs">
            💡 <strong>Suggested visuals for Event Planning:</strong> Event cover photo, venue details, behind-the-scenes layout sheets, print invitation cards, social coverage recaps, crowd group photos.
          </div>
        )}
        {categoryKey === 'socialMedia' && (
          <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl text-rose-700 text-xs">
            💡 <strong>Suggested visuals for Social Media:</strong> Feed designs, grid overview layouts, content calendar sheet, DM comment templates, profile screenshots, engagement reports.
          </div>
        )}
        {categoryKey === 'automation' && (
          <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-emerald-700 text-xs">
            💡 <strong>Suggested visuals for Automation:</strong> n8n/Make node diagram screenshot, before vs after flowchart, tools integration icons grid, system output logs.
          </div>
        )}

        {/* Existing Images */}
        {localGallery.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-charcoal">Existing Gallery Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {localGallery.map((img) => (
                <div key={img.id} className="relative group rounded-lg overflow-hidden border border-gray-light aspect-video bg-gray-50 flex flex-col justify-between">
                  <div className="relative w-full flex-grow">
                    <Image src={img.image_url} alt="Gallery image" fill className="object-cover" />
                  </div>
                  {img.caption && (
                    <div className="p-1.5 text-xs text-charcoal bg-white truncate border-t border-gray-light">
                      {img.caption}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteExistingImage(img.id)}
                    className="absolute top-1 right-1 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow transition-colors cursor-pointer"
                    title="Delete Image"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload New Images */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-charcoal">Upload New Gallery Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue/10 file:text-blue hover:file:bg-blue/20 file:cursor-pointer cursor-pointer"
          />
          <p className="text-xs text-gray">Upload multiple images (under 4MB each).</p>

          {/* New Images Previews & Captions */}
          {newGalleryFiles.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-medium text-charcoal">New Images to Upload</h3>
              <div className="space-y-3">
                {newGalleryFiles.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border border-gray-light/60 rounded-xl bg-bg items-center">
                    <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-gray-light flex-shrink-0">
                      <Image src={item.preview} alt="New preview" fill className="object-cover" />
                    </div>
                    <div className="flex-grow">
                      <Input
                        placeholder="Image caption (optional)"
                        value={item.caption}
                        onChange={(e) => handleCaptionChange(item.id, e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section: Common Case Study and Results Fields for Fallback/Details */}
      <div className="bg-white rounded-2xl border border-gray-light/60 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-navy border-b border-gray-light/40 pb-3">
          Results &amp; Full Case Study (Generic Fallbacks)
        </h2>
        <Textarea 
          id="results" 
          name="results" 
          label="Results &amp; Metrics Summary" 
          placeholder="Summary metrics (used as fallback or additional info in templates)" 
          value={resultsValue}
          onChange={(e) => setResultsValue(e.target.value)}
        />
        <Input id="tools_used" name="tools_used" label="Tools Used" placeholder="e.g., Meta Ads Manager, Google Analytics, ManyChat (comma separated)" defaultValue={item?.tools_used || ''} />
        <Textarea 
          id="full_case_study" 
          name="full_case_study" 
          label="Full Case Study Overview" 
          placeholder="Detailed narrative write-up if layout template requires or as fallback" 
          value={caseStudyValue}
          onChange={(e) => setCaseStudyValue(e.target.value)}
          className="min-h-[160px]" 
        />
      </div>

      {/* Section: Status & Submit */}
      <div className="bg-white rounded-2xl border border-gray-light/60 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-navy border-b border-gray-light/40 pb-3">
          Publishing
        </h2>

        <div className="space-y-1.5">
          <label htmlFor="status" className="block text-sm font-medium text-charcoal">Status</label>
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

        {/* Hidden field for category details JSON */}
        <input type="hidden" name="category_json" value={JSON.stringify(detailsState)} />

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isPending || isSubmitting} size="lg">
            {isPending || isSubmitting
              ? uploadProgress || 'Saving...'
              : item ? 'Update Project' : 'Create Project'}
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={() => window.history.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}
