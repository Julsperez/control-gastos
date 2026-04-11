interface SkeletonProps {
  className?: string
}

function SkeletonBlock({ className = '' }: SkeletonProps) {
  return (
    <div
      className={['bg-neutral-200 rounded animate-skeleton-pulse', className].join(' ')}
      aria-hidden
    />
  )
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4" aria-label="Cargando datos..." aria-busy>
      {/* Saludo */}
      <SkeletonBlock className="h-5 w-32 rounded" />
      {/* Resumen */}
      <SkeletonBlock className="h-24 w-full rounded-lg" />
      {/* Gráfico */}
      <SkeletonBlock className="h-48 w-full rounded-lg" />
      {/* Lista */}
      <div className="flex flex-col gap-2">
        <SkeletonBlock className="h-14 w-full rounded-lg" />
        <SkeletonBlock className="h-14 w-full rounded-lg" />
        <SkeletonBlock className="h-14 w-full rounded-lg" />
      </div>
    </div>
  )
}
