import { type FormEvent, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useAuth } from '../../hooks/useAuth'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, error, setError } = useAuth()
  const navigate = useNavigate()

  // Ocultar el banner de error cuando el usuario modifica un campo
  useEffect(() => {
    if (error) setError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const ok = await login(email, password)
    if (ok) navigate('/')
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        autoComplete="email"
        required
        disabled={isLoading}
      />
      <div className="flex flex-col gap-1">
        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          autoComplete="current-password"
          showPasswordToggle
          required
          disabled={isLoading}
        />
        <div className="flex justify-end">
          <span className="text-sm text-primary cursor-not-allowed opacity-60">
            ¿Olvidaste tu contraseña?
          </span>
        </div>
      </div>

      {/* Banner de error inline */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 p-3 bg-danger-light border-l-4 border-danger rounded-r-md animate-fade-in"
        >
          <AlertCircle size={16} className="text-danger mt-0.5 flex-shrink-0" />
          <p className="text-sm text-neutral-900">{error}</p>
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" isLoading={isLoading} fullWidth>
        {isLoading ? 'Verificando…' : 'Iniciar sesión'}
      </Button>

      <p className="text-center text-sm text-neutral-600">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="text-primary font-medium hover:underline">
          Regístrate
        </Link>
      </p>
    </form>
  )
}
