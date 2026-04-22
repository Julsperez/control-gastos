import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { GastoItem } from './GastoItem'
import { useGastosStore } from '../../store/gastosStore'
import { useGastos } from '../../hooks/useGastos'
import { getGastosService } from '../../services/GastosService'

const PREVIEW_COUNT = 5

function formatMonthLabel(yyyymm: string): string {
  const [y, m] = yyyymm.split('-').map(Number)
  const label = new Date(y, m - 1, 1).toLocaleDateString('es-AR', {
    month: 'long',
    year: 'numeric',
  })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function GastosList() {
  const { gastos, mesActual, setGastos, setMes } = useGastosStore()
  const { handleDeleteGasto } = useGastos()

  const [expanded, setExpanded] = useState(false)
  const [availableMonths, setAvailableMonths] = useState<string[]>([])
  const [loadingMonths, setLoadingMonths] = useState(true)
  const [loadingGastos, setLoadingGastos] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function fetchMonths() {
      setLoadingMonths(true)
      try {
        const svc = await getGastosService()
        const months = await svc.getAvailableMonths()
        if (!cancelled) setAvailableMonths(months)
      } catch {
        // sin-op: el select mostrará solo el mes actual
      } finally {
        if (!cancelled) setLoadingMonths(false)
      }
    }
    void fetchMonths()
    return () => { cancelled = true }
  }, [])

  async function handleMonthChange(mes: string) {
    if (mes === mesActual) return
    setExpanded(false)
    setLoadingGastos(true)
    try {
      const svc = await getGastosService()
      const response = await svc.getGastos(mes)
      setGastos(response.items)
      setMes(mes)
    } catch {
      // mantener estado anterior si falla
    } finally {
      setLoadingGastos(false)
    }
  }

  const visibleGastos = expanded ? gastos : gastos.slice(0, PREVIEW_COUNT)
  const hasMore = gastos.length > PREVIEW_COUNT

  return (
    <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-default)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
        <span className="text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          Recientes
        </span>
        <select
          value={mesActual}
          onChange={(e) => void handleMonthChange(e.target.value)}
          disabled={loadingMonths}
          className="text-xs text-[var(--text-secondary)] border border-[var(--border-default)] rounded-md px-2 py-1 bg-[var(--bg-input)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary-glow)] disabled:opacity-50 cursor-pointer"
        >
          {[...new Set([mesActual, ...availableMonths])].map((m) => (
            <option key={m} value={m}>
              {formatMonthLabel(m)}
            </option>
          ))}
        </select>
      </div>

      {/* Body */}
      <div className="px-4 pb-1">
        {loadingGastos ? (
          <div className="py-4 flex flex-col gap-3">
            {Array.from({ length: PREVIEW_COUNT }).map((_, i) => (
              <div key={i} className="h-10 bg-[var(--bg-skeleton)] rounded animate-pulse" />
            ))}
          </div>
        ) : gastos.length === 0 ? (
          <p className="text-sm text-[var(--text-tertiary)] text-center py-6">
            No hay gastos en este período
          </p>
        ) : (
          <>
            <div>
              {visibleGastos.map((g) => (
                <GastoItem key={g.id} gasto={g} onDelete={handleDeleteGasto} />
              ))}
            </div>

            {hasMore && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-[var(--accent-primary)] hover:opacity-80 transition-opacity border-t border-[var(--border-subtle)]"
              >
                {expanded ? (
                  <>
                    <ChevronUp size={14} />
                    Ver menos
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} />
                    Ver todos ({gastos.length} gastos)
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
