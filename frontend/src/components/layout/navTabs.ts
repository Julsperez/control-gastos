import { Wallet, BarChart2, Settings2 } from 'lucide-react'

export const NAV_TABS = [
  { to: '/gastos',    label: 'Gastos',        icon: Wallet    },
  { to: '/dashboard', label: 'Dashboard',     icon: BarChart2 },
  { to: '/settings',  label: 'Configuración', icon: Settings2 },
] as const
