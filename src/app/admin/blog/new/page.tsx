import BlogForm from '@/components/admin/BlogForm'
import { createBlogPost } from '@/app/admin/blog/actions'
import Link from 'next/link'

export default function NewBlogPostPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/blog" className="text-blue hover:text-navy text-sm flex items-center gap-1 mb-4 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>
        <h1 className="text-2xl font-bold text-navy">New Blog Post</h1>
        <p className="text-gray text-sm mt-1">Write a new article for your blog</p>
      </div>
      <BlogForm action={createBlogPost} />
    </div>
  )
}
