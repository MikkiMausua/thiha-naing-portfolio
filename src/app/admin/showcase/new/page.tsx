import ShowcaseForm from '@/components/admin/ShowcaseForm'
import { createShowcaseItem } from '@/app/admin/actions'
import Link from 'next/link'

export default function NewShowcasePage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin" className="text-blue hover:text-navy text-sm flex items-center gap-1 mb-4 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-navy">New Showcase Project</h1>
        <p className="text-gray text-sm mt-1">Add a new project to your portfolio showcase</p>
      </div>
      <ShowcaseForm action={createShowcaseItem} />
    </div>
  )
}
