import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { GastoItem } from './GastoItem'
import { useGastosStore } from '../../store/gastosStore'
import { useGastos } from '../../hooks/useGastos'
import type { Gasto } from '../../types'

const PREVIEW_COUNT = 5

interface GastosListProps {
  onEdit: (gasto: Gasto) => void
}

export function GastosList({ onEdit }: GastosListProps) {
  const { gastos } = useGastosStore()
  const { handleDeleteGasto } = useGastos()
  const [expanded, setExpanded] = useState(false)

  const visibleGastos = expanded ? gastos : gastos.slice(0, PREVIEW_COUNT)
  const hasMore = gastos.length > PREVIEW_COUNT

  return (
    <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-default)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
        <span className="text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          Recientes
        </span>
      </div>

      {/* Body */}
      <div className="px-4 pb-1">
        {gastos.length === 0 ? (
          <p className="text-sm text-[var(--text-tertiary)] text-center py-6">
            No hay gastos en este período
          </p>
        ) : (
          <>
            <div>
              {visibleGastos.map((g) => (
                <GastoItem key={g.id} gasto={g} onDelete={handleDeleteGasto} onEdit={onEdit} />
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
