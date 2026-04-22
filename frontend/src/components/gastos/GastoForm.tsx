import { type FormEvent, useEffect, useRef, useState } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { CategoriaSelector } from './CategoriaSelector'
import { CategoriaCustomInput } from './CategoriaCustomInput'
import { useGastosStore } from '../../store/gastosStore'
import { useGastos } from '../../hooks/useGastos'
import { AlertCircle } from 'lucide-react'
import { todayISO } from '../../types'

interface GastoFormProps {
  onSuccess: () => void
}

export function GastoForm({ onSuccess }: GastoFormProps) {
  const [amount, setAmount] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [customCategoryName, setCustomCategoryName] = useState('')
  const [description, setDescription] = useState('')
  const [fecha, setFecha] = useState(todayISO())
  const [amountError, setAmountError] = useState('')
  const [categoryError, setCategoryError] = useState('')

  const amountRef = useRef<HTMLInputElement>(null)
  const categorias = useGastosStore((s) => s.categorias)
  const { handleAddGasto, isSubmitting, submitError, setSubmitError } = useGastos(onSuccess)

  const OTROS_ID = categorias.find((c) => c.name === 'Otros')?.id ?? 10
  const showCustomInput = selectedCategoryId === OTROS_ID

  // Foco automático con delay para esperar a la animación de entrada
  useEffect(() => {
    const t = setTimeout(() => {
      amountRef.current?.focus()
    }, 300)
    return () => clearTimeout(t)
  }, [])

  function handleCategorySelect(id: number) {
    setSelectedCategoryId(id)
    setCategoryError('')
    setSubmitError(null)
    if (id !== OTROS_ID) setCustomCategoryName('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const parsedAmount = parseFloat(amount.replace(',', '.'))
    let valid = true

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmountError('Ingresa un monto mayor a 0')
      valid = false
    } else {
      setAmountError('')
    }

    if (!selectedCategoryId) {
      setCategoryError('Selecciona una categoría')
      valid = false
    } else {
      setCategoryError('')
    }

    if (!valid) return

    await handleAddGasto({
      amount: parsedAmount,
      category_id: selectedCategoryId!,
      description: description.trim() || undefined,
      fecha,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 pb-4">
      {/* Campo Monto — prominente */}
      <div className="flex flex-col gap-1">
        <label htmlFor="gasto-monto" className="text-sm font-medium text-[var(--text-secondary)]">
          ¿Cuánto gastaste?
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl font-normal text-[var(--text-tertiary)] select-none">
            $
          </span>
          <input
            ref={amountRef}
            id="gasto-monto"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value)
              setAmountError('')
            }}
            placeholder="0.00"
            className={[
              'w-full h-16 pl-8 pr-4 text-2xl font-bold text-[var(--text-primary)] text-center bg-[var(--bg-input)] rounded-md border transition-all duration-150',
              'focus:outline-none focus:ring-[3px] focus:border-[var(--border-focus)] focus:ring-[var(--accent-primary-glow)] focus:bg-[var(--bg-input-focus)]',
              amountError ? 'border-[var(--border-error)]' : 'border-[var(--border-default)]',
            ].join(' ')}
          />
        </div>
        {amountError && (
          <p role="alert" className="text-xs text-[var(--text-error)] flex items-center gap-1">
            <AlertCircle size={12} />
            {amountError}
          </p>
        )}
      </div>

      {/* Selector de categoría */}
      <CategoriaSelector
        categorias={categorias}
        selectedId={selectedCategoryId}
        onSelect={handleCategorySelect}
        error={categoryError}
      />

      {/* Input de categoría custom — condicional */}
      {showCustomInput && (
        <CategoriaCustomInput
          value={customCategoryName}
          onChange={setCustomCategoryName}
        />
      )}

      {/* Descripción — opcional */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <label htmlFor="gasto-desc" className="text-sm font-medium text-[var(--text-secondary)]">
            Descripción
          </label>
          <span className="text-xs text-[var(--text-tertiary)]">(opcional)</span>
        </div>
        <input
          id="gasto-desc"
          type="text"
          value={description}
          onChange={(e) => {
            if (e.target.value.length <= 100) setDescription(e.target.value)
          }}
          placeholder="Ej: almuerzo con clientes, uber al aeropuerto…"
          maxLength={100}
          className="w-full h-11 px-3 py-2.5 text-base text-[var(--text-primary)] bg-[var(--bg-input)] rounded-md border border-[var(--border-default)] placeholder:text-[var(--text-disabled)] focus:outline-none focus:ring-[3px] focus:border-[var(--border-focus)] focus:ring-[var(--accent-primary-glow)] focus:bg-[var(--bg-input-focus)] transition-all duration-150"
        />
        <span className="text-xs text-[var(--text-tertiary)] self-end">{description.length}/100</span>
      </div>

      {/* Fecha */}
      <Input
        label="Fecha"
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        id="gasto-fecha"
      />

      {/* Error de submit */}
      {submitError && (
        <div className="flex items-start gap-2 p-3 bg-[var(--accent-danger-subtle)] border-l-[3px] border-[var(--accent-danger)] rounded-r-md">
          <AlertCircle size={16} className="text-[var(--accent-danger)] mt-0.5 flex-shrink-0" />
          <p className="text-sm text-[var(--text-primary)]">{submitError}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isSubmitting}
        fullWidth
        className="mt-1"
      >
        {isSubmitting ? 'Guardando…' : 'Guardar gasto'}
      </Button>
    </form>
  )
}
