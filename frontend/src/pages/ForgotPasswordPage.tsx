import { type FormEvent, useState } from 'react'
import { DollarSign, AlertCircle, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { getGastosService } from '../services/GastosService'
import type { ValidationState } from '../types'

interface FieldState {
  value: string
  error: string
  validationState: ValidationState
  touched: boolean
}

function initField(): FieldState {
  return { value: '', error: '', validationState: null, touched: false }
}

function validateEmail(v: string): string {
  if (!v) return 'Ingresa tu email'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Ingresa un email válido'
  return ''
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState<FieldState>(() => initField())
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [networkError, setNetworkError] = useState<string | null>(null)

  function handleChange(value: string) {
    const err = email.touched ? validateEmail(value) : ''
    setEmail({ value, error: err, validationState: email.touched ? (err ? 'error' : 'valid') : null, touched: email.touched })
    setNetworkError(null)
  }

  function handleBlur() {
    const err = validateEmail(email.value)
    setEmail(prev => ({ ...prev, touched: true, error: err, validationState: err ? 'error' : 'valid' }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const err = validateEmail(email.value)
    if (err) {
      setEmail(prev => ({ ...prev, touched: true, error: err, validationState: 'error' }))
      return
    }
    setIsLoading(true)
    setNetworkError(null)
    try {
      const svc = await getGastosService()
      await svc.forgotPassword(email.value)
      setSubmitted(true)
    } catch (error: unknown) {
      if (isAxiosError(error) && !error.response) {
        setNetworkError('No se pudo conectar. Verifica tu conexión e intenta de nuevo.')
      } else {
        // Mostrar mensaje genérico igual que si el email no existe
        setSubmitted(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="size-12 bg-[var(--accent-primary)] rounded-xl flex items-center justify-center shadow-[var(--shadow-glow)]">
          <DollarSign size={24} className="text-[var(--btn-primary-text)]" />
        </div>
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">Control de Gastos</h1>
        <p className="text-sm text-[var(--text-secondary)]">Tu dinero, bajo control</p>
      </div>

      <div className="w-full max-w-sm">
        <div className="glass-modal rounded-xl p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Recuperar contraseña</h2>

          {submitted ? (
            <div className="flex flex-col gap-4">
              <div
                role="status"
                className="flex items-start gap-2 p-3 bg-[var(--accent-success-subtle,#f0fdf4)] border-l-[3px] border-[var(--accent-success,#22c55e)] rounded-r-md"
              >
                <CheckCircle size={16} className="text-[var(--accent-success,#22c55e)] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[var(--text-primary)]">
                  Si el correo está registrado, recibirás un enlace en los próximos minutos. Revisa también tu carpeta de spam.
                </p>
              </div>
              <p className="text-center text-sm text-[var(--text-secondary)]">
                <Link to="/login" className="text-[var(--accent-primary)] font-medium hover:underline">
                  ← Volver al inicio de sesión
                </Link>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <p className="text-sm text-[var(--text-secondary)]">
                Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
              </p>

              <Input
                label="Email"
                type="email"
                value={email.value}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                error={email.error}
                validationState={email.validationState}
                placeholder="tu@email.com"
                autoComplete="email"
                required
                disabled={isLoading}
              />

              {networkError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 p-3 bg-[var(--accent-danger-subtle)] border-l-[3px] border-[var(--accent-danger)] rounded-r-md"
                >
                  <AlertCircle size={16} className="text-[var(--accent-danger)] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[var(--text-primary)]">{networkError}</p>
                </div>
              )}

              <Button type="submit" variant="primary" size="lg" isLoading={isLoading} fullWidth>
                {isLoading ? 'Enviando…' : 'Enviar enlace'}
              </Button>

              <p className="text-center text-sm text-[var(--text-secondary)]">
                <Link to="/login" className="text-[var(--accent-primary)] font-medium hover:underline">
                  ← Volver al inicio de sesión
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
