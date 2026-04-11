import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          dark: '#4F46E5',
          light: '#EEF2FF',
        },
        secondary: '#8B5CF6',
        success: {
          DEFAULT: '#22C55E',
          light: '#F0FDF4',
          text: '#15803D',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#FEF2F2',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FFFBEB',
        },
        neutral: {
          900: '#111827',
          700: '#374151',
          600: '#6B7280',
          400: '#9CA3AF',
          300: '#D1D5DB',
          200: '#E5E7EB',
          100: '#F3F4F6',
        },
        background: '#F8FAFC',
        surface: '#FFFFFF',
        // Colores de categorías (fuente de verdad: design-system.md)
        cat: {
          alimentacion: '#F97316',
          transporte: '#3B82F6',
          hogar: '#F59E0B',
          salud: '#10B981',
          ocio: '#A855F7',
          ropa: '#14B8A6',
          educacion: '#6366F1',
          servicios: '#64748B',
          viajes: '#0EA5E9',
          otros: '#6B7280',
        },
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.5' }],
        base: ['1rem', { lineHeight: '1.5' }],
        lg: ['1.125rem', { lineHeight: '1.4' }],
        xl: ['1.25rem', { lineHeight: '1.3' }],
        '2xl': ['1.5rem', { lineHeight: '1.25' }],
        '3xl': ['1.875rem', { lineHeight: '1.2' }],
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
        'btn-sm': '6px',
        'btn-md': '8px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        fab: '0 4px 12px rgba(99, 102, 241, 0.4)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'ease-spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'skeleton-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'slide-down': {
          from: { transform: 'translateY(-100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'sheet-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'fab-appear': {
          from: { transform: 'scale(0)' },
          to: { transform: 'scale(1)' },
        },
      },
      animation: {
        'skeleton-pulse': 'skeleton-pulse 1.5s ease-in-out infinite',
        'slide-down': 'slide-down 200ms ease-out',
        'scale-in': 'scale-in 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 200ms ease-out',
        'sheet-up': 'sheet-up 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fab-appear': 'fab-appear 300ms cubic-bezier(0.34, 1.56, 0.64, 1) 200ms both',
      },
    },
  },
  plugins: [],
  // Safelist de colores de categorías para que no sean purgados en clases dinámicas
  safelist: [
    'bg-cat-alimentacion', 'bg-cat-transporte', 'bg-cat-hogar', 'bg-cat-salud',
    'bg-cat-ocio', 'bg-cat-ropa', 'bg-cat-educacion', 'bg-cat-servicios',
    'bg-cat-viajes', 'bg-cat-otros',
    'text-cat-alimentacion', 'text-cat-transporte', 'text-cat-hogar', 'text-cat-salud',
    'text-cat-ocio', 'text-cat-ropa', 'text-cat-educacion', 'text-cat-servicios',
    'text-cat-viajes', 'text-cat-otros',
    'border-cat-alimentacion', 'border-cat-transporte', 'border-cat-hogar', 'border-cat-salud',
    'border-cat-ocio', 'border-cat-ropa', 'border-cat-educacion', 'border-cat-servicios',
    'border-cat-viajes', 'border-cat-otros',
  ],
}

export default config
