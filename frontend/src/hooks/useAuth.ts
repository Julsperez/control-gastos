import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getGastosService } from '../services/GastosService'
import { useAuthStore } from '../store/authStore'
import { useGastosStore } from '../store/gastosStore'
import { useToast } from './useToast'
import { isAxiosError } from 'axios'

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setAuth, clearAuth } = useAuthStore()
  const reset = useGastosStore((s) => s.reset)
  const { showToast } = useToast()
  const navigate = useNavigate()

  async function login(email: string, password: string): Promise<boolean> {
    setIsLoading(true)
    setError(null)
    try {
      const svc = await getGastosService()
      const response = await svc.login({ email, password })
      setAuth(response)
      return true
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 401, 'Email o contraseña incorrectos. Verifica tus datos e intenta de nuevo.')
      setError(msg)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  async function register(
    email: string,
    password: string,
    full_name?: string,
  ): Promise<{ success: boolean; emailTaken: boolean }> {
    setIsLoading(true)
    setError(null)
    try {
      const svc = await getGastosService()
      const response = await svc.register({ email, password, full_name })
      setAuth(response)
      showToast('Cuenta creada. ¡Bienvenido/a!', 'success', 3000)
      navigate('/')
      return { success: true, emailTaken: false }
    } catch (err: unknown) {
      if (getStatusCode(err) === 409) {
        return { success: false, emailTaken: true }
      }
      const msg = getErrorMessage(err, 0, 'Error al crear la cuenta. Intenta de nuevo.')
      setError(msg)
      return { success: false, emailTaken: false }
    } finally {
      setIsLoading(false)
    }
  }

  function logout() {
    clearAuth()
    reset()
    navigate('/login')
  }

  return { login, register, logout, isLoading, error, setError }
}

function getStatusCode(err: unknown): number {
  if (isAxiosError(err)) return err.response?.status ?? 0
  if (err instanceof Error && 'status' in err) return (err as Error & { status: number }).status
  return 0
}

function getErrorMessage(err: unknown, statusCode: number, fallback: string): string {
  if (getStatusCode(err) === statusCode) return fallback
  if (isAxiosError(err)) return err.response?.data?.detail ?? fallback
  if (err instanceof Error) return err.message
  return fallback
}
