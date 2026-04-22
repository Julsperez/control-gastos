import { useCallback, useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'theme'
const META_COLORS: Record<Theme, string> = {
  dark: '#0f1b3d',
  light: '#F5F5F7',
}

function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'dark' || value === 'light' ? value : null
  } catch {
    return null
  }
}

function systemPrefersDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return true
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  const meta = document.querySelector('meta[name="theme-color"]')
  meta?.setAttribute('content', META_COLORS[theme])
}

export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark'
    return readStoredTheme() ?? (systemPrefersDark() ? 'dark' : 'light')
  })

  // Aplicar al montar y cuando cambie.
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Sincronizar con cualquier cambio externo al atributo data-theme (e.g. otra instancia del hook).
  useEffect(() => {
    if (typeof window === 'undefined') return
    const observer = new MutationObserver(() => {
      const current = document.documentElement.getAttribute('data-theme') as Theme
      if (current === 'dark' || current === 'light') {
        setTheme((prev) => (prev !== current ? current : prev))
      }
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  // Seguir preferencias del sistema solo si no hay override manual.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      if (readStoredTheme() !== null) return
      setTheme(e.matches ? 'dark' : 'light')
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* localStorage bloqueado — el atributo DOM se aplica igualmente via effect */
      }
      return next
    })
  }, [])

  return { theme, toggleTheme }
}
