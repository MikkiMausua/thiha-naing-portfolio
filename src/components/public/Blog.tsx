'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { BlogPost } from '@/types'
import { formatDate } from '@/lib/utils'
import EmptyState from '@/components/ui/EmptyState'

export default function Blog({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return (
      <section id="blog" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Blog</h2>
            <div className="w-15 h-0.75 bg-blue mx-auto" />
          </div>
          <EmptyState
            title="Blog posts coming soon"
            description="Stay tuned — articles and insights will be shared here."
          />
        </div>
      </section>
    )
  }

  return (
    <section id="blog" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Blog</h2>
          <div className="w-15 h-0.75 bg-blue mx-auto mb-4" />
          <p className="text-gray max-w-2xl mx-auto">
            Insights, strategies, and lessons from the world of digital marketing.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl border border-gray-light/60 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-blue/20"
            >
              {/* Cover Image */}
              <div className="aspect-[16/10] relative overflow-hidden">
                {post.cover_image_url ? (
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-navy/10 via-blue/10 to-indigo-100 flex items-center justify-center">
                    <svg className="w-12 h-12 text-blue/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
              </div>

              {/* Card Body */}
              <div className="p-5">
                {/* Tags */}
                {post.tags && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.split(',').slice(0, 3).map((tag) => (
                      <span
                        key={tag.trim()}
                        className="inline-block px-2 py-0.5 bg-blue/10 text-blue text-[11px] font-medium rounded-full"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h3 className="text-lg font-semibold text-navy line-clamp-2 group-hover:text-blue transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-sm text-gray mt-2 line-clamp-2">{post.excerpt}</p>
                )}

                {/* Date + Read More */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-light/40">
                  <span className="text-xs text-gray">{formatDate(post.created_at)}</span>
                  <span className="text-sm font-medium text-blue group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read More
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
