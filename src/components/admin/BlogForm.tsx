'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { BlogPost } from '@/types'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import Image from 'next/image'

interface BlogFormProps {
  post?: BlogPost
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (prevState: any, formData: FormData) => Promise<any>
}

export default function BlogForm({ post, action }: BlogFormProps) {
  const [state, formAction, isPending] = useActionState(action, null)
  const router = useRouter()

  // Redirect on success
  useEffect(() => {
    if (state?.success) {
      router.push('/admin/blog')
    }
  }, [state, router])

  return (
    <form action={formAction} className="space-y-8 max-w-4xl">
      {state?.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {state.error}
        </div>
      )}

      {post?.cover_image_url && (
        <input type="hidden" name="existing_cover_image_url" value={post.cover_image_url} />
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-gray-light/60 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-navy border-b border-gray-light/40 pb-3">Post Details</h2>
        <Input id="title" name="title" label="Title *" placeholder="e.g., 5 SEO Strategies That Actually Work" defaultValue={post?.title || ''} required />
        <Textarea id="excerpt" name="excerpt" label="Excerpt" placeholder="Short summary shown on the blog card" defaultValue={post?.excerpt || ''} className="min-h-[80px]" />
        <Input id="tags" name="tags" label="Tags" placeholder="e.g., SEO, Marketing, Strategy (comma separated)" defaultValue={post?.tags || ''} />
      </div>

      {/* Cover Image */}
      <div className="bg-white rounded-2xl border border-gray-light/60 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-navy border-b border-gray-light/40 pb-3">Cover Image</h2>
        {post?.cover_image_url && (
          <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-gray-light mb-2">
            <Image src={post.cover_image_url} alt="Current cover" fill className="object-cover" />
            <span className="absolute bottom-1 right-1 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded">Current</span>
          </div>
        )}
        <input type="file" id="cover_image" name="cover_image" accept="image/*" className="block w-full text-sm text-gray file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue/10 file:text-blue hover:file:bg-blue/20 file:cursor-pointer cursor-pointer" />
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-gray-light/60 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-navy border-b border-gray-light/40 pb-3">Content</h2>
        <Textarea id="content" name="content" label="Blog Content" placeholder="Write your blog post content here..." defaultValue={post?.content || ''} className="min-h-[300px]" />
      </div>

      {/* Status */}
      <div className="bg-white rounded-2xl border border-gray-light/60 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-navy border-b border-gray-light/40 pb-3">Publishing</h2>
        <div className="space-y-1.5">
          <label htmlFor="status" className="block text-sm font-medium text-charcoal">Status</label>
          <select id="status" name="status" defaultValue={post?.status || 'draft'} className="block w-full rounded-lg border border-gray-light bg-white px-4 py-2.5 text-charcoal transition-colors duration-200 focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20">
            <option value="draft">Draft — Not visible on public site</option>
            <option value="published">Published — Visible on public site</option>
          </select>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isPending} size="lg">
            {isPending ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={() => window.history.back()}>Cancel</Button>
        </div>
      </div>
    </form>
  )
}
