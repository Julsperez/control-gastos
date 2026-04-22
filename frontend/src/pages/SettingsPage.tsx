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

  const [budget, setBudget] = useState('')
  const [warning, setWarning] = useState('70')
  const [critical, setCritical] = useState('90')
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (budgetStatus) {
      setBudget(budgetStatus.budget !== null ? String(budgetStatus.budget) : '')
      setWarning(String(budgetStatus.alert_threshold_warning))
      setCritical(String(budgetStatus.alert_threshold_critical))
    }
  }, [budgetStatus])

  function validate(): boolean {
    const errs: Record<string, string> = {}
    const w = Number(warning)
    const c = Number(critical)
    const b = budget.trim() !== '' ? Number(budget) : null

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
      monthly_budget: budget.trim() !== '' ? Number(budget) : null,
      alert_threshold_warning: Number(warning),
      alert_threshold_critical: Number(critical),
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
              <label className="block text-sm text-[var(--text-secondary)] mb-1">
                Monto del presupuesto mensual
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Sin límite"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                validationState={errors.budget ? 'error' : null}
              />
              {errors.budget && <p className="text-xs text-[var(--text-error)] mt-1">{errors.budget}</p>}
              <p className="text-xs text-[var(--text-tertiary)] mt-1">Dejá vacío para no tener presupuesto</p>
            </div>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">
                Umbral de advertencia (%)
              </label>
              <Input
                type="number"
                min="1"
                max="99"
                value={warning}
                onChange={(e) => setWarning(e.target.value)}
                validationState={errors.warning ? 'error' : null}
              />
              {errors.warning && <p className="text-xs text-[var(--text-error)] mt-1">{errors.warning}</p>}
            </div>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">
                Umbral crítico (%)
              </label>
              <Input
                type="number"
                min="2"
                max="100"
                value={critical}
                onChange={(e) => setCritical(e.target.value)}
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
