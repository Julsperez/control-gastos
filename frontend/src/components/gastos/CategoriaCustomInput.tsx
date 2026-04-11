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
          <label htmlFor="custom-cat-name" className="text-sm font-medium text-neutral-700">
            ¿Qué tipo de gasto es?
          </label>
          <span className="text-xs text-neutral-400">
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
            'w-full h-11 px-3 py-2.5 text-base text-neutral-900 bg-surface rounded-md border transition-all duration-150',
            'placeholder:text-neutral-400',
            'focus:outline-none focus:ring-[3px] focus:border-primary focus:ring-primary/15',
            error ? 'border-danger' : 'border-neutral-300',
          ].join(' ')}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    </div>
  )
}
