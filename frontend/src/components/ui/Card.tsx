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
  const baseClass = 'bg-surface rounded-lg overflow-hidden'
  const variantClass =
    variant === 'elevated'
      ? 'shadow-md'
      : 'border border-neutral-200'
  const interactiveClass = interactive
    ? 'cursor-pointer hover:bg-neutral-100/50 active:bg-neutral-100 transition-colors duration-150'
    : ''

  return (
    <div
      className={[baseClass, variantClass, interactiveClass, className].join(' ')}
      {...props}
    >
      {header && (
        <div className="px-4 py-3 border-b border-neutral-200">
          <span className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
            {header}
          </span>
        </div>
      )}
      <div className="p-4 lg:p-6">{children}</div>
    </div>
  )
}
