import { Wallet } from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  onAction: () => void
}

export function EmptyState({ onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Wallet
        size={64}
        className="mb-4"
        style={{ color: 'var(--accent-primary)', opacity: 0.5 }}
      />
      <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
        Aún no hay gastos registrados
      </h2>
      <p className="text-base text-[var(--text-secondary)] max-w-[280px] mb-6">
        Empieza a registrar tus gastos diarios y tendrás una vista clara de en qué va tu dinero.
      </p>
      <Button variant="primary" size="md" onClick={onAction} className="w-60">
        Registrar mi primer gasto
      </Button>
    </div>
  )
}
