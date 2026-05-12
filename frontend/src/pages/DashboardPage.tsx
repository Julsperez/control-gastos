import { useState, useEffect, useRef } from 'react'
import type { Gasto } from '../types'
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
import { GastoForm, type GastoFormHandle } from '../components/gastos/GastoForm'
import { useDashboard } from '../hooks/useDashboard'
import { useBudget } from '../hooks/useBudget'
import { useAuth } from '../hooks/useAuth'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/Button'
import { ThemeToggle } from '../components/ui/ThemeToggle'

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
  const [editingGasto, setEditingGasto] = useState<Gasto | null>(null)
  const isFormOpen = formOpen || editingGasto !== null
  const { dashboard, isLoading, error, refetch } = useDashboard()
  const { budgetStatus } = useBudget()
  const { logout } = useAuth()
  const user = useAuthStore((s) => s.user)
  const isMobile = useIsMobile()
  const navigate = useNavigate()

  const initials = user?.full_name
    ? user.full_name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : user?.email?.[0].toUpperCase() ?? '?'

  function handleFormClose() {
    setFormOpen(false)
    setEditingGasto(null)
  }

  function handleFormSuccess() {
    handleFormClose()
  }

  function handleEditGasto(gasto: Gasto) {
    setEditingGasto(gasto)
    setFormOpen(false)
  }

  const formTitle = editingGasto ? 'Editar gasto' : 'Registrar gasto'

  // Ref para acceder al submit del GastoForm desde el footer sticky del BottomSheet
  const gastoFormRef = useRef<GastoFormHandle>(null)

  const hasData = dashboard && dashboard.total_mes > 0

  const today = new Date()
  const dayName = today.toLocaleDateString('es-AR', { weekday: 'long' })
  const dateStr = today.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })

  return (
    <div className="min-h-screen">
      {/* Header sticky */}
      <header className="glass-header sticky top-0 z-30 h-14 flex items-center px-4 justify-between">
        <div>
          <p className="text-base font-semibold text-[var(--text-primary)]">
            Hola, {user?.full_name?.split(' ')[0] ?? 'Usuario'}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            {dayName}, {dateStr}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--accent-primary-subtle)] flex items-center justify-center">
            <span className="text-sm font-bold text-[var(--accent-primary)]">{initials}</span>
          </div>
          <ThemeToggle />
          <button
            onClick={() => navigate('/settings')}
            aria-label="Configuración"
            className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={logout}
            aria-label="Cerrar sesión"
            className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
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
            <div className="flex items-center gap-3 p-4 bg-[var(--accent-danger-subtle)] border-l-[3px] border-[var(--accent-danger)] rounded-r-md">
              <AlertCircle size={18} className="text-[var(--accent-danger)] flex-shrink-0" />
              <p className="text-sm text-[var(--text-primary)] flex-1">{error}</p>
              <Button variant="secondary" size="sm" onClick={() => void refetch()}>
                Reintentar
              </Button>
            </div>
          </div>
        ) : !hasData ? (
          <EmptyState onAction={() => { setFormOpen(true); setEditingGasto(null) }} />
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
              <GastosList onEdit={handleEditGasto} />
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
                  onClick={() => { setFormOpen(true); setEditingGasto(null) }}
                >
                  Registrar nuevo gasto
                </Button>
                <GastosList onEdit={handleEditGasto} />
              </div>
            </div>
          </>
        )}
      </main>

      {/* FAB — solo en mobile */}
      <div className="lg:hidden" aria-hidden="true">
        <FAB isOpen={isFormOpen} onClick={() => { setEditingGasto(null); setFormOpen((v) => !v) }} />
      </div>

      {/* Formulario — BottomSheet en mobile, Modal en desktop */}
      {isMobile ? (
        <BottomSheet
          isOpen={isFormOpen}
          onClose={handleFormClose}
          title={formTitle}
          footer={
            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={gastoFormRef.current?.isSubmitting ?? false}
              onClick={() => gastoFormRef.current?.submit()}
            >
              {gastoFormRef.current?.isSubmitting
                ? (editingGasto ? 'Guardando cambios…' : 'Guardando…')
                : (editingGasto ? 'Guardar cambios' : 'Guardar gasto')}
            </Button>
          }
        >
          <GastoForm
            ref={gastoFormRef}
            onSuccess={handleFormSuccess}
            initialValues={editingGasto ?? undefined}
            hideSubmit
          />
        </BottomSheet>
      ) : (
        <Modal
          isOpen={isFormOpen}
          onClose={handleFormClose}
          title={formTitle}
        >
          <GastoForm onSuccess={handleFormSuccess} initialValues={editingGasto ?? undefined} />
        </Modal>
      )}
    </div>
  )
}
