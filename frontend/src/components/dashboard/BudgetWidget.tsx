import { Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { BudgetStatus } from '../../types'
import { formatCurrency } from '../../types'

interface Props {
  status: BudgetStatus | null
  isLoading?: boolean
}

const barColor: Record<string, string> = {
  none: 'bg-[var(--accent-primary)]',
  warning: 'bg-[var(--accent-warning)]',
  critical: 'bg-[var(--accent-danger)]',
  exceeded: 'bg-[var(--accent-danger)]',
}

const remainingColor: Record<string, string> = {
  none: 'text-[var(--accent-success)]',
  warning: 'text-[var(--accent-warning)]',
  critical: 'text-[var(--accent-danger)]',
  exceeded: 'text-[var(--accent-danger)]',
}

export function BudgetWidget({ status, isLoading }: Props) {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-default)] p-4 animate-pulse">
        <div className="h-4 bg-[var(--bg-skeleton)] rounded w-1/3 mb-3" />
        <div className="h-6 bg-[var(--bg-skeleton)] rounded w-1/2 mb-2" />
        <div className="h-2 bg-[var(--bg-skeleton)] rounded mb-3" />
        <div className="h-4 bg-[var(--bg-skeleton)] rounded w-2/3" />
      </div>
    )
  }

  if (!status || status.budget === null) {
    return (
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-default)] p-4 flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--text-tertiary)]">Sin presupuesto mensual configurado</p>
        <button
          onClick={() => navigate('/settings')}
          className="text-sm font-medium text-[var(--accent-primary)] hover:underline flex items-center gap-1 shrink-0"
        >
          <Settings size={14} />
          Definir presupuesto
        </button>
      </div>
    )
  }

  const { budget, spent, remaining, percentage_used, alert_level } = status
  const barWidth = Math.min(percentage_used ?? 0, 100)
  const isExceeded = alert_level === 'exceeded'

  return (
    <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-default)] p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)]">Presupuesto mensual</h3>
        <button
          onClick={() => navigate('/settings')}
          className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
          aria-label="Configurar presupuesto"
        >
          <Settings size={15} />
        </button>
      </div>

      <div className="flex items-end justify-between mb-2">
        <div>
          <p className="text-xs text-[var(--text-tertiary)] mb-0.5">Saldo disponible</p>
          <p className={`text-xl font-bold ${remainingColor[alert_level]}`}>
            {isExceeded && remaining !== null && remaining < 0 ? '-' : ''}
            {formatCurrency(Math.abs(remaining ?? 0))}
            {isExceeded && <span className="text-xs font-normal ml-1">excedido</span>}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--text-tertiary)]">Gastado</p>
          <p className="text-sm font-medium text-[var(--text-primary)]">{formatCurrency(spent)}</p>
          <p className="text-xs text-[var(--text-tertiary)]">de {formatCurrency(budget)}</p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="h-2 bg-[var(--bg-skeleton)] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor[alert_level]}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-xs text-[var(--text-tertiary)]">0%</span>
        <span className={`text-xs font-medium ${remainingColor[alert_level]}`}>
          {percentage_used !== null ? `${percentage_used.toFixed(1)}%` : '—'}
        </span>
      </div>
    </div>
  )
}
