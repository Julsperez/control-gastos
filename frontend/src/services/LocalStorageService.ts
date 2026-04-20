import type {
  AuthResponse,
  AuthTokens,
  Categoria,
  CategoriaCreate,
  DashboardResumen,
  Gasto,
  GastoCreate,
  GastoDiario,
  GastosResponse,
  LoginRequest,
  RegisterRequest,
  TopCategoria,
  TotalPorCategoria,
  User,
} from '../types'
import { currentMonth, todayISO, SYSTEM_CATEGORIES as CATS } from '../types'
import type { IGastosService } from './GastosService'

// ============================================================
// Claves de localStorage
// ============================================================

const KEYS = {
  USERS: 'cg_users',
  GASTOS: 'cg_gastos',
  CATEGORIAS_CUSTOM: 'cg_categorias_custom',
  NEXT_GASTO_ID: 'cg_next_gasto_id',
  NEXT_CAT_ID: 'cg_next_cat_id',
} as const

// ============================================================
// Tipos internos del storage
// ============================================================

interface StoredUser {
  id: number
  email: string
  // ADVERTENCIA: contraseña en texto claro — solo para modo dev/local sin backend.
  // Nunca usar en producción. Cambiar VITE_DATA_SOURCE=api para usar el backend real.
  password: string
  full_name: string | null
}

// ============================================================
// Helpers
// ============================================================

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

function delay(ms = 300): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

function fakeToken(payload: Record<string, unknown>): string {
  return btoa(JSON.stringify(payload))
}

function nextId(key: string, start = 100): number {
  const id = read<number>(key, start)
  write(key, id + 1)
  return id
}

function getDaysInMonth(yearMonth: string): string[] {
  const [y, m] = yearMonth.split('-').map(Number)
  const days: string[] = []
  const daysInMonth = new Date(y, m, 0).getDate()
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
  }
  return days
}

// ============================================================
// LocalStorageGastosService
// ============================================================

export class LocalStorageGastosService implements IGastosService {
  private currentUserId: number | null = null

  constructor() {
    if (import.meta.env.DEV) {
      console.warn(
        '[LocalStorageService] Running in local/dev mode — passwords stored in plaintext. ' +
        'Set VITE_DATA_SOURCE=api to use the real backend.',
      )
    }
  }

  private getUsers(): StoredUser[] {
    return read<StoredUser[]>(KEYS.USERS, [])
  }

  private readGastos(): Gasto[] {
    return read<Gasto[]>(KEYS.GASTOS, [])
  }

  private getCustomCategorias(): Categoria[] {
    return read<Categoria[]>(KEYS.CATEGORIAS_CUSTOM, [])
  }

  private allCategorias(): Categoria[] {
    return [...CATS, ...this.getCustomCategorias()]
  }

  private getCategoriaById(id: number): Categoria | undefined {
    return this.allCategorias().find((c) => c.id === id)
  }

  // ----------------------------------------------------------
  // Auth
  // ----------------------------------------------------------

  async register(data: RegisterRequest): Promise<AuthResponse> {
    await delay()
    const users = this.getUsers()
    if (users.find((u) => u.email === data.email)) {
      throw Object.assign(new Error('Email ya registrado'), { status: 409 })
    }
    const id = nextId('cg_next_user_id', 1)
    const newUser: StoredUser = {
      id,
      email: data.email,
      password: data.password,
      full_name: data.full_name ?? null,
    }
    users.push(newUser)
    write(KEYS.USERS, users)
    this.currentUserId = id
    return this.buildAuthResponse(newUser)
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    await delay()
    const users = this.getUsers()
    const user = users.find((u) => u.email === data.email && u.password === data.password)
    if (!user) {
      throw Object.assign(new Error('Credenciales incorrectas'), { status: 401 })
    }
    this.currentUserId = user.id
    return this.buildAuthResponse(user)
  }

  async refresh(_refresh_token: string): Promise<AuthTokens> {
    await delay(100)
    if (!this.currentUserId) {
      throw Object.assign(new Error('No autenticado'), { status: 401 })
    }
    return {
      access_token: fakeToken({ sub: String(this.currentUserId), type: 'access' }),
      refresh_token: fakeToken({ sub: String(this.currentUserId), type: 'refresh' }),
      token_type: 'bearer',
    }
  }

  private buildAuthResponse(user: StoredUser): AuthResponse {
    const publicUser: User = { id: user.id, email: user.email, full_name: user.full_name }
    return {
      access_token: fakeToken({ sub: String(user.id), type: 'access' }),
      refresh_token: fakeToken({ sub: String(user.id), type: 'refresh' }),
      token_type: 'bearer',
      user: publicUser,
    }
  }

  // ----------------------------------------------------------
  // Gastos
  // ----------------------------------------------------------

  async getGastos(mes?: string, categoria_id?: number): Promise<GastosResponse> {
    await delay()
    const targetMes = mes ?? currentMonth()
    let items = this.readGastos().filter((g) => g.fecha.startsWith(targetMes))
    if (categoria_id !== undefined) {
      items = items.filter((g) => g.categoria.id === categoria_id)
    }
    items.sort((a, b) => b.fecha.localeCompare(a.fecha))
    return {
      items,
      total: items.length,
      sum: items.reduce((acc, g) => acc + g.amount, 0),
    }
  }

