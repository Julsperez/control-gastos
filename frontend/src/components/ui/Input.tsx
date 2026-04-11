import { forwardRef, type InputHTMLAttributes, useState } from 'react'
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import type { ValidationState } from '../../types'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  validationState?: ValidationState
  showPasswordToggle?: boolean
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      validationState,
      showPasswordToggle = false,
      hint,
      type,
      className = '',
      id,
      ...props
    },
    ref,
  ) => {
    const [showPwd, setShowPwd] = useState(false)
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const hasError = validationState === 'error' || !!error
    const isValid = validationState === 'valid'
    const actualType = showPasswordToggle ? (showPwd ? 'text' : 'password') : type

    const borderClass = hasError
      ? 'border-danger ring-danger/10'
      : isValid
        ? 'border-success'
        : 'border-neutral-300 focus:border-primary focus:ring-primary/15'

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
            {label}
            {props.required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={actualType}
            className={[
              'w-full h-11 px-3 py-2.5 text-base text-neutral-900 bg-surface rounded-md border transition-all duration-150',
              'placeholder:text-neutral-400',
              'focus:outline-none focus:ring-[3px]',
              'disabled:bg-neutral-100 disabled:text-neutral-600 disabled:border-neutral-200 disabled:cursor-not-allowed',
              borderClass,
              (hasError || isValid || showPasswordToggle) ? 'pr-10' : '',
              className,
            ].join(' ')}
            {...props}
          />
          {/* Ícono de estado */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {showPasswordToggle && (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPwd((v) => !v)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
            {!showPasswordToggle && hasError && (
              <AlertCircle size={18} className="text-danger" aria-hidden />
            )}
            {!showPasswordToggle && isValid && (
              <CheckCircle size={18} className="text-success" aria-hidden />
            )}
          </div>
        </div>
        {hint && !error && (
          <p className="text-xs text-neutral-400">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-danger flex items-center gap-1" role="alert">
            <AlertCircle size={12} aria-hidden />
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
