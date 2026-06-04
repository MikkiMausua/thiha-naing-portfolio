'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { slugify } from '@/lib/utils'

export async function createShowcaseItem(prevState: { error?: string; success?: boolean } | null, formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const title = formData.get('title') as string
    if (!title) return { error: 'Title is required' }

    const slug = slugify(title)

    // Handle cover image (client-side pre-upload preferred, server-side upload fallback)
    let cover_image_url = formData.get('cover_image_url') as string || ''
    const coverImage = formData.get('cover_image') as File
    if (!cover_image_url && coverImage && coverImage.size > 0) {
      const fileExt = coverImage.name.split('.').pop()
      const filePath = `${Date.now()}-${slug}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('showcase-images')
        .upload(filePath, coverImage, { cacheControl: '3600', upsert: false })

      if (uploadError) return { error: `Image upload failed: ${uploadError.message}` }

      const { data: { publicUrl } } = supabase.storage
        .from('showcase-images')
        .getPublicUrl(filePath)

      cover_image_url = publicUrl
    }

    const { data: item, error } = await supabase.from('showcase_items').insert({
      title,
      slug,
      category: (formData.get('category') as string) || null,
      project_type: (formData.get('project_type') as string) || null,
      short_description: (formData.get('short_description') as string) || null,
      my_role: (formData.get('my_role') as string) || null,
      facebook_post_url: (formData.get('facebook_post_url') as string) || null,
      cover_image_url: cover_image_url || null,
      content_writing_sample: (formData.get('content_writing_sample') as string) || null,
      media_buying_notes: (formData.get('media_buying_notes') as string) || null,
      event_planning_notes: (formData.get('event_planning_notes') as string) || null,
      results: (formData.get('results') as string) || null,
      tools_used: (formData.get('tools_used') as string) || null,
      full_case_study: (formData.get('full_case_study') as string) || null,
      layout_format: (formData.get('layout_format') as string) || 'standard',
      status: (formData.get('status') as string) || 'draft',
    }).select('id').single()

    if (error) {
      if (error.code === '23505') return { error: 'A project with this title already exists. Please use a different title.' }
      return { error: error.message }
    }

    // Handle gallery images
    if (item) {
      const galleryJson = formData.get('gallery_json') as string
      if (galleryJson) {
        // Direct JSON format from client-side uploads
        const galleryItems = JSON.parse(galleryJson) as { image_url: string; caption: string | null }[]
        for (let i = 0; i < galleryItems.length; i++) {
          const g = galleryItems[i]
          await supabase.from('showcase_gallery').insert({
            showcase_id: item.id,
            image_url: g.image_url,
            caption: g.caption,
            sort_order: i,
          })
        }
      } else {
        // Fallback legacy file upload
        const galleryFiles = formData.getAll('gallery_images') as File[]
        const galleryCaptions = formData.getAll('gallery_captions') as string[]

        for (let i = 0; i < galleryFiles.length; i++) {
          const file = galleryFiles[i]
          if (!file || file.size === 0) continue

          const fileExt = file.name.split('.').pop()
          const filePath = `gallery/${item.id}/${Date.now()}-${i}.${fileExt}`

          const { error: uploadError } = await supabase.storage
            .from('showcase-images')
            .upload(filePath, file, { cacheControl: '3600', upsert: false })

          if (uploadError) continue

          const { data: { publicUrl } } = supabase.storage
            .from('showcase-images')
            .getPublicUrl(filePath)

          await supabase.from('showcase_gallery').insert({
            showcase_id: item.id,
            image_url: publicUrl,
            caption: galleryCaptions[i] || null,
            sort_order: i,
          })
        }
      }
    }

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (e) {
    return { error: `Something went wrong: ${e instanceof Error ? e.message : 'Unknown error'}` }
  }
}

export async function updateShowcaseItem(id: string, prevState: { error?: string; success?: boolean } | null, formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const title = formData.get('title') as string
    if (!title) return { error: 'Title is required' }

    // Cover image path
    let cover_image_url = formData.get('cover_image_url') as string || formData.get('existing_cover_image_url') as string || ''
    const coverImage = formData.get('cover_image') as File
    if (!formData.get('cover_image_url') && coverImage && coverImage.size > 0) {
      const slug = slugify(title)
      const fileExt = coverImage.name.split('.').pop()
      const filePath = `${Date.now()}-${slug}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('showcase-images')
        .upload(filePath, coverImage, { cacheControl: '3600', upsert: false })

      if (uploadError) return { error: `Image upload failed: ${uploadError.message}` }

      const { data: { publicUrl } } = supabase.storage
        .from('showcase-images')
        .getPublicUrl(filePath)

      cover_image_url = publicUrl
    }

    const { error } = await supabase.from('showcase_items').update({
      title,
      slug: slugify(title),
      category: (formData.get('category') as string) || null,
      project_type: (formData.get('project_type') as string) || null,
      short_description: (formData.get('short_description') as string) || null,
      my_role: (formData.get('my_role') as string) || null,
      facebook_post_url: (formData.get('facebook_post_url') as string) || null,
      cover_image_url: cover_image_url || null,
      content_writing_sample: (formData.get('content_writing_sample') as string) || null,
      media_buying_notes: (formData.get('media_buying_notes') as string) || null,
      event_planning_notes: (formData.get('event_planning_notes') as string) || null,
      results: (formData.get('results') as string) || null,
      tools_used: (formData.get('tools_used') as string) || null,
      full_case_study: (formData.get('full_case_study') as string) || null,
      layout_format: (formData.get('layout_format') as string) || 'standard',
      status: (formData.get('status') as string) || 'draft',
    }).eq('id', id)

    if (error) return { error: error.message }

    // Handle new gallery images
    const galleryJson = formData.get('gallery_json') as string
    if (galleryJson) {
      const galleryItems = JSON.parse(galleryJson) as { image_url: string; caption: string | null }[]
      
      // Get current max sort_order
      const { data: existing } = await supabase
        .from('showcase_gallery')
        .select('sort_order')
        .eq('showcase_id', id)
        .order('sort_order', { ascending: false })
        .limit(1)

      const baseOrder = (existing?.[0]?.sort_order ?? -1) + 1

      for (let i = 0; i < galleryItems.length; i++) {
        const g = galleryItems[i]
        await supabase.from('showcase_gallery').insert({
          showcase_id: id,
          image_url: g.image_url,
          caption: g.caption,
          sort_order: baseOrder + i,
        })
      }
    } else {
      // Fallback legacy file upload
      const galleryFiles = formData.getAll('gallery_images') as File[]
      const galleryCaptions = formData.getAll('gallery_captions') as string[]

      for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i]
        if (!file || file.size === 0) continue

        const fileExt = file.name.split('.').pop()
        const filePath = `gallery/${id}/${Date.now()}-${i}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('showcase-images')
          .upload(filePath, file, { cacheControl: '3600', upsert: false })

        if (uploadError) continue

        const { data: { publicUrl } } = supabase.storage
          .from('showcase-images')
          .getPublicUrl(filePath)

        // Get current max sort_order
        const { data: existing } = await supabase
          .from('showcase_gallery')
          .select('sort_order')
          .eq('showcase_id', id)
          .order('sort_order', { ascending: false })
          .limit(1)

        const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1 + i

        await supabase.from('showcase_gallery').insert({
          showcase_id: id,
          image_url: publicUrl,
          caption: galleryCaptions[i] || null,
          sort_order: nextOrder,
        })
      }
    }

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (e) {
    return { error: `Something went wrong: ${e instanceof Error ? e.message : 'Unknown error'}` }
  }
}

export async function deleteShowcaseItem(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('showcase_items').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin')
  revalidatePath('/')
  return { success: true }
}

export async function toggleShowcaseStatus(id: string, currentStatus: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const newStatus = currentStatus === 'published' ? 'draft' : 'published'
  const { error } = await supabase
    .from('showcase_items')
    .update({ status: newStatus })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin')
  revalidatePath('/')
  return { success: true, newStatus }
}

export async function deleteGalleryImage(imageId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get image URL for storage cleanup
  const { data: image } = await supabase
    .from('showcase_gallery')
    .select('image_url')
    .eq('id', imageId)
    .single()

  if (image?.image_url) {
    const url = new URL(image.image_url)
    const pathParts = url.pathname.split('/showcase-images/')
    if (pathParts[1]) {
      await supabase.storage.from('showcase-images').remove([decodeURIComponent(pathParts[1])])
    }
  }

  const { error } = await supabase.from('showcase_gallery').delete().eq('id', imageId)
  if (error) return { error: error.message }

  revalidatePath('/admin')
  return { success: true }
}
