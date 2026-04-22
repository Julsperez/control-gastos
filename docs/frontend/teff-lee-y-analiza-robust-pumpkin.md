# Plan de Implementación — Dark Theme iCloud (Control de Gastos)

## Contexto

Richard entregó el documento `docs/design/dark-theme-redesign.md` con una propuesta completa de rediseño visual inspirado en el dashboard de iCloud, incluyendo un dark theme con glassmorphism, un light theme refinado, y un sistema de toggle persistido en localStorage. La app actualmente no tiene CSS custom properties ni soporte de temas: todos los colores están hardcodeados en strings de Tailwind o en inline styles dentro de los componentes.

El objetivo es implementar el diseño propuesto sin romper el light theme existente, introduciendo el sistema de tokens como infraestructura que permita ambos temas. El dark theme es la identidad visual principal; el light theme es el fallback y el estado actual refinado.

---

## Estado actual del codebase (hallazgos críticos)

- **`index.css`**: Sin CSS custom properties. Solo fuente Inter y utilidades mínimas.
- **`tailwind.config.ts`**: Tiene tokens semánticos parciales (`primary`, `surface`, `neutral-*`), pero sin soporte de temas.
- **`index.html`**: Sin `data-theme`. `theme-color` fijo en `#6366F1`.
- **`BudgetAlertBanner.tsx`**: Objeto `config` con `bg-yellow-50`, `bg-red-50`, `text-yellow-800`, etc. Rompe completamente el dark mode.
- **`BudgetWidget.tsx`**: Records `barColor` y `remainingColor` con clases `bg-yellow-400`, `text-green-600`, etc. Mismo problema.
- **`GraficoBarras.tsx`**: `fill: '#374151'` hardcodeado para labels del eje Y. Invisible en dark mode (ratio 1.5:1).
- **`CategoriaSelector.tsx`**: Inline styles `backgroundColor: '#F3F4F6'` y `color: '#374151'` para chips no seleccionados.
- **`EmptyState.tsx`**: Inline style `color: '#A5B4FC'` en el ícono Wallet.
- **`types/index.ts`**: `CATEGORY_BADGE_STYLES` con fondos pastel claros (`#FFF7ED`, `#EFF6FF`, etc.) que no contrastan en dark.
- **`SettingsPage.tsx`**: Usa `text-red-600` directo en lugar del token `text-danger`.

---

## Archivos críticos

| Archivo | Rol en el plan |
|---|---|
| `frontend/src/index.css` | Destino de todos los CSS custom properties |
| `frontend/index.html` | Agregar `data-theme="dark"` inicial y meta theme-color |
| `frontend/tailwind.config.ts` | Agregar tokens semánticos para las nuevas custom properties |
| `frontend/src/types/index.ts` | Agregar `SYSTEM_CATEGORIES_DARK` y `CATEGORY_BADGE_STYLES_DARK` |
| `frontend/src/hooks/useTheme.ts` | Nuevo hook — gestión del tema |
| `frontend/src/components/ui/ThemeToggle.tsx` | Nuevo componente — botón toggle |
| `frontend/src/components/ui/Card.tsx` | Glassmorphism y tokens |
| `frontend/src/components/ui/Button.tsx` | Tokens de color para todos los estados |
| `frontend/src/components/ui/Input.tsx` | Tokens de color para todos los estados |
| `frontend/src/components/ui/FAB.tsx` | Color cyan y shadow-fab dark |
| `frontend/src/components/ui/Modal.tsx` | Glassmorphism modal |
| `frontend/src/components/ui/BottomSheet.tsx` | Glassmorphism sheet |
| `frontend/src/components/dashboard/GraficoBarras.tsx` | Fix crítico: fill hardcodeado |
| `frontend/src/components/dashboard/BudgetWidget.tsx` | Fix crítico: mapas de clases |
| `frontend/src/components/dashboard/BudgetAlertBanner.tsx` | Fix crítico: objeto config |
| `frontend/src/components/gastos/CategoriaSelector.tsx` | Fix crítico: inline styles |
| `frontend/src/pages/DashboardPage.tsx` | ThemeToggle en header, tokens |
| `frontend/src/pages/SettingsPage.tsx` | ThemeToggle en header, tokens |

---

## Cambios generales de aspecto

