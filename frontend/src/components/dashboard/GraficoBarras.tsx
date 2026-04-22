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
import { formatCurrency, SYSTEM_CATEGORIES_DARK } from '../../types'
import { useTheme } from '../../hooks/useTheme'

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
  theme,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  theme: 'dark' | 'light'
}) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  const isDark = theme === 'dark'
  return (
    <div
      className="rounded-lg px-3 py-2 text-sm"
      style={{
        background: isDark ? 'rgba(10,20,50,0.95)' : 'var(--bg-card)',
        backdropFilter: isDark ? 'blur(16px)' : undefined,
        WebkitBackdropFilter: isDark ? 'blur(16px)' : undefined,
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
        {item.payload.categoria_name}
      </p>
      <p style={{ color: 'var(--text-secondary)' }}>{formatCurrency(item.value)}</p>
      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
        {item.payload.porcentaje.toFixed(1)}%
      </p>
    </div>
  )
}

export function GraficoBarras({ data }: GraficoBarrasProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (data.length === 0) return null

  const labelColor = isDark ? 'rgba(255,255,255,0.65)' : '#374151'
  const cursorColor = isDark ? 'rgba(0,194,255,0.06)' : 'rgba(99,102,241,0.05)'

  const getBarColor = (entry: TotalPorCategoria) => {
    if (isDark) {
      return SYSTEM_CATEGORIES_DARK[entry.categoria_id] ?? entry.categoria_color
    }
    return entry.categoria_color
  }

  if (data.length === 1) {
    const cat = data[0]
    return (
      <Card variant="elevated">
        <p
          className="text-sm font-semibold uppercase tracking-wide mb-3"
          style={{ color: 'var(--text-secondary)' }}
        >
          Por categoría
        </p>
        <p className="text-base font-medium" style={{ color: getBarColor(cat) }}>
          {cat.categoria_name} · 100% del gasto del mes
        </p>
      </Card>
    )
  }

  return (
    <Card variant="elevated">
      <p
        className="text-sm font-semibold uppercase tracking-wide mb-4"
        style={{ color: 'var(--text-secondary)' }}
      >
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
            tick={{ fontSize: 12, fill: labelColor }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={<CustomTooltip theme={theme} />}
            cursor={{ fill: cursorColor }}
          />
          <Bar dataKey="total" radius={[0, 6, 6, 0]} barSize={12}>
            {data.map((entry) => (
              <Cell key={entry.categoria_id} fill={getBarColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
