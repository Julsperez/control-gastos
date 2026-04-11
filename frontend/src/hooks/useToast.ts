import { createContext, useContext } from 'react'
import type { ToastMessage, ToastType } from '../types'

export interface ToastContextValue {
  toasts: ToastMessage[]
  showToast: (message: string, type?: ToastType, duration?: number) => void
  dismissToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
