import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
          variant === 'primary' && 'bg-accent text-[#0F0F14] hover:shadow-lg hover:shadow-accent/25 focus:ring-accent',
          variant === 'secondary' && 'bg-blue text-[#0F0F14] hover:shadow-lg hover:shadow-blue/25 focus:ring-blue',
          variant === 'outline' && 'border border-white/15 text-white hover:bg-white/5 hover:border-white/30 focus:ring-white/30',
          variant === 'ghost' && 'text-white/70 hover:text-white hover:bg-white/5 focus:ring-white/20',
          variant === 'danger' && 'bg-red-500/90 text-white hover:bg-red-500 focus:ring-red-500',
          size === 'sm' && 'px-3 py-1.5 text-sm',
          size === 'md' && 'px-5 py-2.5 text-sm',
          size === 'lg' && 'px-7 py-3 text-base',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
