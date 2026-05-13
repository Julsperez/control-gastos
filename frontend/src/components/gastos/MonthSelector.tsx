import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useGastosStore } from '../../store/gastosStore'
import { getGastosService } from '../../services/GastosService'
import { formatMonthLabel } from '../../types'

export function MonthSelector() {
  const { mesActual, setGastos, setMes } = useGastosStore()
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

  const months = [...new Set([mesActual, ...availableMonths])]

  return (
    <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
      <div className="relative inline-flex items-center gap-1.5">
        <select
          value={mesActual}
          onChange={(e) => void handleMonthChange(e.target.value)}
          disabled={loadingMonths || loadingGastos}
          className="appearance-none text-lg font-semibold text-[var(--text-primary)] bg-transparent border-none pr-6 pl-0 focus:outline-none focus:ring-0 cursor-pointer disabled:opacity-50"
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {formatMonthLabel(m)}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
        />
        {loadingGastos && (
          <span className="ml-2 w-3.5 h-3.5 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    </div>
  )
}
