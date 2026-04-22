import axios, { type AxiosInstance, type AxiosRequestConfig, isAxiosError } from 'axios'
import type {
  AuthResponse,
  AuthTokens,
  BudgetSettings,
  BudgetStatus,
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
import { useAuthStore } from '../store/authStore'

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

    // Inyectar access token desde el store de Zustand en cada request
    this.client.interceptors.request.use((config) => {
      const token = useAuthStore.getState().accessToken
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
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
              setTimeout(() => reject(error), 10000)
            })
          }

          this.isRefreshing = true
          try {
            const refreshToken = useAuthStore.getState().refreshToken
            if (!refreshToken) throw new Error('No refresh token')

            const newTokens = await this.refresh(refreshToken)

            // Actualizar tokens en el store de Zustand (persiste automáticamente vía middleware)
            useAuthStore.getState().updateTokens(newTokens)

            this.refreshQueue.forEach((cb) => cb(newTokens.access_token))
            this.refreshQueue = []

            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${newTokens.access_token}`
            }
            return this.client(originalRequest)
          } catch {
            // Logout: limpiar store y redirigir
            useAuthStore.getState().clearAuth()
            window.location.href = import.meta.env.BASE_URL + 'login'
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

  async getAvailableMonths(): Promise<string[]> {
    const res = await this.client.get<string[]>('/gastos/available-months')
    return res.data
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

  // ----------------------------------------------------------
  // Budget
  // ----------------------------------------------------------

  async getBudgetStatus(mes?: string): Promise<BudgetStatus> {
    const params: Record<string, string> = {}
    if (mes) params['mes'] = mes
    const res = await this.client.get<BudgetStatus>('/budget/status', { params })
    return res.data
  }

  async updateBudgetSettings(settings: BudgetSettings): Promise<BudgetStatus> {
    const res = await this.client.put<BudgetStatus>('/budget/settings', settings)
    return res.data
  }
}
