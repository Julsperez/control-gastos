import { Card } from '../ui/Card'
import { GastoItem } from './GastoItem'
import { useGastosStore } from '../../store/gastosStore'
import { useGastos } from '../../hooks/useGastos'

export function GastosList() {
  const gastos = useGastosStore((s) => s.gastos)
  const { handleDeleteGasto } = useGastos()

  if (gastos.length === 0) {
    return (
      <Card variant="default">
        <p className="text-sm text-neutral-600 text-center py-4">
          No hay gastos registrados este mes
        </p>
      </Card>
    )
  }

  const recientes = gastos.slice(0, 10)

  return (
    <Card variant="default">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold uppercase tracking-wide text-neutral-700">
          Recientes
        </span>
        <span className="text-xs text-neutral-400">{gastos.length} gastos</span>
      </div>
      <div>
        {recientes.map((g) => (
          <GastoItem key={g.id} gasto={g} onDelete={handleDeleteGasto} />
        ))}
      </div>
    </Card>
  )
}
