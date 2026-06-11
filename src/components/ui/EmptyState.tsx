export default function EmptyState({
  title = 'Nothing here yet',
  description = 'Check back soon for updates.',
  icon,
}: {
  title?: string
  description?: string
  icon?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon ? (
        icon
      ) : (
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-glow">
          <svg className="w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      )}
      <h3 className="text-lg font-semibold text-white/90 mb-2">{title}</h3>
      <p className="text-white/40 max-w-sm">{description}</p>
    </div>
  )
}
