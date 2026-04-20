import { useState, useEffect } from 'react'
import { LogOut, AlertCircle, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DashboardSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { FAB } from '../components/ui/FAB'
import { BottomSheet } from '../components/ui/BottomSheet'
import { Modal } from '../components/ui/Modal'
import { ResumenMes } from '../components/dashboard/ResumenMes'
import { GraficoBarras } from '../components/dashboard/GraficoBarras'
import { GastosList } from '../components/dashboard/GastosList'
import { BudgetWidget } from '../components/dashboard/BudgetWidget'
import { BudgetAlertBanner } from '../components/dashboard/BudgetAlertBanner'
import { GastoForm } from '../components/gastos/GastoForm'
import { useDashboard } from '../hooks/useDashboard'
import { useBudget } from '../hooks/useBudget'
import { useAuth } from '../hooks/useAuth'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/Button'

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === 'undefined' ? true : window.innerWidth < 640,
  )

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 639px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return isMobile
}

export function DashboardPage() {
  const [formOpen, setFormOpen] = useState(false)
  const { dashboard, isLoading, error, refetch } = useDashboard()
  const { budgetStatus } = useBudget()
  const { logout } = useAuth()
  const user = useAuthStore((s) => s.user)
  const isMobile = useIsMobile()
  const navigate = useNavigate()

  const initials = user?.full_name
    ? user.full_name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : user?.email?.[0].toUpperCase() ?? '?'

  function handleFormSuccess() {
    setFormOpen(false)
  }

  const hasData = dashboard && dashboard.total_mes > 0

  const today = new Date()
  const dayName = today.toLocaleDateString('es-AR', { weekday: 'long' })
  const dateStr = today.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })

  return (
    <div className="min-h-screen bg-background">
      {/* Header sticky */}
      <header className="sticky top-0 z-30 bg-surface border-b border-neutral-200 h-14 flex items-center px-4 justify-between">
        <div>
          <p className="text-base font-semibold text-neutral-900">
            Hola, {user?.full_name?.split(' ')[0] ?? 'Usuario'}
          </p>
          <p className="text-xs text-neutral-600">
            {dayName}, {dateStr}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
            <span className="text-sm font-bold text-primary">{initials}</span>
          </div>
          <button
            onClick={() => navigate('/settings')}
            aria-label="Configuración"
            className="p-2 text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={logout}
            aria-label="Cerrar sesión"
            className="p-2 text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {budgetStatus && budgetStatus.alert_level !== 'none' && (
        <BudgetAlertBanner status={budgetStatus} />
      )}

      {/* Contenido */}
      <main>
        {isLoading ? (
          <DashboardSkeleton />
        ) : error ? (
          <div className="p-4">
            <div className="flex items-center gap-3 p-4 bg-danger-light border-l-4 border-danger rounded-r-md">
              <AlertCircle size={18} className="text-danger flex-shrink-0" />
              <p className="text-sm text-neutral-900 flex-1">{error}</p>
              <Button variant="secondary" size="sm" onClick={() => void refetch()}>
                Reintentar
              </Button>
            </div>
          </div>
        ) : !hasData ? (
          <EmptyState onAction={() => setFormOpen(true)} />
        ) : (
          <>
            {/* Layout mobile: una columna */}
            <div className="lg:hidden flex flex-col gap-3 p-4 pb-24">
              <BudgetWidget status={budgetStatus} />
              <ResumenMes
                totalMes={dashboard.total_mes}
                totalMesAnterior={dashboard.total_mes_anterior}
                variacionPorcentual={dashboard.variacion_porcentual}
                mes={dashboard.mes}
              />
              {dashboard.total_por_categoria.length > 0 && (
                <GraficoBarras data={dashboard.total_por_categoria} />
              )}
              <GastosList />
            </div>

            {/* Layout desktop: dos columnas */}
            <div className="hidden lg:grid lg:grid-cols-[55%_45%] gap-8 p-8 max-w-6xl mx-auto">
              <div className="flex flex-col gap-4">
                <ResumenMes
                  totalMes={dashboard.total_mes}
                  totalMesAnterior={dashboard.total_mes_anterior}
                  variacionPorcentual={dashboard.variacion_porcentual}
                  mes={dashboard.mes}
                />
                {dashboard.total_por_categoria.length > 0 && (
                  <GraficoBarras data={dashboard.total_por_categoria} />
                )}
              </div>
              <div className="flex flex-col gap-4">
                <BudgetWidget status={budgetStatus} />
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => setFormOpen(true)}
                >
                  Registrar nuevo gasto
                </Button>
                <GastosList />
              </div>
            </div>
          </>
        )}
      </main>

      {/* FAB — solo en mobile */}
      <div className="lg:hidden" aria-hidden="true">
        <FAB isOpen={formOpen} onClick={() => setFormOpen((v) => !v)} />
      </div>

      {/* Formulario — BottomSheet en mobile, Modal en desktop */}
      {isMobile ? (
        <BottomSheet
          isOpen={formOpen}
          onClose={() => setFormOpen(false)}
          title="Registrar gasto"
        >
          <GastoForm onSuccess={handleFormSuccess} />
        </BottomSheet>
      ) : (
        <Modal
          isOpen={formOpen}
          onClose={() => setFormOpen(false)}
          title="Registrar gasto"
        >
          <GastoForm onSuccess={handleFormSuccess} />
        </Modal>
      )}
    </div>
  )
}
