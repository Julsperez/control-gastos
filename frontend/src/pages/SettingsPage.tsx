import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { ThemeToggle } from '../components/ui/ThemeToggle'
import { useBudget } from '../hooks/useBudget'
import { getGastosService } from '../services/GastosService'
import type { MonthlyBudgetEntry } from '../types'
import { formatMonthLabel } from '../types'

export function SettingsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { budgetStatus, updateSettings, setMonthlyBudget } = useBudget()

  // ──────────────────────────────────────────────
  // Sección 1: Presupuesto por defecto
  // ──────────────────────────────────────────────
  const [form, setForm] = useState({ budget: '', warning: '70', critical: '90' })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (budgetStatus) {
      setForm({
        budget:   budgetStatus.budget !== null && !budgetStatus.has_monthly_override
          ? String(budgetStatus.budget)
          : '',
        warning:  String(budgetStatus.alert_threshold_warning),
        critical: String(budgetStatus.alert_threshold_critical),
      })
    }
  }, [budgetStatus])

  function validateDefault(): boolean {
    const errs: Record<string, string> = {}
    const w = Number(form.warning)
    const c = Number(form.critical)
    const b = form.budget.trim() !== '' ? Number(form.budget) : null

    if (b !== null && (isNaN(b) || b <= 0)) errs.budget = 'Debe ser un número positivo'
    if (isNaN(w) || w < 1 || w > 99) errs.warning = 'Debe estar entre 1 y 99'
    if (isNaN(c) || c < 2 || c > 100) errs.critical = 'Debe estar entre 2 y 100'
    if (!errs.warning && !errs.critical && w >= c) {
      errs.warning = 'El umbral de advertencia debe ser menor al crítico'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmitDefault(e: React.FormEvent) {
    e.preventDefault()
    if (!validateDefault()) return

    setSaving(true)
    const ok = await updateSettings({
      monthly_budget: form.budget.trim() !== '' ? Number(form.budget) : null,
      alert_threshold_warning: Number(form.warning),
      alert_threshold_critical: Number(form.critical),
    })
    setSaving(false)

    if (ok) navigate('/')
  }

  // ──────────────────────────────────────────────
  // Sección 2: Presupuestos por mes
  // ──────────────────────────────────────────────
  const mesFromUrl = searchParams.get('mes') ?? ''
  const todayYYYYMM = new Date().toISOString().slice(0, 7)

  const [monthlyList, setMonthlyList] = useState<MonthlyBudgetEntry[]>([])
  const [loadingMonthly, setLoadingMonthly] = useState(false)
  const [monthForm, setMonthForm] = useState({ mes: mesFromUrl || todayYYYYMM, amount: '' })
  const [monthErrors, setMonthErrors] = useState<Record<string, string>>({})
  const [savingMonth, setSavingMonth] = useState(false)
  const [deletingMes, setDeletingMes] = useState<string | null>(null)

  const fetchMonthlyBudgets = useCallback(async () => {
    setLoadingMonthly(true)
    try {
      const svc = await getGastosService()
      const list = await svc.getMonthlyBudgets()
      setMonthlyList(list)
    } finally {
      setLoadingMonthly(false)
    }
  }, [])

  useEffect(() => {
    void fetchMonthlyBudgets()
  }, [fetchMonthlyBudgets])

  // Pre-rellenar el amount si el mes del URL ya tiene override en la lista
  useEffect(() => {
    if (mesFromUrl && monthlyList.length > 0) {
      const existing = monthlyList.find((e) => e.mes === mesFromUrl)
      if (existing) {
        setMonthForm((prev) => ({ ...prev, amount: String(existing.amount) }))
      }
    }
  }, [mesFromUrl, monthlyList])

  function validateMonth(): boolean {
    const errs: Record<string, string> = {}
    if (!monthForm.mes) errs.mes = 'Seleccioná un mes'
    const a = Number(monthForm.amount)
    if (!monthForm.amount.trim() || isNaN(a) || a <= 0) errs.amount = 'Debe ser un número positivo'
    setMonthErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSaveMonth(e: React.FormEvent) {
    e.preventDefault()
    if (!validateMonth()) return
    setSavingMonth(true)
    const ok = await setMonthlyBudget(monthForm.mes, Number(monthForm.amount))
    setSavingMonth(false)
    if (ok) {
      await fetchMonthlyBudgets()
      setMonthForm((prev) => ({ ...prev, amount: '' }))
    }
  }

  async function handleDeleteMonth(mes: string) {
    setDeletingMes(mes)
    await setMonthlyBudget(mes, null)
    setDeletingMes(null)
    await fetchMonthlyBudgets()
  }

  function handleEditMonth(entry: MonthlyBudgetEntry) {
    setMonthForm({ mes: entry.mes, amount: String(entry.amount) })
    window.scrollTo({ top: document.getElementById('monthly-form-section')?.offsetTop ?? 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen">
      <header className="glass-header sticky top-0 z-30 h-14 flex items-center px-4 gap-3">
        <button
          onClick={() => navigate('/')}
          className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Volver al dashboard"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-base font-semibold text-[var(--text-primary)] flex-1">Configuración</h1>
        <ThemeToggle />
      </header>

      <main className="max-w-lg mx-auto p-6 flex flex-col gap-6">

        {/* ── Sección 1: Presupuesto por defecto ── */}
        <form onSubmit={(e) => void handleSubmitDefault(e)} className="flex flex-col gap-6">
          <section className="glass-card rounded-xl p-5 flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-semibold text-[var(--text-secondary)]">Presupuesto por defecto</h2>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                Se aplica a los meses sin presupuesto específico configurado.
              </p>
            </div>

            <div>
              <Input
                label="Monto del presupuesto mensual"
                hint="Dejá vacío para no tener presupuesto"
                type="number"
                min="0"
                step="0.01"
                placeholder="Sin límite"
                value={form.budget}
                onChange={(e) => setForm(prev => ({ ...prev, budget: e.target.value }))}
                validationState={errors.budget ? 'error' : null}
              />
              {errors.budget && <p className="text-xs text-[var(--text-error)] mt-1">{errors.budget}</p>}
            </div>

            <div>
              <Input
                label="Umbral de advertencia (%)"
                type="number"
                min="1"
                max="99"
                value={form.warning}
                onChange={(e) => setForm(prev => ({ ...prev, warning: e.target.value }))}
                validationState={errors.warning ? 'error' : null}
              />
              {errors.warning && <p className="text-xs text-[var(--text-error)] mt-1">{errors.warning}</p>}
            </div>

            <div>
              <Input
                label="Umbral crítico (%)"
                type="number"
                min="2"
                max="100"
                value={form.critical}
                onChange={(e) => setForm(prev => ({ ...prev, critical: e.target.value }))}
                validationState={errors.critical ? 'error' : null}
              />
              {errors.critical && <p className="text-xs text-[var(--text-error)] mt-1">{errors.critical}</p>}
            </div>
          </section>

          <Button type="submit" variant="primary" size="md" fullWidth disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar configuración'}
          </Button>
        </form>

        {/* ── Sección 2: Presupuestos por mes ── */}
        <section id="monthly-form-section" className="glass-card rounded-xl p-5 flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-secondary)]">Presupuesto por mes</h2>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
              Definí un límite específico para un mes en particular.
            </p>
          </div>

          <form onSubmit={(e) => void handleSaveMonth(e)} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Mes</label>
              <input
                type="month"
                value={monthForm.mes}
                onChange={(e) => setMonthForm(prev => ({ ...prev, mes: e.target.value }))}
                className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              />
              {monthErrors.mes && <p className="text-xs text-[var(--text-error)] mt-1">{monthErrors.mes}</p>}
            </div>

            <div>
              <Input
                label="Monto del presupuesto"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Ej: 150000"
                value={monthForm.amount}
                onChange={(e) => setMonthForm(prev => ({ ...prev, amount: e.target.value }))}
                validationState={monthErrors.amount ? 'error' : null}
              />
              {monthErrors.amount && <p className="text-xs text-[var(--text-error)] mt-1">{monthErrors.amount}</p>}
            </div>

            <Button type="submit" variant="primary" size="md" fullWidth disabled={savingMonth}>
              {savingMonth ? 'Guardando…' : 'Guardar presupuesto del mes'}
            </Button>
          </form>

          {/* Lista de overrides configurados */}
          {loadingMonthly ? (
            <div className="flex flex-col gap-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-10 bg-[var(--bg-skeleton)] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : monthlyList.length > 0 ? (
            <div className="flex flex-col gap-1 mt-1">
              <p className="text-xs font-medium text-[var(--text-tertiary)] mb-1">Configurados</p>
              {monthlyList.map((entry) => (
                <div
                  key={entry.mes}
                  className="flex items-center justify-between gap-2 py-2 px-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-default)]"
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{formatMonthLabel(entry.mes)}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(entry.amount)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditMonth(entry)}
                      className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors"
                      aria-label={`Editar presupuesto de ${formatMonthLabel(entry.mes)}`}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => void handleDeleteMonth(entry.mes)}
                      disabled={deletingMes === entry.mes}
                      className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--accent-danger)] transition-colors disabled:opacity-50"
                      aria-label={`Eliminar presupuesto de ${formatMonthLabel(entry.mes)}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--text-tertiary)] text-center py-2">
              No hay presupuestos por mes configurados.
            </p>
          )}
        </section>
      </main>
    </div>
  )
}
