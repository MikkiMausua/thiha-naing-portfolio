import { cn } from '@/lib/utils'

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        status === 'published'
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-amber-50 text-amber-700 border border-amber-200'
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full mr-1.5',
          status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'
        )}
      />
      {status === 'published' ? 'Published' : 'Draft'}
    </span>
  )
}
