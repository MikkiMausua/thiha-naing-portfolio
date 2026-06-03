import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-gray-light/60 p-6',
        hover && 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-blue/20',
        className
      )}
    >
      {children}
    </div>
  )
}
