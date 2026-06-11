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
        'glass-card rounded-2xl border border-white/5 p-6',
        hover && 'transition-all duration-500 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1 hover:border-accent/20',
        className
      )}
    >
      {children}
    </div>
  )
}
