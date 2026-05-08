import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '../ui/Badge'
import type { Gasto } from '../../types'
import { formatCurrency } from '../../types'

interface GastoItemProps {
  gasto: Gasto
  onDelete: (id: number) => void
  onEdit: (gasto: Gasto) => void
}

function formatFecha(fechaStr: string): string {
  const [y, m, d] = fechaStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
  })
}

export function GastoItem({ gasto, onDelete, onEdit }: GastoItemProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-[var(--border-subtle)] last:border-0 group">
      <div>
        <div className="flex-1 min-w-0 mb-1">
          <p className="text-base font-medium text-[var(--text-primary)] truncate">
            {gasto.description ?? gasto.categoria.name}
          </p>
          <p className="text-xs text-[var(--text-tertiary)]">{formatFecha(gasto.fecha)}</p>
        </div>
        <Badge categoria={gasto.categoria} />
      </div>
      <div className="flex items-center gap-6" style={{ flexDirection: 'column' }}>
        <span className="text-base font-semibold text-[var(--text-primary)] tabular-nums whitespace-nowrap">
          {formatCurrency(gasto.amount)}
        </span>
        <div>
          <button
            onClick={() => onEdit(gasto)}
            aria-label={`Editar gasto ${gasto.description ?? gasto.categoria.name}`}
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-all duration-150 rounded"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(gasto.id)}
            aria-label={`Eliminar gasto ${gasto.description ?? gasto.categoria.name}`}
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-[var(--text-tertiary)] hover:text-[var(--accent-danger)] transition-all duration-150 rounded"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
