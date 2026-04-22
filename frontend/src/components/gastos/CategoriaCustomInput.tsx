import { type ChangeEvent } from 'react'

interface CategoriaCustomInputProps {
  value: string
  onChange: (v: string) => void
  error?: string
}

export function CategoriaCustomInput({ value, onChange, error }: CategoriaCustomInputProps) {
  const MAX = 40

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length <= MAX) onChange(e.target.value)
  }

  return (
    <div
      className="overflow-hidden transition-all duration-200 ease-out"
      style={{ maxHeight: value !== undefined ? '120px' : '0', opacity: 1 }}
    >
      <div className="pt-3 flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <label htmlFor="custom-cat-name" className="text-sm font-medium text-[var(--text-secondary)]">
            ¿Qué tipo de gasto es?
          </label>
          <span className="text-xs text-[var(--text-tertiary)]">
            {value.length}/{MAX}
          </span>
        </div>
        <input
          id="custom-cat-name"
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Ej: suscripción, regalo, impuesto…"
          maxLength={MAX}
          className={[
            'w-full h-11 px-3 py-2.5 text-base text-[var(--text-primary)] bg-[var(--bg-input)] rounded-md border transition-all duration-150',
            'placeholder:text-[var(--text-disabled)]',
            'focus:outline-none focus:ring-[3px] focus:border-[var(--border-focus)] focus:ring-[var(--accent-primary-glow)] focus:bg-[var(--bg-input-focus)]',
            error ? 'border-[var(--border-error)]' : 'border-[var(--border-default)]',
          ].join(' ')}
        />
        {error && <p className="text-xs text-[var(--text-error)]">{error}</p>}
      </div>
    </div>
  )
}