### Dark theme (identidad principal)
- **Fondo base**: gradiente diagonal 135° de `#0f1b3d` a `#1a2a5e`, aplicado sobre `<html>` para cubrir toda la ventana incluyendo el área de scroll.
- **Cards con glassmorphism**: `background: rgba(15,27,61,0.85)` + `backdrop-filter: blur(12px)` + `border: 1px solid rgba(255,255,255,0.12)` + `border-radius: 18px`. Efecto vidrio sobre el gradiente azul marino.
- **Modal/BottomSheet**: Mayor opacidad (`0.95`) porque están en primer plano.
- **Header sticky**: `backdrop-filter: blur(8px)` con fondo `rgba(10,18,45,0.90)`.
- **Color de acento primario**: Cambia de índigo `#6366F1` a cyan `#00C2FF` — color complementario que resalta sobre el azul marino sin colisión cromática.
- **Botón primary**: Texto negro `#000000` sobre el cyan (el cyan es luminoso; blanco sobre cyan falla WCAG).
- **Tipografía**: Blanco puro para primarios, `rgba(255,255,255,0.65)` para secundarios, `rgba(255,255,255,0.50)` para terciarios.

### Light theme (refinado, no roto)
- Fondo `#F5F5F7` (gris Apple, no blanco puro). Cards blanco sólido. Sin glassmorphism.
- Acento primario cambia a `#0066CC` (azul Apple) — mayor contraste que el índigo actual.
- Sin regresión visual: los tokens de `:root` replicarán los valores actuales de Tailwind.

### Transición entre temas
- `transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease, box-shadow 200ms ease` en `:root`.
- El gradiente de fondo NO transiciona (artefactos visuales).
- Fallback `@supports not (backdrop-filter: blur(12px))`: fondo `rgba(10,16,40,0.97)` sin blur para GPUs limitadas.

---

## Fases de implementación

### Fase 1 — Infraestructura de tokens (sin dependencias)
**Archivos:** `index.css`, `index.html`, `tailwind.config.ts`

1. En `index.css`, dentro de `@layer base`, agregar:
   - `:root, [data-theme="light"] { ... }` con los ~30 tokens del light theme (Sección 4.2 del doc).
   - `[data-theme="dark"] { ... }` con los ~40 tokens del dark theme (Secciones 2 y 5 del doc).
   - Clase utilitaria `.glass-card` con `@supports (backdrop-filter: blur(12px))` y fallback.
   - Transición global sobre `[data-theme]`.
   - `html { background: var(--bg-base); }` para que el gradiente cubra el viewport.

2. En `index.html`, agregar `data-theme="dark"` al `<html>` como valor inicial para evitar FOUC.

3. En `tailwind.config.ts`, agregar los nuevos tokens al `extend.colors` para autocomplete en IDE (opcional pero recomendado para productividad).

**Criterio de validación:** la app se ve con fondo azul marino oscuro al abrir. El light theme no tiene cambios visuales cuando se fuerza `data-theme="light"`.

---

### Fase 2 — Hook useTheme y componente ThemeToggle
**Archivos:** `frontend/src/hooks/useTheme.ts` (nuevo), `frontend/src/components/ui/ThemeToggle.tsx` (nuevo)

1. **`useTheme.ts`**: 
   - Lee `localStorage.getItem('theme')` al montar. Si no existe, lee `prefers-color-scheme`.
   - Aplica `document.documentElement.setAttribute('data-theme', theme)`.
   - Expone `{ theme, toggleTheme }`. `toggleTheme` actualiza atributo DOM + localStorage + meta `theme-color`.
   - Escucha `prefers-color-scheme` solo si no hay override en localStorage.

2. **`ThemeToggle.tsx`**: 
   - Botón circular 32×32px con ícono `Moon` (dark activo) o `Sun` (light activo) de Lucide React.
   - `aria-label` dinámico. Estilos con CSS variables.

3. Integrar `ThemeToggle` en header de `DashboardPage.tsx` y `SettingsPage.tsx` (antes del botón `<Settings>`).

**Criterio de validación:** el toggle cambia el tema visualmente y persiste al recargar.

---

### Fase 3 — Componentes UI base (Card, Button, Input, FAB)
**Archivos:** `Card.tsx`, `Button.tsx`, `Input.tsx`, `FAB.tsx`, `Modal.tsx`, `BottomSheet.tsx`

**Card.tsx:**
- Clase `glass-card` para variante `elevated` en dark mode.
- `bg-[var(--bg-card)]` en lugar de `bg-surface`.
- `hover:bg-[var(--bg-card-hover)]` en lugar de `hover:bg-neutral-100/50`.
- Sombra: `var(--shadow-card)` en lugar de `shadow-md`.

