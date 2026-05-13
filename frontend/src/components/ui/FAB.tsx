import { Plus, X } from 'lucide-react'
import type { CSSProperties } from 'react'

interface FABProps {
  isOpen: boolean
  onClick: () => void
  style?: CSSProperties
}

export function FAB({ isOpen, onClick, style }: FABProps) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? 'Cerrar formulario' : 'Registrar gasto'}
      className={[
        'fixed right-4 z-50',
        'size-14 rounded-full',
        'bg-[var(--accent-primary)] text-[var(--btn-primary-text)]',
        'shadow-[var(--shadow-fab)]',
        'flex items-center justify-center',
        'transition-all duration-150 ease-out',
        'hover:bg-[var(--accent-primary-hover)] hover:scale-105',
        'active:scale-[0.97]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)]',
        'animate-fab-appear',
      ].join(' ')}
      style={{
        bottom: style?.bottom ?? '24px', zIndex: 0,
        ...style,
      }}
    >
      <span
        className="transition-transform duration-200 ease-out"
        style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </span>
    </button>
  )
}
