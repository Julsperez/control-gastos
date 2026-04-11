import type { Categoria } from '../../types'
import { getCategoryBadgeStyle } from '../../types'

interface BadgeProps {
  categoria: Categoria
  size?: 'sm' | 'md'
}

export function Badge({ categoria, size = 'sm' }: BadgeProps) {
  const style = getCategoryBadgeStyle(categoria.name)

  if (size === 'md') {
    return (
      <span
        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md border"
        style={{
          backgroundColor: style.bg,
          color: style.text,
          borderColor: categoria.color + '40',
        }}
      >
        <span
          className="inline-block w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: categoria.color }}
        />
        {categoria.name}
      </span>
    )
  }

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-sm"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      <span
        className="inline-block w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: categoria.color }}
      />
      {categoria.name}
    </span>
  )
}
