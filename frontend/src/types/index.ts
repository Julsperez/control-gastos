// ============================================================
// Entidades de dominio
// ============================================================

export interface User {
  id: number
  email: string
  full_name: string | null
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface AuthResponse extends AuthTokens {
  user: User
}

export interface Categoria {
  id: number
  name: string
  color: string
  icon: string
  is_custom: boolean
}

export interface Gasto {
  id: number
  amount: number
  description: string | null
  fecha: string       // 'YYYY-MM-DD'
  created_at: string  // ISO datetime
  categoria: Categoria
}

// ============================================================
// Request / Create types
// ============================================================

export interface GastoCreate {
  amount: number
  category_id: number
  description?: string
  fecha?: string  // 'YYYY-MM-DD', default: hoy
}

export interface CategoriaCreate {
  name: string
  color?: string
  icon?: string
}

export interface RegisterRequest {
  email: string
  password: string
  full_name?: string
}

export interface LoginRequest {
  email: string
  password: string
}

// ============================================================
// Response types
// ============================================================

export interface GastosResponse {
  items: Gasto[]
  total: number
  sum: number
}

export interface CategoriasResponse {
  items: Categoria[]
}

export interface TotalPorCategoria {
  categoria_id: number
  categoria_name: string
  categoria_color: string
  total: number
  porcentaje: number
  cantidad_gastos: number
}

export interface GastoDiario {
  fecha: string  // 'YYYY-MM-DD'
  total: number
}

export interface TopCategoria {
  name: string
  value: number
  color: string
}

export interface DashboardResumen {
  mes: string  // 'YYYY-MM'
  total_mes: number
  total_mes_anterior: number | null
  variacion_porcentual: number | null
  total_por_categoria: TotalPorCategoria[]
  gasto_diario: GastoDiario[]
  top_categorias: TopCategoria[]
}

// ============================================================
// Budget types
// ============================================================

export type AlertLevel = 'none' | 'warning' | 'critical' | 'exceeded'

export interface BudgetStatus {
  budget: number | null
  spent: number
  remaining: number | null
  percentage_used: number | null
  alert_level: AlertLevel
  alert_threshold_warning: number
  alert_threshold_critical: number
}

export interface BudgetSettings {
  monthly_budget: number | null
  alert_threshold_warning: number
  alert_threshold_critical: number
}

// ============================================================
// UI / App types
// ============================================================

export type ToastType = 'success' | 'error' | 'warning'

export interface ToastMessage {
  id: string
  message: string
  type: ToastType
  duration?: number
}

export type ValidationState = 'valid' | 'error' | null

// ============================================================
// Categorías predefinidas del sistema
// Fuente de verdad visual: design-system.md (colores de Richard)
// ============================================================

export const SYSTEM_CATEGORIES: Categoria[] = [
  { id: 1,  name: 'Alimentación', color: '#F97316', icon: 'utensils',       is_custom: false },
  { id: 2,  name: 'Transporte',   color: '#3B82F6', icon: 'car',            is_custom: false },
  { id: 3,  name: 'Hogar',        color: '#F59E0B', icon: 'home',           is_custom: false },
  { id: 4,  name: 'Salud',        color: '#10B981', icon: 'heart',          is_custom: false },
  { id: 5,  name: 'Ocio',         color: '#A855F7', icon: 'gamepad-2',      is_custom: false },
  { id: 6,  name: 'Ropa',         color: '#14B8A6', icon: 'shirt',          is_custom: false },
  { id: 7,  name: 'Educación',    color: '#6366F1', icon: 'book',           is_custom: false },
  { id: 8,  name: 'Servicios',    color: '#64748B', icon: 'zap',            is_custom: false },
  { id: 9,  name: 'Viajes',       color: '#0EA5E9', icon: 'plane',          is_custom: false },
  { id: 10, name: 'Otros',        color: '#6B7280', icon: 'more-horizontal', is_custom: false },
]

// Badge backgrounds por nombre de categoría
export const CATEGORY_BADGE_STYLES: Record<string, { bg: string; text: string }> = {
  'Alimentación': { bg: '#FFF7ED', text: '#C2410C' },
  'Transporte':   { bg: '#EFF6FF', text: '#1D4ED8' },
  'Hogar':        { bg: '#FFFBEB', text: '#92400E' },
  'Salud':        { bg: '#ECFDF5', text: '#065F46' },
  'Ocio':         { bg: '#FAF5FF', text: '#7E22CE' },
  'Ropa':         { bg: '#F0FDFA', text: '#0F766E' },
  'Educación':    { bg: '#EEF2FF', text: '#4338CA' },
  'Servicios':    { bg: '#F8FAFC', text: '#334155' },
  'Viajes':       { bg: '#F0F9FF', text: '#0369A1' },
  'Otros':        { bg: '#F8FAFC', text: '#334155' },
}

export function getCategoryBadgeStyle(name: string): { bg: string; text: string } {
  return CATEGORY_BADGE_STYLES[name] ?? { bg: '#F3F4F6', text: '#374151' }
}

// Formateo de moneda
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(amount)
}

// Formato de mes actual
export function currentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}
