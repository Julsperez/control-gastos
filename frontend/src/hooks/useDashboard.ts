import { useCallback, useEffect } from 'react'
import { getGastosService } from '../services/GastosService'
import { useGastosStore } from '../store/gastosStore'

export function useDashboard() {
  const { mesActual, setDashboard, setGastos, setCategorias, setLoading, setError, isLoading, error, dashboard } =
    useGastosStore()

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const svc = await getGastosService()
      const [dashboardData, categorias, gastosResponse] = await Promise.all([
        svc.getDashboardData(mesActual),
        svc.getCategorias(),
        svc.getGastos(mesActual),
      ])
      setDashboard(dashboardData)
      setCategorias(categorias)
      setGastos(gastosResponse.items)
    } catch {
      setError('No pudimos cargar tus datos. Revisa tu conexión.')
    } finally {
      setLoading(false)
    }
  }, [mesActual, setDashboard, setGastos, setCategorias, setLoading, setError])

  useEffect(() => {
    void fetchDashboard()
  }, [fetchDashboard])

  return { dashboard, isLoading, error, refetch: fetchDashboard, mesActual }
}
