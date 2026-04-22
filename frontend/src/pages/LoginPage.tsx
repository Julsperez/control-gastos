import { DollarSign } from 'lucide-react'
import { LoginForm } from '../components/auth/LoginForm'

export function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="w-12 h-12 bg-[var(--accent-primary)] rounded-xl flex items-center justify-center shadow-[var(--shadow-glow)]">
          <DollarSign size={24} className="text-[var(--btn-primary-text)]" />
        </div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Control de Gastos</h1>
        <p className="text-sm text-[var(--text-secondary)]">Tu dinero, bajo control</p>
      </div>

      {/* Card del formulario */}
      <div className="w-full max-w-sm">
        <div className="glass-modal rounded-xl p-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Iniciar sesión</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
