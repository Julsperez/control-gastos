import { useState } from 'react'
import { AlertTriangle, AlertOctagon, XCircle, X } from 'lucide-react'
import type { BudgetStatus } from '../../types'
import { formatCurrency } from '../../types'

interface Props {
  status: BudgetStatus
}

const config = {
  warning: {
    classes:
      'bg-[var(--accent-warning-subtle)] border-l-[3px] border-[var(--accent-warning)] text-[var(--accent-warning)]',
    icon: <AlertTriangle size={16} className="text-[var(--accent-warning)] shrink-0" />,
  },
  critical: {
    classes:
      'bg-[var(--accent-danger-subtle)] border-l-[3px] border-[var(--accent-danger)] text-[var(--accent-danger)]',
    icon: <AlertOctagon size={16} className="text-[var(--accent-danger)] shrink-0" />,
  },
  exceeded: {
    classes:
      'bg-[var(--accent-danger-subtle)] border-l-[3px] border-[var(--accent-danger)] text-[var(--accent-danger)]',
    icon: <XCircle size={16} className="text-[var(--accent-danger)] shrink-0" />,
  },
}

function getMessage(status: BudgetStatus): string {
  if (status.alert_level === 'exceeded') {
    const excess = status.budget !== null ? status.spent - status.budget : 0
    return `Has excedido tu presupuesto en ${formatCurrency(excess)}`
  }
  if (status.alert_level === 'critical') {
    return `¡Atención! Has usado el ${status.percentage_used?.toFixed(1)}% de tu presupuesto`
  }
  return `Has usado el ${status.percentage_used?.toFixed(1)}% de tu presupuesto`
}

export function BudgetAlertBanner({ status }: Props) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || status.alert_level === 'none') return null

  const { classes, icon } = config[status.alert_level as keyof typeof config]

  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 ${classes}`}>
      {icon}
      <p className="text-sm flex-1 font-medium">{getMessage(status)}</p>
      <button
        onClick={() => setDismissed(true)}
        className="opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Cerrar alerta"
      >
        <X size={14} />
      </button>
    </div>
  )
}
