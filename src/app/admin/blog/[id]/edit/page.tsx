import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import BlogForm from '@/components/admin/BlogForm'
import { updateBlogPost } from '@/app/admin/blog/actions'
import Link from 'next/link'
import type { BlogPost } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (!post) notFound()

  const updateWithId = updateBlogPost.bind(null, id)

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/blog" className="text-blue hover:text-navy text-sm flex items-center gap-1 mb-4 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>
        <h1 className="text-2xl font-bold text-navy">Edit Blog Post</h1>
        <p className="text-gray text-sm mt-1">Update &ldquo;{(post as BlogPost).title}&rdquo;</p>
      </div>
      <BlogForm post={post as BlogPost} action={updateWithId} />
    </div>
  )
}
