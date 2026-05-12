import type { Categoria } from '../../types'
import { getCategoryBadgeStyle, getCategoryColor, CATEGORY_ICON_MAP } from '../../types'
import { useTheme } from '../../hooks/useTheme'

interface CategoriaSelectorProps {
  categorias: Categoria[]
  selectedId: number | null
  onSelect: (id: number) => void
  error?: string
}

export function CategoriaSelector({
  categorias,
  selectedId,
  onSelect,
  error,
}: CategoriaSelectorProps) {
  const { theme } = useTheme()

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium mb-2 text-[var(--text-secondary)]">Categoría</legend>
      <div className="grid grid-cols-3 gap-3">
        {categorias.map((cat) => {
          const isSelected = selectedId === cat.id
          const style = getCategoryBadgeStyle(cat.name, theme)
          const iconColor = getCategoryColor(cat, theme)
          const IconComponent = CATEGORY_ICON_MAP[cat.icon]

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              className={[
                'flex flex-col items-center justify-center gap-1.5 w-full rounded-2xl transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-1',
                isSelected ? '' : 'hover:brightness-95 active:scale-[0.97]',
              ].join(' ')}
              style={{
                backgroundColor: style.bg,
                outline: isSelected ? `2.5px solid ${iconColor}` : 'none',
                outlineOffset: '2px',
                height: '5rem',
              }}
              aria-pressed={isSelected}
            >
              <div className="flex items-center justify-center">
                {IconComponent
                  ? <IconComponent size={26} style={{ color: iconColor }} />
                  : <span className="size-6 rounded-full" style={{ backgroundColor: iconColor }} />
                }
              </div>
              <span className="text-xs font-medium text-center leading-tight px-1" style={{ color: style.text }}>
                {cat.name}
              </span>
            </button>
          )
        })}
      </div>
      {error && <p role="alert" className="text-xs text-[var(--text-error)]">{error}</p>}
    </fieldset>
  )
}
