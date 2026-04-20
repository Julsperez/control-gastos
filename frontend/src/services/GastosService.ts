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

// ============================================================
// Interfaz principal — contrato que ambas implementaciones cumplen
// ============================================================

export interface IGastosService {
  // Auth
  register(data: RegisterRequest): Promise<AuthResponse>
  login(data: LoginRequest): Promise<AuthResponse>
  refresh(refresh_token: string): Promise<AuthTokens>

  // Gastos
  getGastos(mes?: string, categoria_id?: number): Promise<GastosResponse>
  addGasto(data: GastoCreate): Promise<Gasto>
  deleteGasto(id: number): Promise<void>

  // Categorías
  getCategorias(): Promise<Categoria[]>
  addCategoria(data: CategoriaCreate): Promise<Categoria>

  // Dashboard
  getDashboardData(mes?: string): Promise<DashboardResumen>

  // Budget
  getBudgetStatus(mes?: string): Promise<BudgetStatus>
  updateBudgetSettings(settings: BudgetSettings): Promise<BudgetStatus>
}

// ============================================================
// Singleton — se crea una vez y se reutiliza en toda la app
// ============================================================

let _instance: IGastosService | null = null

export async function getGastosService(): Promise<IGastosService> {
  if (_instance !== null) return _instance

  const source = import.meta.env.VITE_DATA_SOURCE ?? 'local'

  if (source === 'api') {
    const { ApiGastosService } = await import('./ApiService')
    _instance = new ApiGastosService()
  } else {
    const { LocalStorageGastosService } = await import('./LocalStorageService')
    _instance = new LocalStorageGastosService()
  }

  // _instance is always set at this point
  return _instance as IGastosService
}
