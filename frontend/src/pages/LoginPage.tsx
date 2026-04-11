import { DollarSign } from 'lucide-react'
import { LoginForm } from '../components/auth/LoginForm'

export function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-md">
          <DollarSign size={24} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-neutral-900">Control de Gastos</h1>
        <p className="text-sm text-neutral-600">Tu dinero, bajo control</p>
      </div>

      {/* Card del formulario */}
      <div className="w-full max-w-sm">
        <div className="bg-surface rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Iniciar sesión</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