**Button.tsx:**
- Variante `primary`: `bg-[var(--accent-primary)]`, texto `text-[var(--btn-primary-text)]` (negro en dark, blanco en light).
- Variante `secondary`: `rgba(255,255,255,0.06)` de fondo + border `var(--accent-primary)` en dark.
- Variante `ghost`: `text-[var(--text-secondary)]` + hover `rgba(255,255,255,0.08)` en dark.
- Variante `danger`: `bg-[var(--accent-danger)]` + texto negro en dark.
- Agregar token CSS `--btn-primary-text: #FFFFFF` en light y `#000000` en dark.

**Input.tsx:**
- Todos los estados (`border-neutral-300`, `border-danger`, `border-success`, `focus:border-primary`) → tokens CSS equivalentes.
- Labels, hints, placeholders, iconos → tokens semánticos.

**FAB.tsx:**
- `bg-[var(--accent-primary)]` + ícono `#000000` + `var(--shadow-fab)`.

**Modal.tsx / BottomSheet.tsx:**
- Aplicar glassmorphism modal (Sección 5.3): `background: rgba(10,20,50,0.95)` + `backdrop-filter: blur(24px)`.
- Tokens de texto y borde.

**Criterio de validación:** todos los botones, inputs y cards se ven correctamente en ambos temas.

---

### Fase 4 — Fixes críticos de dashboard
**Archivos:** `GraficoBarras.tsx`, `BudgetWidget.tsx`, `BudgetAlertBanner.tsx`, `GastosList.tsx`, `GastoItem.tsx`, `ResumenMes.tsx`

**GraficoBarras.tsx (hallazgo crítico):**
- Consumir `useTheme()` para derivar `labelColor` y `cursorColor`.
- `tick={{ fontSize: 12, fill: labelColor }}` donde `labelColor = theme === 'dark' ? 'rgba(255,255,255,0.65)' : '#374151'`.
- Cursor: `rgba(0,194,255,0.06)` en dark, `rgba(99,102,241,0.05)` en light.
- Tooltip personalizado: glassmorphism dark / blanco sólido light.
- Colores de barras: usar `SYSTEM_CATEGORIES_DARK[id]` cuando tema es dark.

**BudgetWidget.tsx (hallazgo crítico):**
- Records `barColor` y `remainingColor`: reemplazar clases Tailwind hardcodeadas por tokens CSS.
- `bg-[var(--accent-primary)]`, `bg-[var(--accent-warning)]`, `bg-[var(--accent-danger)]`.
- `text-[var(--accent-success)]`, `text-[var(--accent-warning)]`, `text-[var(--accent-danger)]`.
- Barra de progreso track: `rgba(255,255,255,0.08)` en dark.
- Skeleton de loading: `bg-[var(--bg-skeleton)]`.

**BudgetAlertBanner.tsx (hallazgo crítico):**
- Reemplazar objeto `config` con strings de clase por tokens CSS. En lugar de dos objetos `configLight/configDark`, usar clases únicas con tokens semánticos que cambian solas según el tema.
- `bg-[var(--accent-warning-subtle)] border-l-[3px] border-[var(--accent-warning)] text-[var(--accent-warning)]` para `warning`.
- Análogo para `critical` y `exceeded`.

**GastosList.tsx / GastoItem.tsx / ResumenMes.tsx:**
- Reemplazar clases `text-neutral-*`, `border-neutral-*` por tokens CSS.
- Select de mes: `bg-[var(--bg-input)] border-[var(--border-default)] text-[var(--text-secondary)]`.

**Criterio de validación:** labels del gráfico visibles en dark. Barra de presupuesto con colores correctos. Banners de alerta integrados en el glassmorphism.

---

### Fase 5 — Formulario y categorías
**Archivos:** `CategoriaSelector.tsx`, `GastoForm.tsx`, `CategoriaCustomInput.tsx`, `types/index.ts`

**types/index.ts:**
- Agregar `SYSTEM_CATEGORIES_DARK` con los 10 colores dark (Sección 6 del doc).
- Agregar `CATEGORY_BADGE_STYLES_DARK` con fondos y textos dark (Sección 6).
- Actualizar `getCategoryBadgeStyle(categoria, theme)` para retornar el set correcto según tema.

**CategoriaSelector.tsx (hallazgo crítico):**
- Chip no seleccionado: reemplazar `backgroundColor: '#F3F4F6'` por `var(--bg-card-hover)` y `color: '#374151'` por `var(--text-secondary)`.
- Chip seleccionado: usar colores dark mode del nuevo mapa cuando el tema es dark.

**GastoForm.tsx:**
- Input de monto: `bg-[var(--bg-input)]`, `border-[var(--border-default)]`, `focus:border-[var(--border-focus)]`, `focus:shadow-[var(--shadow-input-focus)]`.
- Símbolo "$": `text-[var(--text-tertiary)]`.
- Error banner: `bg-[var(--accent-danger-subtle)] border-l-[3px] border-[var(--accent-danger)]`.
- Botón "Guardar gasto": mismo tratamiento que botón primary (cyan con texto negro en dark).

