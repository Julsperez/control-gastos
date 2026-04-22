import type { Categoria } from '../../types'
import { getCategoryBadgeStyle, getCategoryColor } from '../../types'
import { useTheme } from '../../hooks/useTheme'

interface BadgeProps {
  categoria: Categoria
  size?: 'sm' | 'md'
}

export function Badge({ categoria, size = 'sm' }: BadgeProps) {
  const { theme } = useTheme()
  const style = getCategoryBadgeStyle(categoria.name, theme)
  const dotColor = getCategoryColor(categoria, theme)

  if (size === 'md') {
    return (
      <span
        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md border"
        style={{
          backgroundColor: style.bg,
          color: style.text,
          borderColor: dotColor + '40',
        }}
      >
        <span
          className="inline-block w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: dotColor }}
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
        style={{ backgroundColor: dotColor }}
      />
      {categoria.name}
    </span>
  )
}
