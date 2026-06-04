import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import ShowcaseForm from '@/components/admin/ShowcaseForm'
import { updateShowcaseItem } from '@/app/admin/actions'
import Link from 'next/link'
import type { ShowcaseItem } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditShowcasePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: item } = await supabase
    .from('showcase_items')
    .select('*')
    .eq('id', id)
    .single()

  if (!item) {
    notFound()
  }

  const { data: galleryImages } = await supabase
    .from('showcase_gallery')
    .select('*')
    .eq('showcase_id', id)
    .order('sort_order', { ascending: true })

  const updateWithId = updateShowcaseItem.bind(null, id)

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin" className="text-blue hover:text-navy text-sm flex items-center gap-1 mb-4 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-navy">Edit Showcase Project</h1>
        <p className="text-gray text-sm mt-1">Update &ldquo;{(item as ShowcaseItem).title}&rdquo;</p>
      </div>
      <ShowcaseForm item={item as ShowcaseItem} existingGallery={galleryImages || []} action={updateWithId} />
    </div>
  )
}
