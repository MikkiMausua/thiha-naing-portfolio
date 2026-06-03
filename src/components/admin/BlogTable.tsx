'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { BlogPost } from '@/types'
import { formatDate } from '@/lib/utils'
import { toggleBlogStatus, deleteBlogPost } from '@/app/admin/blog/actions'
import StatusBadge from '@/components/admin/StatusBadge'
import EmptyState from '@/components/ui/EmptyState'

export default function BlogTable({ posts }: { posts: BlogPost[] }) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  if (posts.length === 0) {
    return (
      <EmptyState
        title="No blog posts yet"
        description="Create your first blog post to get started."
      />
    )
  }

  async function handleToggle(id: string, currentStatus: string) {
    setLoadingId(id)
    try {
      await toggleBlogStatus(id, currentStatus)
      router.refresh()
    } finally {
      setLoadingId(null)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    setLoadingId(id)
    try { await deleteBlogPost(id) } catch { /* redirect */ }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-light/60 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-light/60">
              <th className="text-left px-6 py-4 text-xs font-medium text-gray uppercase tracking-wider">Title</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray uppercase tracking-wider">Tags</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray uppercase tracking-wider">Created</th>
              <th className="text-right px-6 py-4 text-xs font-medium text-gray uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-light/40">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-light/10 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium text-navy text-sm">{post.title}</p>
                  {post.excerpt && <p className="text-xs text-gray mt-0.5 line-clamp-1 max-w-xs">{post.excerpt}</p>}
                </td>
                <td className="px-6 py-4">
                  {post.tags ? (
                    <span className="inline-block px-2 py-0.5 bg-blue/10 text-blue text-xs rounded-full">{post.tags.split(',')[0]}</span>
                  ) : <span className="text-gray text-xs">—</span>}
                </td>
                <td className="px-6 py-4"><StatusBadge status={post.status} /></td>
                <td className="px-6 py-4 text-sm text-gray">{formatDate(post.created_at)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/blog/${post.id}/edit`} className="p-2 rounded-lg text-gray hover:text-navy hover:bg-gray-light/40 transition-colors" title="Edit">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                    </Link>
                    <button onClick={() => handleToggle(post.id, post.status)} disabled={loadingId === post.id} className="p-2 rounded-lg text-gray hover:text-blue hover:bg-blue/10 transition-colors disabled:opacity-50 cursor-pointer" title={post.status === 'published' ? 'Unpublish' : 'Publish'}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(post.id)} disabled={loadingId === post.id} className="p-2 rounded-lg text-gray hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer" title="Delete">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
