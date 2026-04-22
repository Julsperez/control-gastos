import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated'
  header?: ReactNode
  interactive?: boolean
  children: ReactNode
}

export function Card({
  variant = 'default',
  header,
  interactive = false,
  children,
  className = '',
  ...props
}: CardProps) {
  const baseClass = 'overflow-hidden rounded-[18px]'
  const variantClass =
    variant === 'elevated'
      ? 'glass-card'
      : 'bg-[var(--bg-card)] border border-[var(--border-default)]'
  const interactiveClass = interactive
    ? 'glass-card-hover cursor-pointer transition-all duration-150'
    : ''

  return (
    <div
      className={[baseClass, variantClass, interactiveClass, className].join(' ')}
      {...props}
    >
      {header && (
        <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
          <span className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
            {header}
          </span>
        </div>
      )}
      <div className="p-4 lg:p-6">{children}</div>
    </div>
  )
}
