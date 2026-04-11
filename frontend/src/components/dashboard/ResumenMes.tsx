import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from '../ui/Card'
import { formatCurrency } from '../../types'

interface ResumenMesProps {
  totalMes: number
  totalMesAnterior: number | null
  variacionPorcentual: number | null
  mes: string
}

function getMesNombre(mes: string): string {
  const [y, m] = mes.split('-')
  const date = new Date(Number(y), Number(m) - 1, 1)
  return date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
}

export function ResumenMes({
  totalMes,
  totalMesAnterior,
  variacionPorcentual,
  mes,
}: ResumenMesProps) {
  const mesNombre = getMesNombre(mes)
  const subio = (variacionPorcentual ?? 0) > 0

  return (
    <Card variant="elevated">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-600 mb-1">
        Total gastado en {mesNombre}
      </p>
      <p className="text-3xl font-bold text-neutral-900 tabular-nums">
        {formatCurrency(totalMes)}
      </p>
      {variacionPorcentual !== null && totalMesAnterior !== null && (
        <div
          className={`flex items-center gap-1 mt-1 text-sm font-medium ${
            subio ? 'text-danger' : 'text-success'
          }`}
        >
          {subio ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>
            {subio ? '+' : ''}
            {variacionPorcentual.toFixed(1)}% vs. mes anterior
          </span>
        </div>
      )}
    </Card>
  )
}
