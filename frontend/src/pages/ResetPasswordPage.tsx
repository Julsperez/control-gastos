import { type FormEvent, useState } from 'react'
import { DollarSign, AlertCircle } from 'lucide-react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { getGastosService } from '../services/GastosService'
import { useToast } from '../hooks/useToast'
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

function validatePassword(v: string): string {
  if (v.length < 8 || !/\d/.test(v))
    return 'La contraseña debe tener al menos 8 caracteres y un número'
  return ''
}

function validateConfirm(v: string, pwd: string): string {
  if (v !== pwd) return 'Las contraseñas no coinciden'
  return ''
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') as string | null

  const [password, setPassword] = useState<FieldState>(() => initField())
  const [confirm, setConfirm] = useState<FieldState>(() => initField())
  const [isLoading, setIsLoading] = useState(false)
  const [tokenError, setTokenError] = useState(false)

  const { showToast } = useToast()
  const navigate = useNavigate()

  if (!token) return <Navigate to="/forgot-password" replace />

  function changeField(
    value: string,
    field: FieldState,
    setField: (f: FieldState) => void,
    validate: (v: string) => string,
  ) {
    const err = field.touched ? validate(value) : ''
    setField({ ...field, value, error: err, validationState: field.touched ? (err ? 'error' : 'valid') : null })
  }

  function blurField(
    field: FieldState,
    setField: (f: FieldState) => void,
    validate: (v: string) => string,
  ) {
    const err = validate(field.value)
    setField({ ...field, touched: true, error: err, validationState: err ? 'error' : 'valid' })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const pwdErr = validatePassword(password.value)
    const confErr = validateConfirm(confirm.value, password.value)

    setPassword(f => ({ ...f, error: pwdErr, validationState: pwdErr ? 'error' : 'valid', touched: true }))
    setConfirm(f => ({ ...f, error: confErr, validationState: confErr ? 'error' : 'valid', touched: true }))
    if (pwdErr || confErr) return

    setIsLoading(true)
    setTokenError(false)
    try {
      const svc = await getGastosService()
      await svc.resetPassword(token!, password.value)
      showToast('Contraseña restablecida. Por favor inicia sesión.', 'success', 4000)
      navigate('/login')
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 400) {
        setTokenError(true)
      } else {
        showToast('Error inesperado. Intenta de nuevo.', 'error')
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
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Nueva contraseña</h2>

          {tokenError ? (
            <div className="flex flex-col gap-4">
              <div
                role="alert"
                className="flex items-start gap-2 p-3 bg-[var(--accent-danger-subtle)] border-l-[3px] border-[var(--accent-danger)] rounded-r-md"
              >
                <AlertCircle size={16} className="text-[var(--accent-danger)] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[var(--text-primary)]">
                  El enlace expiró o ya fue utilizado.{' '}
                  <Link to="/forgot-password" className="font-medium underline">
                    Solicita uno nuevo
                  </Link>
                  .
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <p className="text-sm text-[var(--text-secondary)]">
                Elige una contraseña segura con al menos 8 caracteres y un número.
              </p>

              <Input
                label="Nueva contraseña"
                type="password"
                value={password.value}
                onChange={(e) => changeField(e.target.value, password, setPassword, validatePassword)}
                onBlur={() => blurField(password, setPassword, validatePassword)}
                error={password.error}
                validationState={password.validationState}
                placeholder="Mínimo 8 caracteres y un número"
                autoComplete="new-password"
                showPasswordToggle
                required
                disabled={isLoading}
              />

              <Input
                label="Confirmar contraseña"
                type="password"
                value={confirm.value}
                onChange={(e) =>
                  changeField(e.target.value, confirm, setConfirm, (v) => validateConfirm(v, password.value))
                }
                onBlur={() => blurField(confirm, setConfirm, (v) => validateConfirm(v, password.value))}
                error={confirm.error}
                validationState={confirm.validationState}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                showPasswordToggle
                required
                disabled={isLoading}
              />

              <Button type="submit" variant="primary" size="lg" isLoading={isLoading} fullWidth>
                {isLoading ? 'Guardando…' : 'Restablecer contraseña'}
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
