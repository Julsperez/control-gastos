import { NavLink, useLocation } from 'react-router-dom'
import { NAV_TABS } from './navTabs'

export function Sidebar() {
  const { pathname } = useLocation()

  return (
    <nav
      role="navigation"
      aria-label="Navegación principal"
      className="glass-header fixed left-0 top-0 bottom-0 z-20 w-16 flex flex-col items-center pt-6 gap-2 border-r border-[var(--border-subtle)]"
    >
      {NAV_TABS.map(({ to, label, icon: Icon }) => {
        const isActive = pathname === to || pathname.startsWith(to + '/')
        return (
          <div key={to} className="relative group w-full flex justify-center">
            <NavLink
              to={to}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${
                isActive
                  ? 'bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)]'
                  : 'text-[var(--text-tertiary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[calc(50%+20px)] w-0.5 h-5 rounded-full bg-[var(--accent-primary)]" />
              )}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            </NavLink>

            {/* Tooltip CSS-only */}
            <span
              aria-hidden="true"
              className="pointer-events-none invisible group-hover:visible absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-default)] shadow-md z-30"
            >
              {label}
            </span>
          </div>
        )
      })}
    </nav>
  )
}
