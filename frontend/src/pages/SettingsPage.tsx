import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { ThemeToggle } from '../components/ui/ThemeToggle'
import { useBudget } from '../hooks/useBudget'

export function SettingsPage() {
  const navigate = useNavigate()
  const { budgetStatus, updateSettings } = useBudget()

  const [form, setForm] = useState({ budget: '', warning: '70', critical: '90' })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (budgetStatus) {
      setForm({
        budget:   budgetStatus.budget !== null ? String(budgetStatus.budget) : '',
        warning:  String(budgetStatus.alert_threshold_warning),
        critical: String(budgetStatus.alert_threshold_critical),
      })
    }
  }, [budgetStatus])

  function validate(): boolean {
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    const ok = await updateSettings({
      monthly_budget: form.budget.trim() !== '' ? Number(form.budget) : null,
      alert_threshold_warning: Number(form.warning),
      alert_threshold_critical: Number(form.critical),
    })
    setSaving(false)

    if (ok) navigate('/')
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

      <main className="max-w-lg mx-auto p-6">
        <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-6">
          <section className="glass-card rounded-xl p-5 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-[var(--text-secondary)]">Presupuesto mensual</h2>

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
      </main>
    </div>
  )
}
