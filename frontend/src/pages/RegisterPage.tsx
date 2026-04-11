import { ArrowLeft, DollarSign } from 'lucide-react'
import { Link } from 'react-router-dom'
import { RegisterForm } from '../components/auth/RegisterForm'

export function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      {/* Back button */}
      <div className="w-full max-w-sm mb-4">
        <Link
          to="/login"
          className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver
        </Link>
      </div>

      {/* Logo */}
      <div className="flex flex-col items-center gap-2 mb-6">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-md">
          <DollarSign size={24} className="text-white" />
        </div>
      </div>

      {/* Card del formulario */}
      <div className="w-full max-w-sm">
        <div className="bg-surface rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-neutral-900 mb-1">Crear cuenta</h2>
          <p className="text-sm text-neutral-600 mb-6">Comienza a controlar tus gastos hoy</p>
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
