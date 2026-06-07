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
        'glass-dark rounded-2xl border border-white/10 p-6',
        hover && 'transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-1 hover:border-accent/50',
        className
      )}
    >
      {children}
    </div>
  )
}
