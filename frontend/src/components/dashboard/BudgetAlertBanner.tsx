import { useState } from 'react'
import { AlertTriangle, AlertOctagon, XCircle, X } from 'lucide-react'
import type { BudgetStatus } from '../../types'
import { formatCurrency } from '../../types'

interface Props {
  status: BudgetStatus
}

const config = {
  warning: {
    bg: 'bg-yellow-50 border-yellow-300',
    text: 'text-yellow-800',
    icon: <AlertTriangle size={16} className="text-yellow-600 shrink-0" />,
  },
  critical: {
    bg: 'bg-red-50 border-red-300',
    text: 'text-red-800',
    icon: <AlertOctagon size={16} className="text-red-600 shrink-0" />,
  },
  exceeded: {
    bg: 'bg-red-100 border-red-400',
    text: 'text-red-900',
    icon: <XCircle size={16} className="text-red-700 shrink-0" />,
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

  const { bg, text, icon } = config[status.alert_level as keyof typeof config]

  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 border-b ${bg}`}>
      {icon}
      <p className={`text-sm flex-1 font-medium ${text}`}>{getMessage(status)}</p>
      <button
        onClick={() => setDismissed(true)}
        className={`${text} opacity-60 hover:opacity-100 transition-opacity`}
        aria-label="Cerrar alerta"
      >
        <X size={14} />
      </button>
    </div>
  )
}
