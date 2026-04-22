import { Trash2 } from 'lucide-react'
import { Badge } from '../ui/Badge'
import type { Gasto } from '../../types'
import { formatCurrency } from '../../types'

interface GastoItemProps {
  gasto: Gasto
  onDelete: (id: number) => void
}

function formatFecha(fechaStr: string): string {
  const [y, m, d] = fechaStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
  })
}

export function GastoItem({ gasto, onDelete }: GastoItemProps) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[var(--border-subtle)] last:border-0 group">
      <Badge categoria={gasto.categoria} />
      <div className="flex-1 min-w-0">
        <p className="text-base font-medium text-[var(--text-primary)] truncate">
          {gasto.description ?? gasto.categoria.name}
        </p>
        <p className="text-xs text-[var(--text-tertiary)]">{formatFecha(gasto.fecha)}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-base font-semibold text-[var(--text-primary)] tabular-nums whitespace-nowrap">
          {formatCurrency(gasto.amount)}
        </span>
        <button
          onClick={() => onDelete(gasto.id)}
          aria-label={`Eliminar gasto ${gasto.description ?? gasto.categoria.name}`}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-[var(--text-tertiary)] hover:text-[var(--accent-danger)] transition-all duration-150 rounded"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
