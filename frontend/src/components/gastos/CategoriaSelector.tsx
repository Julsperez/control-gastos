import { Check } from 'lucide-react'
import type { Categoria } from '../../types'
import { getCategoryBadgeStyle } from '../../types'

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
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-neutral-700">Categoría</label>
      <div className="flex flex-wrap gap-2">
        {categorias.map((cat) => {
          const isSelected = selectedId === cat.id
          const style = getCategoryBadgeStyle(cat.name)

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              className={[
                'inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md border transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
                isSelected ? 'border-2' : 'border-neutral-200',
              ].join(' ')}
              style={
                isSelected
                  ? {
                      backgroundColor: style.bg,
                      color: style.text,
                      borderColor: cat.color,
                    }
                  : {
                      backgroundColor: '#F3F4F6',
                      color: '#374151',
                    }
              }
              aria-pressed={isSelected}
            >
              {isSelected && <Check size={14} />}
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              {cat.name}
            </button>
          )
        })}
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
