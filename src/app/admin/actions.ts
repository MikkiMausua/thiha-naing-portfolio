'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { slugify } from '@/lib/utils'

export async function createShowcaseItem(prevState: { error?: string; success?: boolean } | null, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const title = formData.get('title') as string
  if (!title) return { error: 'Title is required' }

  const slug = slugify(title)

  // Handle cover image upload
  let cover_image_url = ''
  const coverImage = formData.get('cover_image') as File
  if (coverImage && coverImage.size > 0) {
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

  const { error } = await supabase.from('showcase_items').insert({
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
    status: (formData.get('status') as string) || 'draft',
  })

  if (error) {
    if (error.code === '23505') return { error: 'A project with this title already exists. Please use a different title.' }
    return { error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/')
  return { success: true }
}

export async function updateShowcaseItem(id: string, prevState: { error?: string; success?: boolean } | null, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const title = formData.get('title') as string
  if (!title) return { error: 'Title is required' }

  // Handle cover image upload (optional on update)
  let cover_image_url = formData.get('existing_cover_image_url') as string || ''
  const coverImage = formData.get('cover_image') as File
  if (coverImage && coverImage.size > 0) {
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
    status: (formData.get('status') as string) || 'draft',
  }).eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin')
  revalidatePath('/')
  return { success: true }
}

export async function deleteShowcaseItem(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: item } = await supabase
    .from('showcase_items')
    .select('cover_image_url')
    .eq('id', id)
    .single()

  if (item?.cover_image_url) {
    const url = new URL(item.cover_image_url)
    const pathParts = url.pathname.split('/showcase-images/')
    if (pathParts[1]) {
      await supabase.storage.from('showcase-images').remove([pathParts[1]])
    }
  }

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
