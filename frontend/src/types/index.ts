import {
  Utensils, Car, Home, Heart, Gamepad2, Book, Zap, MoreHorizontal,
  UtensilsCrossed, Tag, Scissors, Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  'utensils':         Utensils,
  'utensils-crossed': UtensilsCrossed,
  'car':              Car,
  'home':             Home,
  'zap':              Zap,
  'heart':            Heart,
  'scissors':         Scissors,
  'gamepad-2':        Gamepad2,
  'book':             Book,
  'users':            Users,
  'more-horizontal':  MoreHorizontal,
  'tag':              Tag,
}

// ============================================================
// Entidades de dominio
// ============================================================

export interface User {
  id: number
  email: string
  full_name: string | null
  monthly_budget?: number | null
  alert_threshold_warning?: number
  alert_threshold_critical?: number
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

export interface GastoUpdate {
  amount?: number
  category_id?: number
  description?: string
  fecha?: string  // 'YYYY-MM-DD'
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
  { id: 1,  name: 'Despensa y súper',           color: '#F97316', icon: 'utensils',         is_custom: false },
  { id: 13, name: 'Restaurantes y comida fuera', color: '#F43F5E', icon: 'utensils-crossed', is_custom: false },
  { id: 2,  name: 'Transporte',                  color: '#3B82F6', icon: 'car',              is_custom: false },
  { id: 3,  name: 'Hogar',                       color: '#F59E0B', icon: 'home',             is_custom: false },
  { id: 8,  name: 'Servicios y suscripciones',   color: '#0D9488', icon: 'zap',              is_custom: false },
  { id: 4,  name: 'Salud',                       color: '#10B981', icon: 'heart',            is_custom: false },
  { id: 6,  name: 'Cuidado personal',            color: '#A855F7', icon: 'scissors',         is_custom: false },
  { id: 5,  name: 'Ocio y entretenimiento',      color: '#8B5CF6', icon: 'gamepad-2',        is_custom: false },
  { id: 7,  name: 'Educación',                   color: '#6366F1', icon: 'book',             is_custom: false },
  { id: 10, name: 'Familia y otros',             color: '#6B7280', icon: 'users',            is_custom: false },
]

// Colores optimizados para dark theme (mayor luminancia, cumplen AA sobre bg azul marino)
export const SYSTEM_CATEGORIES_DARK: Record<number, string> = {
  1:  '#FB923C', // Despensa y súper           — orange-400
  13: '#FB7185', // Restaurantes y comida fuera — rose-400
  2:  '#60A5FA', // Transporte                  — blue-400
  3:  '#FBBF24', // Hogar                       — amber-400
  8:  '#2DD4BF', // Servicios y suscripciones   — teal-400
  4:  '#34D399', // Salud                       — emerald-400
  6:  '#C084FC', // Cuidado personal            — purple-400
  5:  '#A78BFA', // Ocio y entretenimiento      — violet-400
  7:  '#818CF8', // Educación                   — indigo-400
  10: '#9CA3AF', // Familia y otros             — gray-400
}

export function getCategoryColor(categoria: Categoria, theme: 'dark' | 'light' = 'light'): string {
  if (theme === 'dark' && !categoria.is_custom) {
    return SYSTEM_CATEGORIES_DARK[categoria.id] ?? categoria.color
  }
  return categoria.color
}

// Badge backgrounds por nombre de categoría (light theme)
const CATEGORY_BADGE_STYLES: Record<string, { bg: string; text: string }> = {
  'Despensa y súper':           { bg: '#FFF7ED', text: '#C2410C' },
  'Restaurantes y comida fuera':{ bg: '#FFF1F2', text: '#9F1239' },
  'Transporte':                  { bg: '#EFF6FF', text: '#1D4ED8' },
  'Hogar':                       { bg: '#FFFBEB', text: '#92400E' },
  'Servicios y suscripciones':   { bg: '#F0FDFA', text: '#0F766E' },
  'Salud':                       { bg: '#ECFDF5', text: '#065F46' },
  'Cuidado personal':            { bg: '#FAF5FF', text: '#7E22CE' },
  'Ocio y entretenimiento':      { bg: '#F5F3FF', text: '#6D28D9' },
  'Educación':                   { bg: '#EEF2FF', text: '#4338CA' },
  'Familia y otros':             { bg: '#F8FAFC', text: '#334155' },
}

// Badge backgrounds dark theme (transparencias sobre bg azul marino)
export const CATEGORY_BADGE_STYLES_DARK: Record<string, { bg: string; text: string }> = {
  'Despensa y súper':           { bg: 'rgba(251,146,60,0.15)',  text: '#FDBA74' },
  'Restaurantes y comida fuera':{ bg: 'rgba(251,113,133,0.15)', text: '#FDA4AF' },
  'Transporte':                  { bg: 'rgba(96,165,250,0.15)',  text: '#93C5FD' },
  'Hogar':                       { bg: 'rgba(251,191,36,0.15)',  text: '#FCD34D' },
  'Servicios y suscripciones':   { bg: 'rgba(45,212,191,0.15)',  text: '#5EEAD4' },
  'Salud':                       { bg: 'rgba(52,211,153,0.15)',  text: '#6EE7B7' },
  'Cuidado personal':            { bg: 'rgba(192,132,252,0.15)', text: '#D8B4FE' },
  'Ocio y entretenimiento':      { bg: 'rgba(167,139,250,0.15)', text: '#C4B5FD' },
  'Educación':                   { bg: 'rgba(129,140,248,0.15)', text: '#A5B4FC' },
  'Familia y otros':             { bg: 'rgba(156,163,175,0.15)', text: '#D1D5DB' },
}

export function getCategoryBadgeStyle(
  name: string,
  theme: 'dark' | 'light' = 'light',
): { bg: string; text: string } {
  const source = theme === 'dark' ? CATEGORY_BADGE_STYLES_DARK : CATEGORY_BADGE_STYLES
  const fallback = theme === 'dark'
    ? { bg: 'rgba(255,255,255,0.06)', text: 'rgba(255,255,255,0.65)' }
    : { bg: '#F3F4F6', text: '#374151' }
  return source[name] ?? fallback
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
