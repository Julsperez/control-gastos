import { create } from 'zustand'
import type { Categoria, DashboardResumen, Gasto } from '../types'
import { currentMonth } from '../types'

interface GastosState {
  dashboard: DashboardResumen | null
  gastos: Gasto[]
  categorias: Categoria[]
  isLoading: boolean
  error: string | null
  mesActual: string

  setMes: (mes: string) => void
  setDashboard: (data: DashboardResumen) => void
  setGastos: (gastos: Gasto[]) => void
  addGasto: (gasto: Gasto) => void
  removeGasto: (id: number) => void
  setCategorias: (cats: Categoria[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useGastosStore = create<GastosState>()((set) => ({
  dashboard: null,
  gastos: [],
  categorias: [],
  isLoading: false,
  error: null,
  mesActual: currentMonth(),

  setMes: (mes) => set({ mesActual: mes }),
  setDashboard: (data) => set({ dashboard: data }),
  setGastos: (gastos) => set({ gastos }),
  addGasto: (gasto) =>
    set((state) => ({ gastos: [gasto, ...state.gastos] })),
  removeGasto: (id) =>
    set((state) => ({ gastos: state.gastos.filter((g) => g.id !== id) })),
  setCategorias: (cats) => set({ categorias: cats }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      dashboard: null,
      gastos: [],
      categorias: [],
      isLoading: false,
      error: null,
      mesActual: currentMonth(),
    }),
}))
