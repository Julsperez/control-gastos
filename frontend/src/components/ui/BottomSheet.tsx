import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

export function BottomSheet({ isOpen, onClose, title, children, footer }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const scrollBodyRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)

  // Coordenadas y flags del gesto activo
  const startYRef = useRef(0)
  const currentDeltaRef = useRef(0)
  const isDraggingRef = useRef(false)
  // Dirección inicial del gesto: null = sin determinar, 'vertical' | 'horizontal'
  const gestureDirectionRef = useRef<'vertical' | 'horizontal' | null>(null)
  const startXRef = useRef(0)

  // Bloquear scroll del body mientras el sheet está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Swipe-to-dismiss — listeners solo en el handle para evitar conflicto con scroll
  useEffect(() => {
    const handle = handleRef.current
    const sheet = sheetRef.current
    if (!handle || !sheet || !isOpen) return

    // Capturamos en consts no-null para que TypeScript las propague a los closures
    const safeHandle: HTMLDivElement = handle
    const safeSheet: HTMLDivElement = sheet

    function onTouchStart(e: TouchEvent) {
      startYRef.current = e.touches[0].clientY
      startXRef.current = e.touches[0].clientX
      currentDeltaRef.current = 0
      isDraggingRef.current = true
      gestureDirectionRef.current = null
    }

    function onTouchMove(e: TouchEvent) {
      if (!isDraggingRef.current) return

      const deltaY = e.touches[0].clientY - startYRef.current
      const deltaX = e.touches[0].clientX - startXRef.current

      // Determinar la dirección del gesto en los primeros píxeles de movimiento
      if (gestureDirectionRef.current === null) {
        if (Math.abs(deltaY) > 6 || Math.abs(deltaX) > 6) {
          gestureDirectionRef.current =
            Math.abs(deltaY) >= Math.abs(deltaX) ? 'vertical' : 'horizontal'
        }
        return
      }

      // Si el gesto fue horizontal, no hacemos nada
      if (gestureDirectionRef.current === 'horizontal') return

      // Solo seguimos si el scroll del body está en el tope
      const scrollTop = scrollBodyRef.current?.scrollTop ?? 0
      if (scrollTop > 0) {
        // Contenido con scroll activo — cancelar el drag y dejar que el navegador
        // maneje el scroll normalmente
        isDraggingRef.current = false
        safeSheet.style.transform = ''
        safeSheet.style.transition = ''
        return
      }

      currentDeltaRef.current = deltaY

      if (deltaY > 0) {
        safeSheet.style.transform = `translateY(${deltaY}px)`
        safeSheet.style.transition = 'none'
      }
    }

    function onTouchEnd(e: TouchEvent) {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false

      const deltaY = e.changedTouches[0].clientY - startYRef.current

      // Umbral de distancia: >80px hacia abajo cierra el sheet
      if (
        gestureDirectionRef.current === 'vertical' &&
        deltaY > 80 &&
        (scrollBodyRef.current?.scrollTop ?? 0) === 0
      ) {
        onClose()
      } else {
        safeSheet.style.transform = ''
        safeSheet.style.transition = ''
      }

      currentDeltaRef.current = 0
      gestureDirectionRef.current = null
    }

    safeHandle.addEventListener('touchstart', onTouchStart, { passive: true })
    safeHandle.addEventListener('touchmove', onTouchMove, { passive: true })
    safeHandle.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      safeHandle.removeEventListener('touchstart', onTouchStart)
      safeHandle.removeEventListener('touchmove', onTouchMove)
      safeHandle.removeEventListener('touchend', onTouchEnd)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[var(--bg-overlay)] animate-fade-in"
        onClick={onClose}
        aria-hidden
      />

      {/* Sheet — layout flex column para que el footer nunca quede oculto */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal
        aria-labelledby="sheet-title"
        className={[
          'absolute bottom-0 left-0 right-0 z-50',
          'glass-modal rounded-t-[20px]',
          'max-h-[90vh]',
          'flex flex-col',
          'animate-sheet-up',
        ].join(' ')}
      >
        {/* Handle — zona exclusiva de swipe-to-dismiss */}
        <div
          ref={handleRef}
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing flex-shrink-0"
          aria-hidden
        >
          <div className="w-10 h-1.5 bg-[var(--border-strong)] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-4 border-b border-[var(--border-subtle)] flex-shrink-0">
          <h2 id="sheet-title" className="text-xl font-bold text-[var(--text-primary)]">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-primary-subtle)] rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo scrollable — ocupa todo el espacio disponible */}
        <div
          ref={scrollBodyRef}
          className="flex-1 overflow-y-auto overscroll-contain px-4 pt-4"
        >
          {children}
        </div>

        {/* Footer sticky — siempre visible, fuera del área scrollable */}
        {footer && (
          <div
            className="flex-shrink-0 px-4 pt-3 pb-[calc(16px+env(safe-area-inset-bottom,0px))] border-t border-[var(--border-subtle)] bg-[var(--bg-card)]"
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
