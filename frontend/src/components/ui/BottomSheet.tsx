import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef(0)
  const currentYRef = useRef(0)
  const isDraggingRef = useRef(false)

  // Bloquear scroll del body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Swipe to close
  useEffect(() => {
    const sheet = sheetRef.current
    if (!sheet || !isOpen) return

    function onTouchStart(e: TouchEvent) {
      startYRef.current = e.touches[0].clientY
      isDraggingRef.current = true
    }

    function onTouchMove(e: TouchEvent) {
      if (!isDraggingRef.current) return
      const delta = e.touches[0].clientY - startYRef.current
      currentYRef.current = delta
      if (delta > 0 && sheet) {
        sheet.style.transform = `translateY(${delta}px)`
        sheet.style.transition = 'none'
      }
    }

    function onTouchEnd(e: TouchEvent) {
      isDraggingRef.current = false
      const velocity = e.changedTouches[0].clientY - startYRef.current
      if (velocity > 80 || velocity > 500 / 1000) {
        onClose()
      } else {
        if (sheet) {
          sheet.style.transform = ''
          sheet.style.transition = ''
        }
      }
      currentYRef.current = 0
    }

    sheet.addEventListener('touchstart', onTouchStart, { passive: true })
    sheet.addEventListener('touchmove', onTouchMove, { passive: true })
    sheet.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      sheet.removeEventListener('touchstart', onTouchStart)
      sheet.removeEventListener('touchmove', onTouchMove)
      sheet.removeEventListener('touchend', onTouchEnd)
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
      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal
        aria-labelledby="sheet-title"
        className={[
          'absolute bottom-0 left-0 right-0 z-50',
          'glass-modal rounded-t-[20px]',
          'max-h-[90vh] overflow-y-auto',
          'animate-sheet-up',
        ].join(' ')}
        style={{ paddingBottom: 'calc(32px + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-4">
          <div className="w-8 h-1 bg-[var(--border-strong)] rounded-full" />
        </div>
        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-4 border-b border-[var(--border-subtle)]">
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
        <div className="px-4 pt-4">{children}</div>
      </div>
    </div>
  )
}
