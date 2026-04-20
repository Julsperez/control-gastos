import { create } from 'zustand'
import type { BudgetSettings, BudgetStatus } from '../types'

interface BudgetState {
  budgetStatus: BudgetStatus | null
  settings: BudgetSettings | null
  isLoading: boolean
  setBudgetStatus: (status: BudgetStatus) => void
  setSettings: (settings: BudgetSettings) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useBudgetStore = create<BudgetState>((set) => ({
  budgetStatus: null,
  settings: null,
  isLoading: false,
  setBudgetStatus: (status) => set({ budgetStatus: status }),
  setSettings: (settings) => set({ settings }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ budgetStatus: null, settings: null, isLoading: false }),
}))
