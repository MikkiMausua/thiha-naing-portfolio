'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { slugify } from '@/lib/utils'

export async function createBlogPost(prevState: { error?: string; success?: boolean } | null, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const title = formData.get('title') as string
  if (!title) return { error: 'Title is required' }

  const slug = slugify(title)

  let cover_image_url = ''
  const coverImage = formData.get('cover_image') as File
  if (coverImage && coverImage.size > 0) {
    const fileExt = coverImage.name.split('.').pop()
    const filePath = `blog/${Date.now()}-${slug}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('showcase-images')
      .upload(filePath, coverImage, { cacheControl: '3600', upsert: false })

    if (uploadError) return { error: `Image upload failed: ${uploadError.message}` }

    const { data: { publicUrl } } = supabase.storage
      .from('showcase-images')
      .getPublicUrl(filePath)

    cover_image_url = publicUrl
  }

  const { error } = await supabase.from('blog_posts').insert({
    title,
    slug,
    excerpt: (formData.get('excerpt') as string) || null,
    content: (formData.get('content') as string) || null,
    cover_image_url: cover_image_url || null,
    tags: (formData.get('tags') as string) || null,
    status: (formData.get('status') as string) || 'draft',
  })

  if (error) {
    if (error.code === '23505') return { error: 'A blog post with this title already exists.' }
    return { error: error.message }
  }

  revalidatePath('/admin/blog')
  revalidatePath('/')
  return { success: true }
}

export async function updateBlogPost(id: string, prevState: { error?: string; success?: boolean } | null, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const title = formData.get('title') as string
  if (!title) return { error: 'Title is required' }

  let cover_image_url = formData.get('existing_cover_image_url') as string || ''
  const coverImage = formData.get('cover_image') as File
  if (coverImage && coverImage.size > 0) {
    const slug = slugify(title)
    const fileExt = coverImage.name.split('.').pop()
    const filePath = `blog/${Date.now()}-${slug}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('showcase-images')
      .upload(filePath, coverImage, { cacheControl: '3600', upsert: false })

    if (uploadError) return { error: `Image upload failed: ${uploadError.message}` }

    const { data: { publicUrl } } = supabase.storage
      .from('showcase-images')
      .getPublicUrl(filePath)

    cover_image_url = publicUrl
  }

  const { error } = await supabase.from('blog_posts').update({
    title,
    slug: slugify(title),
    excerpt: (formData.get('excerpt') as string) || null,
    content: (formData.get('content') as string) || null,
    cover_image_url: cover_image_url || null,
    tags: (formData.get('tags') as string) || null,
    status: (formData.get('status') as string) || 'draft',
  }).eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/blog')
  revalidatePath('/')
  return { success: true }
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/blog')
  revalidatePath('/')
  return { success: true }
}

export async function toggleBlogStatus(id: string, currentStatus: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const newStatus = currentStatus === 'published' ? 'draft' : 'published'
  const { error } = await supabase.from('blog_posts').update({ status: newStatus }).eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/blog')
  revalidatePath('/')
  return { success: true, newStatus }
}
