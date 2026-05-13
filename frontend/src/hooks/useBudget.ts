import { useCallback, useEffect } from 'react'
import type { BudgetSettings } from '../types'
import { getGastosService } from '../services/GastosService'
import { useBudgetStore } from '../store/budgetStore'
import { useGastosStore } from '../store/gastosStore'
import { useToast } from './useToast'

export function useBudget() {
  const { budgetStatus, isLoading, setBudgetStatus, setLoading } = useBudgetStore()
  const mesActual = useGastosStore((s) => s.mesActual)
  const { showToast } = useToast()

  const refetch = useCallback(async () => {
    setLoading(true)
    try {
      const svc = await getGastosService()
      const status = await svc.getBudgetStatus(mesActual)
      setBudgetStatus(status)
    } catch {
      showToast('No se pudo cargar el presupuesto', 'error')
    } finally {
      setLoading(false)
    }
  }, [mesActual, setBudgetStatus, setLoading, showToast])

  useEffect(() => {
    void refetch()
  }, [refetch])

  const updateSettings = useCallback(async (settings: BudgetSettings): Promise<boolean> => {
    try {
      const svc = await getGastosService()
      const status = await svc.updateBudgetSettings(settings)
      setBudgetStatus(status)
      showToast('Presupuesto actualizado', 'success')
      return true
    } catch {
      showToast('No se pudo guardar la configuración', 'error')
      return false
    }
  }, [setBudgetStatus, showToast])

  const setMonthlyBudget = useCallback(async (mes: string, amount: number | null): Promise<boolean> => {
    try {
      const svc = await getGastosService()
      const status = await svc.setMonthlyBudget(mes, amount)
      if (mes === mesActual) setBudgetStatus(status)
      showToast(amount === null ? 'Presupuesto del mes eliminado' : 'Presupuesto del mes guardado', 'success')
      return true
    } catch {
      showToast('No se pudo guardar el presupuesto del mes', 'error')
      return false
    }
  }, [mesActual, setBudgetStatus, showToast])

  return { budgetStatus, isLoading, refetch, updateSettings, setMonthlyBudget }
}
