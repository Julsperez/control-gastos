import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-dark active:bg-[#4338CA] disabled:bg-[#A5B4FC] shadow-sm hover:shadow-md',
  secondary:
    'bg-surface text-primary border border-primary hover:bg-primary-light active:bg-[#E0E7FF] disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-neutral-300 shadow-sm',
  danger:
    'bg-danger text-white hover:bg-[#DC2626] active:bg-[#B91C1C] disabled:bg-[#FCA5A5] shadow-sm hover:shadow-md',
  ghost:
    'bg-transparent text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 disabled:text-neutral-300',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 py-1.5 text-sm font-medium rounded-btn-sm',
  md: 'h-10 px-4 py-2.5 text-base font-semibold rounded-btn-md',
  lg: 'h-12 px-5 py-3.5 text-base font-bold rounded-btn-md',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className={[
          'inline-flex items-center justify-center gap-2 transition-all duration-150 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? 'w-full' : '',
          isLoading ? 'cursor-wait' : '',
          className,
        ].join(' ')}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 16} />
            <span className={isLoading ? 'opacity-0 absolute' : ''}>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'
