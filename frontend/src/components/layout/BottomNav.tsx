import { NavLink, useLocation } from 'react-router-dom'
import { NAV_TABS } from './navTabs'

export function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav
      role="navigation"
      aria-label="Navegación principal"
      className="glass-header fixed bottom-0 left-0 right-0 z-20 flex justify-around items-stretch border-t border-[var(--border-subtle)]"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 4px)' }}
    >
      {NAV_TABS.map(({ to, label, icon: Icon }) => {
        const isActive = pathname === to || pathname.startsWith(to + '/')
        return (
          <NavLink
            key={to}
            to={to}
            aria-current={isActive ? 'page' : undefined}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 pt-2 pb-1 min-h-[52px] transition-colors"
          >
            <span className={`relative flex items-center justify-center ${isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--text-tertiary)]'}`}>
              {isActive && (
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-[var(--accent-primary)]" />
              )}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            </span>
            <span className={`text-[10px] font-medium leading-none ${isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--text-tertiary)]'}`}>
              {label}
            </span>
          </NavLink>
        )
      })}
    </nav>
  )
}
