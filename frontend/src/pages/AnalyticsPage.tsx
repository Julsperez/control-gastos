import { TrendingUp } from 'lucide-react'

export function AnalyticsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center gap-5">
      <div className="size-20 rounded-2xl bg-[var(--accent-primary-subtle)] flex items-center justify-center">
        <TrendingUp size={36} className="text-[var(--accent-primary)]" strokeWidth={1.8} />
      </div>
      <div className="flex flex-col gap-2 max-w-xs">
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">
          Próximamente: análisis de tus gastos
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Estamos trabajando en nuevas herramientas visuales para ayudarte a entender mejor tus hábitos financieros. Vuelve pronto para ver gráficos detallados.
        </p>
      </div>
    </div>
  )
}
