import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useAuth } from '../../hooks/useAuth'
import type { ValidationState } from '../../types'

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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
    return 'Ingresa un email válido (ej: nombre@dominio.com)'
  return ''
}

function validateName(v: string): string {
  if (v.length < 2) return 'El nombre debe tener al menos 2 caracteres'
  return ''
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

export function RegisterForm() {
  const [name, setName] = useState<FieldState>(initField())
  const [email, setEmail] = useState<FieldState>(initField())
  const [password, setPassword] = useState<FieldState>(initField())
  const [confirm, setConfirm] = useState<FieldState>(initField())
  const [emailTakenError, setEmailTakenError] = useState(false)

  const { register, isLoading } = useAuth()

  function blurField(
    field: FieldState,
    setField: (f: FieldState) => void,
    validate: (v: string) => string,
  ) {
    const err = validate(field.value)
    setField({ ...field, touched: true, error: err, validationState: err ? 'error' : 'valid' })
  }

  function changeField(
    value: string,
    field: FieldState,
    setField: (f: FieldState) => void,
    validate: (v: string) => string,
  ) {
    const err = field.touched ? validate(value) : ''
    setField({
      ...field,
      value,
      error: err,
      validationState: field.touched ? (err ? 'error' : 'valid') : null,
    })
    setEmailTakenError(false)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    // Validar todos los campos
    const nameErr = validateName(name.value)
    const emailErr = validateEmail(email.value)
    const pwdErr = validatePassword(password.value)
    const confErr = validateConfirm(confirm.value, password.value)

    setName((f) => ({ ...f, error: nameErr, validationState: nameErr ? 'error' : 'valid', touched: true }))
    setEmail((f) => ({ ...f, error: emailErr, validationState: emailErr ? 'error' : 'valid', touched: true }))
    setPassword((f) => ({ ...f, error: pwdErr, validationState: pwdErr ? 'error' : 'valid', touched: true }))
    setConfirm((f) => ({ ...f, error: confErr, validationState: confErr ? 'error' : 'valid', touched: true }))

    if (nameErr || emailErr || pwdErr || confErr) return

    const result = await register(email.value, password.value, name.value)
    if (result.emailTaken) {
      setEmailTakenError(true)
      setEmail((f) => ({ ...f, validationState: 'error', error: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input
        label="Nombre completo"
        type="text"
        value={name.value}
        onChange={(e) => changeField(e.target.value, name, setName, validateName)}
        onBlur={() => blurField(name, setName, validateName)}
        error={name.error}
        validationState={name.validationState}
        placeholder="Tu nombre"
        autoComplete="name"
        required
        disabled={isLoading}
      />
      <div>
        <Input
          label="Email"
          type="email"
          value={email.value}
          onChange={(e) => changeField(e.target.value, email, setEmail, validateEmail)}
          onBlur={() => blurField(email, setEmail, validateEmail)}
          error={email.error}
          validationState={email.validationState}
          placeholder="tu@email.com"
          autoComplete="email"
          required
          disabled={isLoading}
        />
        {emailTakenError && (
          <p className="text-xs text-[var(--text-error)] mt-1">
            Este email ya está registrado.{' '}
            <Link to="/login" className="underline font-medium">
              iniciar sesión
            </Link>
          </p>
        )}
      </div>
      <Input
        label="Contraseña"
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
          changeField(e.target.value, confirm, setConfirm, (v) =>
            validateConfirm(v, password.value),
          )
        }
        onBlur={() =>
          blurField(confirm, setConfirm, (v) => validateConfirm(v, password.value))
        }
        error={confirm.error}
        validationState={confirm.validationState}
        placeholder="Repite tu contraseña"
        autoComplete="new-password"
        showPasswordToggle
        required
        disabled={isLoading}
      />

      <Button type="submit" variant="primary" size="lg" isLoading={isLoading} fullWidth>
        {isLoading ? 'Creando cuenta…' : 'Crear cuenta'}
      </Button>

      <p className="text-center text-sm text-[var(--text-secondary)]">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-[var(--accent-primary)] font-medium hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </form>
  )
}
