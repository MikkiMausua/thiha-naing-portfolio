import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import ShowcaseTable from '@/components/admin/ShowcaseTable'
import type { ShowcaseItem } from '@/types'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('showcase_items')
    .select('*')
    .order('created_at', { ascending: false })

  const showcaseItems = (items as ShowcaseItem[]) || []
  const publishedCount = showcaseItems.filter(i => i.status === 'published').length
  const draftCount = showcaseItems.filter(i => i.status === 'draft').length

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Showcase Projects</h1>
          <p className="text-gray text-sm mt-1">Manage your portfolio showcase items</p>
        </div>
        <Link
          href="/admin/showcase/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-light/60 p-5">
          <p className="text-xs font-medium text-gray uppercase tracking-wider">Total Projects</p>
          <p className="text-3xl font-bold text-navy mt-1">{showcaseItems.length}</p>
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

      {/* Table */}
      <ShowcaseTable items={showcaseItems} />
    </div>
  )
}
