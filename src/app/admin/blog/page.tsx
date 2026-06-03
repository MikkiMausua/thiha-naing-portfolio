import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import BlogTable from '@/components/admin/BlogTable'
import type { BlogPost } from '@/types'

export default async function AdminBlogPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  const blogPosts = (posts as BlogPost[]) || []
  const publishedCount = blogPosts.filter(p => p.status === 'published').length
  const draftCount = blogPosts.filter(p => p.status === 'draft').length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Blog Posts</h1>
          <p className="text-gray text-sm mt-1">Manage your blog articles</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Blog Post
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-light/60 p-5">
          <p className="text-xs font-medium text-gray uppercase tracking-wider">Total Posts</p>
          <p className="text-3xl font-bold text-navy mt-1">{blogPosts.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-light/60 p-5">
          <p className="text-xs font-medium text-gray uppercase tracking-wider">Published</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{publishedCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-light/60 p-5">
          <p className="text-xs font-medium text-gray uppercase tracking-wider">Drafts</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{draftCount}</p>
        </div>
      </div>

      <BlogTable posts={blogPosts} />
    </div>
  )
}
