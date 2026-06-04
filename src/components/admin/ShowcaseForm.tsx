'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ShowcaseItem, GalleryImage } from '@/types'
import { showcaseCategories, layoutFormats } from '@/lib/constants'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import Image from 'next/image'
import { deleteGalleryImage } from '@/app/admin/actions'

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

  const [localGallery, setLocalGallery] = useState<GalleryImage[]>(existingGallery)
  const [newGalleryFiles, setNewGalleryFiles] = useState<{ id: string; file: File; preview: string; caption: string }[]>([])
  const [selectedLayout, setSelectedLayout] = useState<'standard' | 'gallery' | 'case-study' | 'minimal'>(item?.layout_format || 'standard')

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

  // Wrap formAction to validate file size before submitting
  const handleSubmit = (formData: FormData) => {
    setClientError(null)
    
    // Validate cover image size
    const coverFile = formData.get('cover_image') as File
    if (coverFile && coverFile.size > 4 * 1024 * 1024) {
      setClientError('Cover image must be under 4MB. Please compress or resize the image before uploading.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Validate new gallery images size
    for (const item of newGalleryFiles) {
      if (item.file.size > 4 * 1024 * 1024) {
        setClientError(`Gallery image "${item.file.name}" exceeds the 4MB limit.`)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
    }

    // Append layouts, new gallery images and captions
    formData.set('layout_format', selectedLayout)
    newGalleryFiles.forEach((item) => {
      formData.append('gallery_images', item.file)
      formData.append('gallery_captions', item.caption)
    })

    formAction(formData)
  }

  return (
    <form action={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Error display */}
      {(state?.error || clientError) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {clientError || state?.error}
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

      {/* Section: Layout Format */}
      <div className="bg-white rounded-2xl border border-gray-light/60 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-navy border-b border-gray-light/40 pb-3">
          Layout Format
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {layoutFormats.map((layout) => {
            const isSelected = selectedLayout === layout.value
            return (
              <button
                key={layout.value}
                type="button"
                onClick={() => setSelectedLayout(layout.value as any)}
                className={`flex flex-col text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue bg-blue/5'
                    : 'border-gray-light hover:border-gray'
                }`}
              >
                <span className="font-semibold text-navy text-sm">{layout.label}</span>
                <span className="text-xs text-gray mt-1 leading-normal">
                  {layout.description}
                </span>
                <input
                  type="radio"
                  name="layout_format"
                  value={layout.value}
                  checked={isSelected}
                  onChange={() => {}}
                  className="sr-only"
                />
              </button>
            )
          })}
        </div>
      </div>

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
        <h2 className="text-lg font-semibold text-navy border-b border-gray-light/40 pb-3">
          Project Gallery
        </h2>

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

      {/* Section: Content */}
      <div className="bg-white rounded-2xl border border-gray-light/60 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-navy border-b border-gray-light/40 pb-3">
          Content Details
        </h2>

        <Textarea id="content_writing_sample" name="content_writing_sample" label="Content Writing Sample" placeholder="Paste a sample of the content created for this project" defaultValue={item?.content_writing_sample || ''} />
        <Textarea id="media_buying_notes" name="media_buying_notes" label="Media Buying Notes" placeholder="Ad spend, targeting, platform details, and strategy notes" defaultValue={item?.media_buying_notes || ''} />
        <Textarea id="event_planning_notes" name="event_planning_notes" label="Event Planning Notes" placeholder="Event details, logistics, and planning notes" defaultValue={item?.event_planning_notes || ''} />
      </div>

      {/* Section: Results */}
      <div className="bg-white rounded-2xl border border-gray-light/60 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-navy border-b border-gray-light/40 pb-3">
          Results & Details
        </h2>

        <Textarea id="results" name="results" label="Results & Metrics" placeholder="Key results, KPIs, and measurable outcomes" defaultValue={item?.results || ''} />
        <Input id="tools_used" name="tools_used" label="Tools Used" placeholder="e.g., Meta Ads Manager, Google Analytics, ManyChat (comma separated)" defaultValue={item?.tools_used || ''} />
        <Textarea id="full_case_study" name="full_case_study" label="Full Case Study" placeholder="Detailed case study write-up with background, approach, and outcomes" defaultValue={item?.full_case_study || ''} className="min-h-[200px]" />
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

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isPending} size="lg">
            {isPending ? 'Saving...' : item ? 'Update Project' : 'Create Project'}
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={() => window.history.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}
