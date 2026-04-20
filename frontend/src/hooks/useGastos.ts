import { useState } from 'react'
import { getGastosService } from '../services/GastosService'
import { useGastosStore } from '../store/gastosStore'
import { useBudgetStore } from '../store/budgetStore'
import { useToast } from './useToast'
import type { GastoCreate } from '../types'

export function useGastos(onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { addGasto, removeGasto, setDashboard, mesActual } = useGastosStore()
  const { setBudgetStatus } = useBudgetStore()
  const { showToast } = useToast()

  async function handleAddGasto(data: GastoCreate): Promise<boolean> {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const svc = await getGastosService()
      const newGasto = await svc.addGasto(data)
      addGasto(newGasto)

      // Refrescar dashboard y presupuesto en paralelo
      const [dashboard, budgetStatus] = await Promise.all([
        svc.getDashboardData(mesActual),
        svc.getBudgetStatus(mesActual),
      ])
      setDashboard(dashboard)
      setBudgetStatus(budgetStatus)

      showToast('Gasto registrado', 'success', 2500)
      onSuccess?.()
      return true
    } catch {
      setSubmitError('No pudimos guardar el gasto. Verifica tu conexión e intenta de nuevo.')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteGasto(id: number): Promise<void> {
    try {
      const svc = await getGastosService()
      await svc.deleteGasto(id)
      removeGasto(id)

      // Refrescar dashboard y presupuesto en paralelo
      const [dashboard, budgetStatus] = await Promise.all([
        svc.getDashboardData(mesActual),
        svc.getBudgetStatus(mesActual),
      ])
      setDashboard(dashboard)
      setBudgetStatus(budgetStatus)
    } catch {
      showToast('Error al eliminar el gasto.', 'error')
    }
  }

  return { handleAddGasto, handleDeleteGasto, isSubmitting, submitError, setSubmitError }
}
