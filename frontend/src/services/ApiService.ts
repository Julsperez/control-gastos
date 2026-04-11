import axios, { type AxiosInstance, type AxiosRequestConfig, isAxiosError } from 'axios'
import type {
  AuthResponse,
  AuthTokens,
  Categoria,
  CategoriaCreate,
  DashboardResumen,
  Gasto,
  GastoCreate,
  GastosResponse,
  LoginRequest,
  RegisterRequest,
} from '../types'
import type { IGastosService } from './GastosService'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'

export class ApiGastosService implements IGastosService {
  private client: AxiosInstance
  private isRefreshing = false
  private refreshQueue: Array<(token: string) => void> = []

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: { 'Content-Type': 'application/json' },
    })

    // Inyectar access token en cada request
    this.client.interceptors.request.use((config) => {
      const raw = localStorage.getItem('cg_auth')
      if (raw) {
        try {
          const auth = JSON.parse(raw) as { state: { accessToken: string | null } }
          const token = auth?.state?.accessToken
          if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
          }
        } catch {
          // ignorar
        }
      }
      return config
    })

    // Interceptor de respuesta: manejar 401 con refresh
    this.client.interceptors.response.use(
      (res) => res,
      async (error: unknown) => {
        if (!isAxiosError(error)) throw error
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.refreshQueue.push((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers['Authorization'] = `Bearer ${token}`
                }
                resolve(this.client(originalRequest))
              })
              // Reject si no se puede refrescar
              setTimeout(() => reject(error), 10000)
            })
          }

          this.isRefreshing = true
          try {
            const raw = localStorage.getItem('cg_auth')
            const refreshToken = raw
              ? (JSON.parse(raw) as { state: { refreshToken: string | null } }).state?.refreshToken
              : null

            if (!refreshToken) throw new Error('No refresh token')

            const newTokens = await this.refresh(refreshToken)

            // Actualizar el store de Zustand directamente en localStorage
            const authRaw = localStorage.getItem('cg_auth')
            if (authRaw) {
              const authData = JSON.parse(authRaw) as {
                state: { accessToken: string; refreshToken: string }
              }
              authData.state.accessToken = newTokens.access_token
              authData.state.refreshToken = newTokens.refresh_token
              localStorage.setItem('cg_auth', JSON.stringify(authData))
            }

            this.refreshQueue.forEach((cb) => cb(newTokens.access_token))
            this.refreshQueue = []

            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${newTokens.access_token}`
            }
            return this.client(originalRequest)
          } catch {
            // Logout: limpiar auth y redirigir
            localStorage.removeItem('cg_auth')
            window.location.href = '/login'
            throw error
          } finally {
            this.isRefreshing = false
          }
        }

        throw error
      },
    )
  }

  // ----------------------------------------------------------
  // Auth
  // ----------------------------------------------------------

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const res = await this.client.post<AuthResponse>('/auth/register', data)
    return res.data
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await this.client.post<AuthResponse>('/auth/login', data)
    return res.data
  }

  async refresh(refresh_token: string): Promise<AuthTokens> {
    const res = await this.client.post<AuthTokens>('/auth/refresh', { refresh_token })
    return res.data
  }

  // ----------------------------------------------------------
  // Gastos
  // ----------------------------------------------------------

  async getGastos(mes?: string, categoria_id?: number): Promise<GastosResponse> {
    const params: Record<string, string | number> = {}
    if (mes) params['mes'] = mes
    if (categoria_id !== undefined) params['categoria_id'] = categoria_id
    const res = await this.client.get<GastosResponse>('/gastos', { params })
    return res.data
  }

  async addGasto(data: GastoCreate): Promise<Gasto> {
    const res = await this.client.post<Gasto>('/gastos', data)
    return res.data
  }

  async deleteGasto(id: number): Promise<void> {
    await this.client.delete(`/gastos/${id}`)
  }

  // ----------------------------------------------------------
  // Categorías
  // ----------------------------------------------------------

  async getCategorias(): Promise<Categoria[]> {
    const res = await this.client.get<{ items: Categoria[] }>('/categorias')
    return res.data.items
  }

  async addCategoria(data: CategoriaCreate): Promise<Categoria> {
    const res = await this.client.post<Categoria>('/categorias', data)
    return res.data
  }

  // ----------------------------------------------------------
  // Dashboard
  // ----------------------------------------------------------

  async getDashboardData(mes?: string): Promise<DashboardResumen> {
    const params: Record<string, string> = {}
    if (mes) params['mes'] = mes
    const res = await this.client.get<DashboardResumen>('/dashboard/resumen', { params })
    return res.data
  }
}
