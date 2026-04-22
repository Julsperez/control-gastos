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
    'bg-[var(--accent-primary)] text-[var(--btn-primary-text)] hover:bg-[var(--accent-primary-hover)] active:bg-[var(--accent-primary-active)] disabled:bg-[var(--accent-primary-disabled)] disabled:text-[var(--text-disabled)] shadow-sm hover:shadow-[var(--shadow-glow)]',
  secondary:
    'bg-transparent text-[var(--accent-primary)] border border-[var(--accent-primary)] hover:bg-[var(--accent-primary-subtle)] active:bg-[var(--accent-primary-subtle)] disabled:text-[var(--text-disabled)] disabled:border-[var(--border-subtle)]',
  danger:
    'bg-[var(--accent-danger)] text-[var(--btn-primary-text)] hover:brightness-110 active:brightness-95 disabled:opacity-50 shadow-sm',
  ghost:
    'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--accent-primary-subtle)] hover:text-[var(--text-primary)] active:bg-[var(--accent-primary-subtle)] disabled:text-[var(--text-disabled)]',
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
          'relative inline-flex items-center justify-center gap-2 transition-all duration-150 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)]',
          'disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? 'w-full' : '',
          isLoading ? 'cursor-wait' : '',
          className,
        ].join(' ')}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 16} />
          </span>
        )}
        <span className={isLoading ? 'invisible' : ''}>{children}</span>
      </button>
    )
  },
)

Button.displayName = 'Button'