**Criterio de validación:** el formulario se abre en el modal/sheet con glassmorphism. Los chips de categoría se ven correctamente en ambos temas.

---

### Fase 6 — Páginas de auth y Settings
**Archivos:** `LoginPage.tsx`, `RegisterPage.tsx`, `SettingsPage.tsx`, `LoginForm.tsx`, `RegisterForm.tsx`

- **Páginas auth**: el fondo usa `var(--bg-base)`. Card del formulario: glassmorphism pronunciado `--bg-surface-auth`.
- Logo: `bg-[var(--accent-primary)]` con ícono negro.
- Links "¿Olvidaste tu contraseña?", "Regístrate": `text-[var(--text-link)]` o `text-[var(--accent-primary)]`.
- Error de credenciales: `bg-[var(--accent-danger-subtle)] border-l-[var(--accent-danger)]`.
- **SettingsPage**: reemplazar `text-red-600` por `text-[var(--text-error)]`. Header con glassmorphism. ThemeToggle ya integrado desde Fase 2.

**Criterio de validación:** flujo completo de login/register se ve en dark. Campos de configuración con tokens correctos.

---

### Fase 7 — Pulido: EmptyState, Skeleton, Toast, Footer
**Archivos:** `EmptyState.tsx`, `Skeleton.tsx`, `Toast.tsx`, `App.tsx`

- **EmptyState**: ícono Wallet: `color: '#A5B4FC'` → `rgba(0,194,255,0.50)`.
- **Skeleton**: `bg-neutral-200` → `bg-[var(--bg-skeleton)]`. Animación pulse a `var(--bg-skeleton-highlight)`.
- **Toast**: verificar que `bg-success`, `bg-danger`, `bg-warning` usen los tokens `--accent-success`, `--accent-danger`, `--accent-warning`. Sombra: `var(--shadow-toast)`.
- **Footer (App.tsx)**: `text-neutral-400` → `text-[var(--text-tertiary)]`.
- **Meta theme-color**: el hook `useTheme` actualiza dinámicamente `content` a `#0f1b3d` (dark) o `#F5F5F7` (light).

**Criterio de validación:** el dashboard completo —incluyendo estado vacío, carga con skeleton y toasts— se ve cohesivo en ambos temas.

---

## Consideraciones técnicas

### Tailwind + CSS custom properties
Tailwind 3.x permite `bg-[var(--bg-card)]` directamente sin agregar al config. Agregar las variables al config de todas formas para tener autocompletado en IDE y evitar typos.

### Recharts y SVG
Las CSS custom properties no se propagan a atributos SVG (`fill`, `stroke`). La solución para `GraficoBarras` es leer el tema desde el hook y pasar colores como props al componente de Recharts — no hay forma de evitar JavaScript aquí.

### `<select>` nativo en dark mode
Los `<option>` dentro del dropdown nativo pueden heredar colores del SO. Es una limitación conocida cross-browser. El `<select>` en sí (elemento colapsado) sí acepta estilos CSS. Documentar como limitación esperada; no es un bug a corregir.

### FOUC (Flash of Unstyled Content)
Mitigado poniendo `data-theme="dark"` directamente en el `<html>` de `index.html` antes de que React hidrate. El hook `useTheme` lo sobrescribirá inmediatamente según localStorage.

### Glassmorphism y rendimiento móvil
Usar `@supports (backdrop-filter: blur(12px))` con fallback a `rgba(10,16,40,0.97)` sin blur para dispositivos que no soportan la propiedad o donde `prefers-reduced-motion: reduce` está activo.

---

## Verificación end-to-end

1. Iniciar `npm run dev` en `frontend/`.
2. Verificar que el fondo oscuro aparece sin parpadeo al cargar por primera vez.
3. Toggle de tema: alternar dark ↔ light. Verificar persistencia en recarga.
4. Dashboard en dark: verificar labels del gráfico visibles, barra de presupuesto, banner de alerta.
5. Abrir formulario de gasto: chips de categoría, glassmorphism del modal, botón cyan con texto negro.
6. Flujo de login/register en dark.
7. SettingsPage con ThemeToggle funcional.
8. Forzar `data-theme="light"` en DevTools: verificar que el light theme no tiene regresión visual respecto al estado actual de la app.
9. Verificar en móvil (Chrome DevTools device emulation) que el glassmorphism funciona o aplica el fallback correctamente.
