import { Plus, X } from 'lucide-react'

interface FABProps {
  isOpen: boolean
  onClick: () => void
}

export function FAB({ isOpen, onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? 'Cerrar formulario' : 'Registrar gasto'}
      className={[
        'fixed bottom-6 right-4 z-50',
        'w-14 h-14 rounded-full',
        'bg-[var(--accent-primary)] text-[var(--btn-primary-text)]',
        'shadow-[var(--shadow-fab)]',
        'flex items-center justify-center',
        'transition-all duration-150 ease-out',
        'hover:bg-[var(--accent-primary-hover)] hover:scale-105',
        'active:scale-[0.97]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)]',
        'animate-fab-appear',
      ].join(' ')}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
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
