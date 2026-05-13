import { useNavigate } from 'react-router-dom'
import { Wallet, CreditCard, Palette, Bell, ChevronRight } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export function SettingsHubPage() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  const today = new Date()
  const dayName = today.toLocaleDateString('es-AR', { weekday: 'long' })
  const dateStr = today.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })

  return (
    <div className="min-h-screen">
      {/* Header sticky */}
      <header className="glass-header sticky top-0 z-30 h-14 flex items-center px-4">
        <div>
          <h1 className="text-base font-semibold text-[var(--text-primary)]">Settings &amp; Support</h1>
          <p className="text-xs text-[var(--text-secondary)] capitalize">{dayName}, {dateStr}</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 flex flex-col gap-6 pb-8">

        {/* Sección: Ajustes generales */}
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)] px-1 mb-2">
            Ajustes generales
          </p>
          <div className="glass-card rounded-xl overflow-hidden divide-y divide-[var(--border-subtle)]">
            <button
              onClick={() => navigate('/settings/budget')}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[var(--bg-card-hover)] transition-colors text-left"
            >
              <span className="size-8 rounded-lg bg-[var(--accent-success-subtle,#d1fae5)] flex items-center justify-center flex-shrink-0">
                <Wallet size={16} className="text-[var(--accent-success,#059669)]" />
              </span>
              <span className="flex-1 text-sm font-medium text-[var(--text-primary)]">Presupuestos</span>
              <ChevronRight size={16} className="text-[var(--text-tertiary)]" />
            </button>

            <div className="w-full flex items-center gap-3 px-4 py-3.5 opacity-50 cursor-not-allowed text-left">
              <span className="size-8 rounded-lg bg-[var(--accent-warning-subtle,#fef3c7)] flex items-center justify-center flex-shrink-0">
                <CreditCard size={16} className="text-[var(--accent-warning,#d97706)]" />
              </span>
              <span className="flex-1 text-sm font-medium text-[var(--text-primary)]">Métodos de pago</span>
              <span className="text-[10px] text-[var(--text-tertiary)] font-medium uppercase tracking-wide">Próximamente</span>
            </div>
          </div>
        </section>

        {/* Sección: Personalización */}
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)] px-1 mb-2">
            Personalización
          </p>
          <div className="glass-card rounded-xl overflow-hidden divide-y divide-[var(--border-subtle)]">
            {/* Apariencia — toggle inline */}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <span className="size-8 rounded-lg bg-[var(--accent-primary-subtle)] flex items-center justify-center flex-shrink-0">
                <Palette size={16} className="text-[var(--accent-primary)]" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)]">Apariencia</p>
                <p className="text-xs text-[var(--text-tertiary)]">{isDark ? 'Modo oscuro' : 'Modo claro'}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer" aria-label="Alternar modo oscuro">
                <input
                  type="checkbox"
                  role="switch"
                  checked={isDark}
                  onChange={toggleTheme}
                  className="sr-only peer"
                />
                <span className="w-10 h-6 bg-[var(--border-default)] peer-checked:bg-[var(--accent-primary)] rounded-full transition-colors duration-200 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-[18px] after:w-[18px] after:transition-transform after:duration-200 peer-checked:after:translate-x-4" />
              </label>
            </div>

            {/* Notificaciones — placeholder */}
            <div className="w-full flex items-center gap-3 px-4 py-3.5 opacity-50 cursor-not-allowed text-left">
              <span className="size-8 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center flex-shrink-0">
                <Bell size={16} className="text-[var(--text-secondary)]" />
              </span>
              <span className="flex-1 text-sm font-medium text-[var(--text-primary)]">Notificaciones</span>
              <span className="text-[10px] text-[var(--text-tertiary)] font-medium uppercase tracking-wide">Próximamente</span>
            </div>
          </div>
        </section>

      </main>

      {/* Footer crédito */}
      <footer className="py-4 text-center text-xs text-[var(--text-tertiary)]">
        Coded with love by{' '}
        <a
          href="https://github.com/Julsperez"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent-primary)] font-medium hover:underline"
        >
          Julsperez
        </a>
        , powered by AI
      </footer>
    </div>
  )
}
