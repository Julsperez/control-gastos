import { useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react'
import type { ToastMessage } from '../../types'
import { useToast } from '../../hooks/useToast'

interface ToastItemProps {
  toast: ToastMessage
}

const iconMap = {
  success: <CheckCircle size={16} />,
  error: <XCircle size={16} />,
  warning: <AlertTriangle size={16} />,
}

const colorMap = {
  success: 'bg-success text-white',
  error: 'bg-danger text-white',
  warning: 'bg-warning text-white',
}

function ToastItem({ toast }: ToastItemProps) {
  const { dismissToast } = useToast()
  const duration = toast.duration ?? 2500

  useEffect(() => {
    const t = setTimeout(() => dismissToast(toast.id), duration)
    return () => clearTimeout(t)
  }, [toast.id, duration, dismissToast])

  return (
    <div
      role="alert"
      aria-live="polite"
      className={[
        'flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg',
        'text-sm font-medium',
        'animate-slide-down',
        colorMap[toast.type],
      ].join(' ')}
    >
      {iconMap[toast.type]}
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => dismissToast(toast.id)}
        aria-label="Cerrar notificación"
        className="opacity-75 hover:opacity-100 transition-opacity"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const { toasts } = useToast()
  if (toasts.length === 0) return null

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm"
      aria-label="Notificaciones"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  )
}