  async addGasto(data: GastoCreate): Promise<Gasto> {
    await delay()
    const categoria = this.getCategoriaById(data.category_id)
    if (!categoria) {
      throw Object.assign(new Error('Categoría no encontrada'), { status: 404 })
    }
    const id = nextId(KEYS.NEXT_GASTO_ID, 1)
    const gasto: Gasto = {
      id,
      amount: data.amount,
      description: data.description ?? null,
      fecha: data.fecha ?? todayISO(),
      created_at: new Date().toISOString(),
      categoria,
    }
    const gastos = this.readGastos()
    gastos.push(gasto)
    write(KEYS.GASTOS, gastos)
    return gasto
  }

  async deleteGasto(id: number): Promise<void> {
    await delay()
    const gastos = this.readGastos()
    const idx = gastos.findIndex((g) => g.id === id)
    if (idx === -1) {
      throw Object.assign(new Error('Gasto no encontrado'), { status: 404 })
    }
    gastos.splice(idx, 1)
    write(KEYS.GASTOS, gastos)
  }

  // ----------------------------------------------------------
  // Categorías
  // ----------------------------------------------------------

  async getCategorias(): Promise<Categoria[]> {
    await delay(100)
    return this.allCategorias()
  }

  async addCategoria(data: CategoriaCreate): Promise<Categoria> {
    await delay()
    const custom = this.getCustomCategorias()
    if (custom.find((c) => c.name.toLowerCase() === data.name.toLowerCase())) {
      throw Object.assign(new Error('Categoría ya existe'), { status: 409 })
    }
    const id = nextId(KEYS.NEXT_CAT_ID, 200)
    const cat: Categoria = {
      id,
      name: data.name,
      color: data.color ?? '#6B7280',
      icon: data.icon ?? 'tag',
      is_custom: true,
    }
    custom.push(cat)
    write(KEYS.CATEGORIAS_CUSTOM, custom)
    return cat
  }

  // ----------------------------------------------------------
  // Dashboard
  // ----------------------------------------------------------

  async getDashboardData(mes?: string): Promise<DashboardResumen> {
    await delay()
    const targetMes = mes ?? currentMonth()
    const [y, m] = targetMes.split('-').map(Number)
    const prevMonth = m === 1
      ? `${y - 1}-12`
      : `${y}-${String(m - 1).padStart(2, '0')}`

    const allGastos = this.readGastos()
    const mesCurrent = allGastos.filter((g) => g.fecha.startsWith(targetMes))
    const mesPrev = allGastos.filter((g) => g.fecha.startsWith(prevMonth))

    const totalMes = mesCurrent.reduce((acc, g) => acc + g.amount, 0)
    const totalPrev = mesPrev.reduce((acc, g) => acc + g.amount, 0)

    // Por categoría
    const catMap = new Map<number, { cat: Categoria; total: number; count: number }>()
    for (const g of mesCurrent) {
      const entry = catMap.get(g.categoria.id)
      if (entry) {
        entry.total += g.amount
        entry.count++
      } else {
        catMap.set(g.categoria.id, { cat: g.categoria, total: g.amount, count: 1 })
      }
    }

    const total_por_categoria: TotalPorCategoria[] = Array.from(catMap.values())
      .sort((a, b) => b.total - a.total)
      .map((e) => ({
        categoria_id: e.cat.id,
        categoria_name: e.cat.name,
        categoria_color: e.cat.color,
        total: e.total,
        porcentaje: totalMes > 0 ? (e.total / totalMes) * 100 : 0,
        cantidad_gastos: e.count,
      }))

    // Gasto diario — todos los días del mes, incluso 0
    const days = getDaysInMonth(targetMes)
    const dayMap = new Map<string, number>()
    for (const g of mesCurrent) {
      dayMap.set(g.fecha, (dayMap.get(g.fecha) ?? 0) + g.amount)
    }
    const gasto_diario: GastoDiario[] = days.map((d) => ({
      fecha: d,
      total: dayMap.get(d) ?? 0,
    }))

    // Top categorías para PieChart: top 4 + Otros
    const top4 = total_por_categoria.slice(0, 4)
    const rest = total_por_categoria.slice(4)
    const top_categorias: TopCategoria[] = [
      ...top4.map((c) => ({ name: c.categoria_name, value: c.total, color: c.categoria_color })),
    ]
    if (rest.length > 0) {
      top_categorias.push({
        name: 'Otros',
        value: rest.reduce((acc, c) => acc + c.total, 0),
        color: '#6B7280',
      })
    }

    return {
      mes: targetMes,
      total_mes: totalMes,
      total_mes_anterior: mesPrev.length > 0 ? totalPrev : null,
      variacion_porcentual:
        mesPrev.length > 0 && totalPrev > 0
          ? ((totalMes - totalPrev) / totalPrev) * 100
          : null,
      total_por_categoria,
      gasto_diario,
      top_categorias,
    }
  }
}
