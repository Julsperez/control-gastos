import { ArrowLeft, DollarSign } from 'lucide-react'
import { Link } from 'react-router-dom'
import { RegisterForm } from '../components/auth/RegisterForm'

export function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* Back button */}
      <div className="w-full max-w-sm mb-4">
        <Link
          to="/login"
          className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft size={16} />
          Volver
        </Link>
      </div>

      {/* Logo */}
      <div className="flex flex-col items-center gap-2 mb-6">
        <div className="w-12 h-12 bg-[var(--accent-primary)] rounded-xl flex items-center justify-center shadow-[var(--shadow-glow)]">
          <DollarSign size={24} className="text-[var(--btn-primary-text)]" />
        </div>
      </div>

      {/* Card del formulario */}
      <div className="w-full max-w-sm">
        <div className="glass-modal rounded-xl p-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Crear cuenta</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">Comienza a controlar tus gastos hoy</p>
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
