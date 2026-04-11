import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Card } from '../ui/Card'
import type { TotalPorCategoria } from '../../types'
import { formatCurrency } from '../../types'

interface GraficoBarrasProps {
  data: TotalPorCategoria[]
}

interface TooltipPayloadItem {
  value: number
  payload: TotalPorCategoria
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
}) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="bg-surface border border-neutral-200 rounded-lg shadow-md px-3 py-2 text-sm">
      <p className="font-semibold text-neutral-900">{item.payload.categoria_name}</p>
      <p className="text-neutral-600">{formatCurrency(item.value)}</p>
      <p className="text-neutral-400 text-xs">{item.payload.porcentaje.toFixed(1)}%</p>
    </div>
  )
}

export function GraficoBarras({ data }: GraficoBarrasProps) {
  if (data.length === 0) return null

  // Si hay solo una categoría, mostrar texto en lugar del gráfico
  if (data.length === 1) {
    const cat = data[0]
    return (
      <Card variant="elevated">
        <p className="text-sm font-semibold uppercase tracking-wide text-neutral-700 mb-3">
          Por categoría
        </p>
        <p className="text-base font-medium" style={{ color: cat.categoria_color }}>
          {cat.categoria_name} · 100% del gasto del mes
        </p>
      </Card>
    )
  }

  return (
    <Card variant="elevated">
      <p className="text-sm font-semibold uppercase tracking-wide text-neutral-700 mb-4">
        Por categoría
      </p>
      <ResponsiveContainer width="100%" height={data.length * 40 + 20}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 60, left: 0, bottom: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="categoria_name"
            width={90}
            tick={{ fontSize: 12, fill: '#374151' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
          <Bar dataKey="total" radius={[0, 6, 6, 0]} barSize={12}>
            {data.map((entry) => (
              <Cell key={entry.categoria_id} fill={entry.categoria_color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
