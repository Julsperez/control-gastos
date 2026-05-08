import type { Categoria } from '../../types'
import { getCategoryBadgeStyle, getCategoryColor, CATEGORY_ICON_MAP } from '../../types'
import { useTheme } from '../../hooks/useTheme'

interface BadgeProps {
  categoria: Categoria
  size?: 'sm' | 'md'
}

export function Badge({ categoria, size = 'sm' }: BadgeProps) {
  const { theme } = useTheme()
  const style = getCategoryBadgeStyle(categoria.name, theme)
  const dotColor = getCategoryColor(categoria, theme)
  const IconComponent = CATEGORY_ICON_MAP[categoria.icon]

  const icon = IconComponent
    ? <IconComponent style={{ color: dotColor, flexShrink: 0 }} size={size === 'md' ? 14 : 12} />
    : <span className="inline-block rounded-full flex-shrink-0" style={{ width: size === 'md' ? 8 : 6, height: size === 'md' ? 8 : 6, backgroundColor: dotColor }} />

  if (size === 'md') {
    return (
      <span
        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md border mb-2"
        style={{
          backgroundColor: style.bg,
          color: style.text,
          borderColor: dotColor + '40',
        }}
      >
        {icon}
        {categoria.name}
      </span>
    )
  }

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-sm mb-2"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {icon}
      {categoria.name}
    </span>
  )
}
