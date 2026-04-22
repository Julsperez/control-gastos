import { Check } from 'lucide-react'
import type { Categoria } from '../../types'
import { getCategoryBadgeStyle, getCategoryColor } from '../../types'
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
      <legend className="text-sm font-medium text-[var(--text-secondary)]">Categoría</legend>
      <div className="flex flex-wrap gap-2">
        {categorias.map((cat) => {
          const isSelected = selectedId === cat.id
          const style = getCategoryBadgeStyle(cat.name, theme)
          const dotColor = getCategoryColor(cat, theme)

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              className={[
                'inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md border transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-1',
                isSelected
                  ? 'border-2'
                  : 'bg-[var(--bg-card-hover)] text-[var(--text-secondary)] border-[var(--border-default)] hover:border-[var(--border-strong)]',
              ].join(' ')}
              style={
                isSelected
                  ? {
                      backgroundColor: style.bg,
                      color: style.text,
                      borderColor: dotColor,
                    }
                  : undefined
              }
              aria-pressed={isSelected}
            >
              {isSelected && <Check size={14} />}
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: dotColor }}
              />
              {cat.name}
            </button>
          )
        })}
      </div>
      {error && <p role="alert" className="text-xs text-[var(--text-error)]">{error}</p>}
    </fieldset>
  )
}
