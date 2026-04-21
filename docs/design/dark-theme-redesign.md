# Dark Theme Redesign — Control de Gastos
**Versión:** 1.0.0
**Fecha:** 2026-04-21
**Autor:** Richard (UX Designer Senior)
**Destinatario:** Teff (Frontend Engineer)
**Referencia visual:** iCloud Dashboard (dark)
**Stack:** React + TypeScript + Tailwind CSS + CSS Custom Properties

---

## Sección 1: Hallazgos del análisis

### 1.1 Inventario de componentes relevados

| Componente | Ruta | Rol en la UI |
|---|---|---|
| `App` | `frontend/src/App.tsx` | Shell de la aplicación. Contiene el router, el `ToastProvider` y el `Footer`. |
| `DashboardPage` | `frontend/src/pages/DashboardPage.tsx` | Pantalla principal post-login. Orquesta header, widgets, gráfico, lista y formulario. |
| `LoginPage` | `frontend/src/pages/LoginPage.tsx` | Pantalla de autenticación. Card centrada con logo y `LoginForm`. |
| `RegisterPage` | `frontend/src/pages/RegisterPage.tsx` | Pantalla de registro. Card centrada con `RegisterForm`. |
| `SettingsPage` | `frontend/src/pages/SettingsPage.tsx` | Configuración de presupuesto. Header con back, sección con inputs numéricos. |
| `Header` (inline en DashboardPage) | `DashboardPage.tsx` | Sticky. Saludo + fecha, avatar con iniciales, botones Settings y LogOut. |
| `Footer` (inline en App) | `App.tsx` | Texto de créditos centrado. |
| `ResumenMes` | `frontend/src/components/dashboard/ResumenMes.tsx` | Card con total del mes, variación porcentual vs. mes anterior. |
| `GraficoBarras` | `frontend/src/components/dashboard/GraficoBarras.tsx` | Card con BarChart horizontal por categoría (Recharts). Tooltip personalizado. |
| `GastosList` | `frontend/src/components/dashboard/GastosList.tsx` | Lista de gastos con selector de mes y expansión. Contiene filas de `GastoItem`. |
| `GastoItem` | `frontend/src/components/dashboard/GastoItem.tsx` | Fila de gasto individual: badge, descripción, fecha, monto, botón eliminar. |
| `BudgetWidget` | `frontend/src/components/dashboard/BudgetWidget.tsx` | Card de presupuesto mensual con barra de progreso y estado de alerta. |
| `BudgetAlertBanner` | `frontend/src/components/dashboard/BudgetAlertBanner.tsx` | Banner dismissible de alerta de presupuesto. |
| `GastoForm` | `frontend/src/components/gastos/GastoForm.tsx` | Formulario de registro de gasto: monto, categoría, descripción, fecha. |
| `CategoriaSelector` | `frontend/src/components/gastos/CategoriaSelector.tsx` | Grid de chips de categoría con estado selected. |
| `CategoriaCustomInput` | `frontend/src/components/gastos/CategoriaCustomInput.tsx` | Input condicional para categoría "Otros". Animación max-height. |
| `LoginForm` | `frontend/src/components/auth/LoginForm.tsx` | Formulario de login con error banner inline. |
| `RegisterForm` | `frontend/src/components/auth/RegisterForm.tsx` | Formulario de registro con validación on-blur. |
| `Button` | `frontend/src/components/ui/Button.tsx` | Botón con 4 variantes, 3 tamaños, loading state. |
| `Input` | `frontend/src/components/ui/Input.tsx` | Input con label, estados de validación, íconos y toggle de contraseña. |
| `Card` | `frontend/src/components/ui/Card.tsx` | Contenedor con variantes `default` (borde) y `elevated` (sombra). |
| `Badge` | `frontend/src/components/ui/Badge.tsx` | Badge de categoría en tamaños `sm` y `md`. Colores dinámicos via `getCategoryBadgeStyle`. |
| `FAB` | `frontend/src/components/ui/FAB.tsx` | Botón flotante circular. Animación Plus→X. |
| `Modal` | `frontend/src/components/ui/Modal.tsx` | Diálogo centrado para desktop. Overlay oscuro, animación scale-in. |
| `BottomSheet` | `frontend/src/components/ui/BottomSheet.tsx` | Sheet desde el bottom para mobile. Swipe-to-close, handle. |
| `EmptyState` | `frontend/src/components/ui/EmptyState.tsx` | Estado vacío con ícono, título, subtítulo y CTA. |
| `Skeleton` / `DashboardSkeleton` | `frontend/src/components/ui/Skeleton.tsx` | Skeleton loader para el dashboard completo durante carga. |
| `Toast` / `ToastContainer` | `frontend/src/components/ui/Toast.tsx` | Notificaciones flotantes con auto-dismiss. |
| `ToastProvider` | `frontend/src/components/ui/ToastProvider.tsx` | Context provider para el sistema de toasts. |

---

### 1.2 Colores actuales identificados

#### Colores hardcodeados directamente en componentes (no usando tokens Tailwind)

| Archivo | Valor hardcodeado | Contexto |
|---|---|---|
| `EmptyState.tsx` | `style={{ color: '#A5B4FC' }}` | Color del ícono `Wallet` en estado vacío |
| `GraficoBarras.tsx` | `fill: '#374151'` | Color de los labels del eje Y en el gráfico |
| `GraficoBarras.tsx` | `cursor={{ fill: 'rgba(99,102,241,0.05)' }}` | Cursor de hover en el gráfico |
| `CategoriaSelector.tsx` | `backgroundColor: '#F3F4F6'` | Fondo de chips no seleccionados |
| `CategoriaSelector.tsx` | `color: '#374151'` | Texto de chips no seleccionados |
| `Button.tsx` | `bg-[#4338CA]`, `bg-[#A5B4FC]`, `bg-[#E0E7FF]`, `bg-[#DC2626]`, `bg-[#B91C1C]`, `bg-[#FCA5A5]` | Estados active y disabled de variantes primary y danger |
| `Badge.tsx` | `borderColor: categoria.color + '40'` | Borde del badge md con 25% opacidad |
| `types/index.ts` | `CATEGORY_BADGE_STYLES` — 10 entradas con hex | Fondos y colores de texto de badges por categoría |
| `types/index.ts` | `SYSTEM_CATEGORIES` — 10 entradas con hex | Colores definitorios de cada categoría |
| `index.html` | `content="#6366F1"` | Meta tag `theme-color` del navegador |

#### Tokens Tailwind del `tailwind.config.ts` con sus valores

| Token | Hex |
|---|---|
| `primary` | `#6366F1` |
| `primary-dark` | `#4F46E5` |
| `primary-light` | `#EEF2FF` |
| `secondary` | `#8B5CF6` |
| `success` | `#22C55E` |
| `danger` | `#EF4444` |
| `warning` | `#F59E0B` |
| `background` | `#F8FAFC` |
| `surface` | `#FFFFFF` |
| `neutral-900` | `#111827` |
| `neutral-700` | `#374151` |
| `neutral-600` | `#6B7280` |
| `neutral-400` | `#9CA3AF` |
| `neutral-300` | `#D1D5DB` |
| `neutral-200` | `#E5E7EB` |
| `neutral-100` | `#F3F4F6` |

#### Nota sobre discrepancia preexistente en colores de categorías

El `CHANGELOG-design.md` sección 1.2 documenta un conflicto activo: los colores declarados en `design-system.md §3.1` difieren de los implementados en `types/index.ts` (SYSTEM_CATEGORIES) para Alimentación, Hogar, Salud y Ocio. **Este documento usa los valores de `types/index.ts` como fuente de verdad**, que es la implementación real y lo que el usuario ve hoy.

---

### 1.3 Problemas de accesibilidad en el diseño actual que se agravarían en dark mode

> **[Severidad: Crítico]** — Los colores de badge light-mode (fondos tipo `#FFF7ED` con texto `#C2410C`) están hardcodeados en `types/index.ts` como `CATEGORY_BADGE_STYLES`. Sobre un fondo oscuro de card, estos fondos pastel claro no tienen contraste suficiente con el fondo oscuro del contenedor, y el texto oscuro sobre fondo pastel claro tampoco cumple el ratio 4.5:1 en modo oscuro.
> **Por qué importa:** Los badges se usan en la lista de gastos y en el formulario. Si los fondos de badge no se adaptan al dark mode, serán islas de color incorrecto flotando sobre superficies oscuras.
> **Recomendación:** Definir un segundo set de estilos de badge exclusivos para dark mode con mayor saturación y fondos más opacos. Ver Sección 6.

> **[Severidad: Crítico]** — Los colores hardcodeados en `GraficoBarras.tsx` (`fill: '#374151'` para los labels del eje Y, `cursor: rgba(99,102,241,0.05)`) son colores del tema claro. En dark mode, `#374151` sobre un fondo oscuro tiene ratio ~1.5:1. El texto del gráfico se volvería invisible.
> **Por qué importa:** El gráfico de barras es el segundo elemento de mayor jerarquía visual del dashboard. Si sus labels desaparecen, el usuario pierde el contexto de las barras.
> **Recomendación:** Estos valores hardcodeados deben ser reemplazados por CSS custom properties que varíen con el tema. Documentado en Sección 7, checklist ítem específico.

> **[Severidad: Crítico]** — `BudgetAlertBanner` y `BudgetWidget` usan clases Tailwind hardcodeadas para los estados de alerta en light mode (`bg-yellow-50`, `border-yellow-300`, `text-yellow-800`, `bg-red-50`, `text-red-800`, `text-green-600`, `bg-yellow-400`, `text-yellow-600`, `text-red-600`, `text-red-700`). Sobre un fondo oscuro, los fondos `bg-yellow-50` y `bg-red-50` son casi blancos y rompen completamente la estética dark.
> **Por qué importa:** La barra de presupuesto y el banner de alerta son elementos de feedback crítico para el usuario. Si se ven rotos, generan desconfianza.
> **Recomendación:** Reemplazar con tokens semánticos que se adapten al tema. Ver Sección 3 — especificación por pantalla.

> **[Severidad: Mejora]** — El `CategoriaSelector` usa `backgroundColor: '#F3F4F6'` y `color: '#374151'` hardcodeados inline para los chips no seleccionados. En dark mode, `#F3F4F6` sobre fondo oscuro sería un chip de color casi blanco, que no es el comportamiento deseado.
> **Por qué importa:** Los chips de selección de categoría son el segundo elemento más interactivo del formulario (después del campo de monto).
> **Recomendación:** Reemplazar con variables CSS. Documentado en checklist.

> **[Severidad: Mejora]** — El `GastoItem` usa `opacity-0 group-hover:opacity-100` para el botón de eliminar. En dark mode, el hover necesita mantener suficiente contraste. Este patrón funciona correctamente siempre que el color del ícono sea adaptado al tema.
> **Por qué importa:** Botón destructivo debe ser siempre distinguible cuando está visible.
> **Recomendación:** Verificar que el color base del ícono de papelera en dark mode use `--text-secondary` y en hover `--accent-danger`.

> **[Severidad: Sugerencia]** — El `Footer` usa `text-neutral-400` con fondo `bg-background`. En dark mode, si `background` se convierte en gradiente azul oscuro, `neutral-400` (`#9CA3AF`) tendría ratio ~5.3:1 sobre `#0f1b3d` — pasa WCAG AA — pero perceptivamente podría ser más brillante de lo deseable. Ajustar a `--text-tertiary` para que se integre mejor con la estética.

> **[Severidad: Sugerencia]** — La meta tag `theme-color` del navegador está fija en `#6366F1` en `index.html`. En dark mode, debería ser el color de la barra de estado del fondo oscuro (`#0f1b3d`). Esto no es accesibilidad sino consistencia de marca. Se puede actualizar dinámicamente desde el hook `useTheme`.

---

### 1.4 Deuda de diseño preexistente a reportar

1. **Conflicto de fuentes de verdad de colores de categorías** (DD-001 en CHANGELOG): `design-system.md §3.1` tiene valores distintos a los de `types/index.ts`. Esto no bloquea el dark theme pero debe resolverse antes de que el dark theme agregue un tercer set de valores.

2. **Discrepancia en el brief sobre la cantidad de categorías**: El brief menciona 11 categorías (Comida, Despensa, Transporte, Salud, Entretenimiento, Educación, Ropa, Servicios, Hogar, Suscripciones, Otro). El sistema real tiene 10 categorías (Alimentación, Transporte, Hogar, Salud, Ocio, Ropa, Educación, Servicios, Viajes, Otros). Este documento usa las 10 categorías reales del código.

3. **`BudgetAlertBanner` usa clases JSX condicionales** con strings de clase completas hardcodeadas (ej. `'bg-yellow-50 border-yellow-300'`) en un objeto de configuración `config`. Esto requiere que Teff agregue un segundo conjunto de clases dark-mode en ese objeto, o que los reemplace por tokens semánticos. La estrategia recomendada está en la Sección 7.

4. **El CHANGELOG sección 2.1 define informalmente una "Guía Visual Rápida"** con fondos `#0F1117` y `#1A1D27` que no corresponden a la referencia visual iCloud solicitada. Esos valores quedan obsoletos con este documento.

---

## Sección 2: Tokens del design system oscuro

Los siguientes tokens se implementan como CSS custom properties bajo el selector `[data-theme="dark"]` en `index.css`. Se presentan con su justificación de contraste según WCAG 2.1 AA.

### Metodología de verificación de contraste

El fondo base del dark theme es el gradiente de `#0f1b3d` a `#1a2a5e`. Para calcular contraste de texto, se usa el valor más claro del gradiente (`#1a2a5e`) como caso conservador (peor caso). La luminancia relativa de `#1a2a5e` ≈ 0.018.

---

### Fondos

```
--bg-base:
  Valor: linear-gradient(135deg, #0f1b3d 0%, #122044 35%, #162650 65%, #1a2a5e 100%)
  Uso: fondo del <body> / min-h-screen. Cubre toda la ventana.
  Nota: el gradiente va de esquina superior izquierda a inferior derecha.
        El eje 135deg produce la diagonal iCloud (de arriba-izquierda hacia abajo-derecha).

--bg-card:
  Valor: rgba(15, 27, 61, 0.85)
  Uso: fondo de Card, GastosList, BudgetWidget, secciones de SettingsPage.
  Contraste WCAG sobre --bg-base: el color efectivo de la card mezclado
  con el fondo base es ≈ #0f1b3d. Blanco puro (#FFF) vs #0f1b3d = 17.5:1. PASA.

--bg-card-hover:
  Valor: rgba(15, 27, 61, 0.92)
  Uso: estado hover de Card interactiva, GastoItem en hover, chips de categoría.
  Color efectivo ≈ #0e1a3b. Contraste blanco = 18:1. PASA.

--bg-input:
  Valor: rgba(10, 18, 45, 0.70)
  Uso: inputs, selects, textareas.
  Color efectivo ≈ #10193a. Contraste blanco = 16.8:1. PASA.

--bg-input-focus:
  Valor: rgba(10, 18, 45, 0.90)
  Uso: estado focus del input.

--bg-overlay:
  Valor: rgba(0, 0, 0, 0.65)
  Uso: overlay de Modal y BottomSheet.

--bg-header:
  Valor: rgba(10, 18, 45, 0.90)
  Uso: header sticky. Ligero efecto glass sin blur (para no competir con el contenido).
  Se recomienda agregar backdrop-filter: blur(8px) únicamente en el header.

--bg-skeleton:
  Valor: rgba(255, 255, 255, 0.06)
  Uso: bloques de skeleton loader.

--bg-skeleton-highlight:
  Valor: rgba(255, 255, 255, 0.10)
  Uso: estado brillante de la animación pulse del skeleton.

--bg-surface-auth:
  Valor: rgba(10, 18, 50, 0.95)
  Uso: card del formulario de login y registro.
  Opacidad más alta porque son pantallas sin contenido detrás (toda la pantalla es gradiente).
```

---

### Texto

```
--text-primary:
  Valor: #FFFFFF
  Uso: totales, títulos de sección, montos de gastos, nombres en header.
  Contraste sobre --bg-card (#0f1b3d efectivo) = 17.5:1. PASA ampliamente.

--text-secondary:
  Valor: rgba(255, 255, 255, 0.65)
  Color percibido sobre --bg-card ≈ #8fa0c0
  Contraste vs #0f1b3d ≈ 6.4:1. PASA AA (requiere 4.5:1).
  Uso: etiquetas de campos, fechas en GastoItem, texto secundario en BudgetWidget,
       labels de eje Y del gráfico, placeholder de inputs.

--text-tertiary:
  Valor: rgba(255, 255, 255, 0.50)
  Color percibido sobre --bg-card ≈ #6b7fa0
  Contraste vs #0f1b3d ≈ 4.7:1. PASA AA (ajustado desde 0.40 que daba 3.5:1 — NO pasaba).
  Uso: hints bajo inputs, contador de caracteres, metadatos muy secundarios,
       porcentaje del gráfico, "0%" y "100%" bajo la barra de presupuesto.

--text-disabled:
  Valor: rgba(255, 255, 255, 0.25)
  Uso: texto de elementos disabled (inputs, botones). WCAG 1.4.3 exime explícitamente
       a elementos deshabilitados del requisito de contraste mínimo.

--text-link:
  Valor: #60C8FF
  Uso: links inline ("¿Olvidaste tu contraseña?", "Regístrate", enlace en error de email duplicado).
  Contraste vs #0f1b3d = 9.8:1. PASA.

--text-error:
  Valor: #FF8080
  Uso: mensajes de error de validación inline.
  Contraste vs --bg-input (#10193a efectivo) = 6.1:1. PASA.

--text-success:
  Valor: #6EE7B7
  Uso: íconos de validación positiva, texto de variación mensual positiva.
  Contraste vs --bg-card = 9.2:1. PASA.
```

---

### Bordes

```
--border-subtle:
  Valor: rgba(255, 255, 255, 0.08)
  Uso: separadores internos entre ítems de lista (GastoItem border-b), líneas de
       encabezado dentro de cards.

--border-default:
  Valor: rgba(255, 255, 255, 0.14)
  Uso: borde exterior de Card, borde de inputs en estado default, borde del header.

--border-strong:
  Valor: rgba(255, 255, 255, 0.22)
  Uso: borde de inputs en estado focus (complementa el ring), borde de chips seleccionados.

--border-focus:
  Valor: rgba(0, 194, 255, 0.80)
  Uso: borde de input/select en estado focus. Consistente con --accent-primary.

--border-error:
  Valor: rgba(248, 113, 113, 0.80)
  Uso: borde de input en estado error.

--border-success:
  Valor: rgba(110, 231, 183, 0.70)
  Uso: borde de input en estado valid.
```

---

### Acentos

```
--accent-primary:
  Valor: #00C2FF
  Decisión: Se adopta el cyan iCloud (#00C2FF) en lugar de mantener el índigo actual (#6366F1).
  Justificación: (1) El índigo #6366F1 tiene contraste 4.6:1 sobre fondos blancos — pasa en
  light mode — pero sobre el fondo oscuro #0f1b3d su contraste sube a ~11:1, lo que lo hace
  técnicamente válido. Sin embargo, visualmente el índigo sobre azul marino oscuro produce
  una mezcla de tonos análogos que reduce la legibilidad perceptiva: ambos colores pertenecen
  al mismo cuadrante azul del círculo cromático. (2) El cyan #00C2FF opera como color
  complementario-análogo del fondo azul marino, creando una separación cromática clara que
  resalta las acciones primarias sin esfuerzo. (3) Adoptar el cyan es consistente con el
  lenguaje visual de la referencia iCloud y establece una identidad reconocible del dark theme.
  (4) En el light theme el índigo se mantiene, por lo que hay continuidad de identidad para
  usuarios que alternen entre temas.
  Contraste #00C2FF vs #0f1b3d = 9.1:1. PASA holgadamente.
  Uso: FAB, botón primary dark, links activos, ring de focus, borde de input focus,
       toggle de tema activo.

--accent-primary-hover:
  Valor: #33CEFF
  Uso: estado hover del botón primary y FAB en dark mode.

--accent-primary-active:
  Valor: #00A8D9
  Uso: estado active/pressed del botón primary.

--accent-primary-disabled:
  Valor: rgba(0, 194, 255, 0.30)
  Uso: botón primary en estado disabled.

--accent-primary-subtle:
  Valor: rgba(0, 194, 255, 0.10)
  Uso: cursor de hover en gráfico, fondo de chips de categoría en hover,
       ring de focus (3px, esta opacidad da el halo sin agresividad).

--accent-success:
  Valor: #34D399
  Uso: toast de éxito, ícono de validación positiva, indicador de variación mensual negativa
       (gasto disminuyó = positivo para el usuario), barras del gráfico de "Salud".
  Contraste vs --bg-card = 8.4:1. PASA.

--accent-success-subtle:
  Valor: rgba(52, 211, 153, 0.15)
  Uso: fondo del banner de estado "none" en BudgetWidget (presupuesto bajo control).

--accent-danger:
  Valor: #F87171
  Uso: toast de error, mensajes de validación, barra de presupuesto en estado "exceeded",
       borde del banner de alerta crítica, botón danger.
  Contraste vs --bg-card = 5.8:1. PASA.

--accent-danger-subtle:
  Valor: rgba(248, 113, 113, 0.15)
  Uso: fondo del banner de error inline (GastoForm, LoginForm), fondo del BudgetAlertBanner
       en estado "critical" y "exceeded".

--accent-warning:
  Valor: #FCD34D
  Uso: ícono y texto del BudgetAlertBanner en estado "warning",
       barra de presupuesto en estado "warning".
  Contraste vs --bg-card = 11.2:1. PASA.

--accent-warning-subtle:
  Valor: rgba(252, 211, 77, 0.12)
  Uso: fondo del BudgetAlertBanner en estado "warning".

--accent-primary-glow:
  Valor: rgba(0, 194, 255, 0.20)
  Uso: box-shadow de glow del FAB, glow de Card en hover, ring de focus en inputs.
```

---

### Sombras

```
--shadow-card:
  Valor: 0 8px 32px rgba(0, 0, 0, 0.40), 0 1px 0 rgba(255, 255, 255, 0.06) inset
  Uso: cards en estado default (ResumenMes, GraficoBarras, GastosList, BudgetWidget).
  La sombra inset simula una línea de luz superior, refuerza el efecto glass.

--shadow-card-hover:
  Valor: 0 12px 40px rgba(0, 0, 0, 0.50), 0 0 0 1px rgba(0, 194, 255, 0.15),
         0 1px 0 rgba(255, 255, 255, 0.09) inset
  Uso: estado hover de Card interactiva.
  El segundo valor agrega un ring de glow cyan-15% que comunica interactividad.

--shadow-glow:
  Valor: 0 0 20px rgba(0, 194, 255, 0.25)
  Uso: FAB, botón primary en hover en dark mode.

--shadow-fab:
  Valor: 0 4px 12px rgba(0, 194, 255, 0.35), 0 0 20px rgba(0, 194, 255, 0.15)
  Uso: FAB en dark mode. Reemplaza la sombra índigo actual.

--shadow-modal:
  Valor: 0 24px 64px rgba(0, 0, 0, 0.60), 0 1px 0 rgba(255, 255, 255, 0.08) inset
  Uso: Modal y BottomSheet.

--shadow-input-focus:
  Valor: 0 0 0 3px rgba(0, 194, 255, 0.20)
  Uso: ring de focus en inputs y selects en dark mode.

--shadow-toast:
  Valor: 0 8px 24px rgba(0, 0, 0, 0.50)
  Uso: contenedor de toasts.
```

---

## Sección 3: Rediseño por pantalla

### 3.1 Dashboard

#### Header (sticky)

- **Fondo:** `--bg-header` con `backdrop-filter: blur(8px)` y `-webkit-backdrop-filter: blur(8px)`. Borde inferior: 1px sólido `--border-default`.
- **Saludo "Hola, [nombre]":** `--text-primary`, font-size `base` (16px), weight 600.
- **Sub-texto fecha:** `--text-secondary`, font-size `xs` (12px).
- **Avatar con iniciales:** fondo `rgba(0, 194, 255, 0.20)`, texto `--accent-primary`, border 1px `rgba(0, 194, 255, 0.30)`.
- **Botones Settings y LogOut:** color `--text-tertiary` en default, `--text-secondary` en hover. Área táctil 44×44px.
- **Toggle de tema (nuevo elemento):** esquina superior derecha, ver Sección 4 para especificación completa.

#### BudgetAlertBanner

- Estado `warning`: fondo `--accent-warning-subtle`, borde izquierdo 3px `--accent-warning`, ícono y texto `--accent-warning`.
- Estado `critical`: fondo `--accent-danger-subtle`, borde izquierdo 3px `--accent-danger`, ícono y texto `--accent-danger`.
- Estado `exceeded`: fondo `rgba(248,113,113,0.20)` (ligeramente más intenso), borde izquierdo 3px `--accent-danger`, ícono `--accent-danger`, texto `--text-primary`.
- Botón de cierre (×): `--text-tertiary` en default, `--text-secondary` en hover.

#### ResumenMes (Card Elevated)

- **Card:** glassmorphism estándar. Ver Sección 5 para valores exactos.
- **Etiqueta "Total gastado en [mes]":** `--text-secondary`, font-size `xs`, uppercase, tracking-wide.
- **Número ancla (total del mes):** `--text-primary`, font-size `3xl` (30px), weight 700, `tabular-nums`. Es el elemento más grande de la pantalla — sin cambios de jerarquía.
- **Variación porcentual positiva (subió):** color `--accent-danger`, ícono `TrendingUp`.
- **Variación porcentual negativa (bajó):** color `--accent-success`, ícono `TrendingDown`.

#### GraficoBarras (Card Elevated)

- **Card:** glassmorphism estándar.
- **Título "Por categoría":** `--text-secondary`, font-size `sm`, uppercase, tracking-wide.
- **Labels del eje Y (categoria_name):** reemplazar `fill: '#374151'` hardcodeado por `var(--text-secondary)`. Esto resuelve el hallazgo crítico de visibilidad.
- **Barras:** mantener los colores de categoría. En dark mode se usan los valores más saturados de la Sección 6. Los colores de categoría provienen de `entry.categoria_color`, que es el valor del backend — se actualizan en la Sección 6.
- **Cursor de hover:** cambiar `rgba(99,102,241,0.05)` por `rgba(0, 194, 255, 0.06)`. Se mantiene el valor de opacidad bajo para no tapar las barras.
- **Tooltip personalizado:**
  - Fondo: `rgba(10, 18, 50, 0.96)` con `backdrop-filter: blur(8px)`.
  - Border: 1px `--border-default`.
  - Título de categoría: `--text-primary`, font-size `sm`, weight 600.
  - Monto: `--text-secondary`, font-size `sm`.
  - Porcentaje: `--text-tertiary`, font-size `xs`.
  - Border-radius: 10px.
  - Sombra: `--shadow-card`.

#### BudgetWidget

- **Card:** glassmorphism estándar (mismo que ResumenMes).
- **Título "Presupuesto mensual":** `--text-secondary`, font-size `sm`, weight 600.
- **Botón Settings (engranaje):** `--text-tertiary` default, `--text-secondary` hover.
- **Sub-etiqueta "Saldo disponible":** `--text-tertiary`, font-size `xs`.
- **Monto de saldo disponible:**
  - Estado `none`: `--accent-success`.
  - Estado `warning`: `--accent-warning`.
  - Estado `critical`: `--accent-danger`.
  - Estado `exceeded`: `--accent-danger` + texto "excedido" en font-size `xs`.
- **Sub-etiqueta "Gastado":** `--text-tertiary`, font-size `xs`.
- **Monto gastado:** `--text-secondary`, font-size `sm`, weight 500.
- **"de [presupuesto]":** `--text-tertiary`, font-size `xs`.
- **Barra de progreso — fondo (track):** `rgba(255, 255, 255, 0.08)`, border-radius `full`.
- **Barra de progreso — fill:**
  - Estado `none`: `--accent-primary` (cyan).
  - Estado `warning`: `--accent-warning`.
  - Estado `critical`: `--accent-danger`.
  - Estado `exceeded`: `--accent-danger` con ligero glow `box-shadow: 0 0 8px rgba(248,113,113,0.40)`.
- **"0%" y "100%":** `--text-tertiary`, font-size `xs`.
- **Porcentaje usado:** mismo color que el estado de alerta correspondiente, font-size `xs`, weight 500.
- **Estado sin presupuesto:** texto "Sin presupuesto mensual configurado" en `--text-secondary`. Link "Definir presupuesto" en `--accent-primary` con underline en hover.

#### GastosList (Card)

- **Card contenedora:** glassmorphism estándar con `border-radius: 18px`.
- **Header interno:**
  - Fondo: `rgba(255, 255, 255, 0.03)` para diferenciar levemente del body.
  - Borde inferior: `--border-subtle`.
  - Label "Recientes": `--text-secondary`, font-size `sm`, uppercase, weight 600, tracking-wide.
  - **Select de mes:**
    - Fondo: `rgba(255, 255, 255, 0.06)`.
    - Border: 1px `--border-default`.
    - Texto: `--text-secondary`, font-size `xs`.
    - Border-radius: 8px.
    - El `<option>` del select nativo no admite estilos en todos los navegadores — documentar como limitación conocida. En browsers compatibles, el dropdown hereda los estilos del `<select>`. La única garantía cross-browser es que el `<select>` tenga fondo oscuro.
- **GastoItem (cada fila):**
  - Separador entre ítems: `--border-subtle`.
  - Descripción: `--text-primary`, font-size `base`, weight 500, truncado.
  - Fecha: `--text-tertiary`, font-size `xs`.
  - Monto: `--text-primary`, font-size `base`, weight 600, `tabular-nums`.
  - Botón eliminar (papelera): `--text-tertiary` en default (opacity-0 group-hover:opacity-100 se mantiene igual). En hover del ícono: `--accent-danger`.
- **Esqueletos de carga dentro de la lista:** `--bg-skeleton` con animación pulse a `--bg-skeleton-highlight`.
- **Texto "No hay gastos en este período":** `--text-tertiary`, font-size `sm`, centrado.
- **Botón "Ver todos / Ver menos":** `--accent-primary`, font-size `xs`, weight 500. Borde superior: `--border-subtle`. Hover: `rgba(0, 194, 255, 0.80)`.

#### Botón "Registrar nuevo gasto" (desktop)

- Variant `primary` en dark mode: fondo `--accent-primary`, texto negro (`#000000` o `#0a0a0a`) — no blanco.
- Justificación: El cyan `#00C2FF` tiene luminancia alta. Texto blanco sobre `#00C2FF` = ratio 1.7:1 — no pasa WCAG. Texto `#000000` sobre `#00C2FF` = ratio 12.6:1 — pasa holgadamente.
- Esto es una excepción al token `--text-primary` que debe documentarse específicamente en el `Button` para el contexto dark mode + variante primary.
- Hover: fondo `--accent-primary-hover` (`#33CEFF`), mismo texto negro.
- Active: fondo `--accent-primary-active` (`#00A8D9`), mismo texto negro.
- Sombra: `--shadow-glow`.

#### EmptyState

- Ícono `Wallet`: reemplazar el color actual `#A5B4FC` por `rgba(0, 194, 255, 0.50)`.
- Título: `--text-primary`.
- Subtítulo: `--text-secondary`, max-width 280px.
- Botón CTA: mismo tratamiento que "Registrar nuevo gasto" (cyan con texto negro).

#### DashboardSkeleton

- Todos los bloques `bg-neutral-200`: reemplazar por `--bg-skeleton`.
- Animación pulse: `opacity 1 → --bg-skeleton-highlight`, mismo timing (1.5s, ease-in-out).

---

### 3.2 Formulario de registro (GastoForm en Modal / BottomSheet)

#### Modal (desktop)

- **Panel:** glassmorphism de Modal/Drawer. Ver Sección 5 para valores exactos.
- **Overlay:** `--bg-overlay` (más denso que la card estándar para separar el primer plano).
- **Header del modal:** borde inferior `--border-subtle`. Título: `--text-primary`, font-size `xl`, weight 700. Botón ×: `--text-secondary` default, `--text-primary` hover, fondo hover `rgba(255,255,255,0.08)`.

#### BottomSheet (mobile)

- **Handle:** `rgba(255,255,255,0.20)`. Más visible sobre oscuro que el actual `#D1D5DB`.
- **Panel:** mismo glassmorphism del Modal pero con border-radius solo en esquinas superiores.
- **Header del sheet:** mismo tratamiento que el Modal.

#### Campo Monto (el más prominente)

- **Input de monto:**
  - Fondo: `--bg-input`.
  - Border default: `--border-default`.
  - Border focus: `--border-focus`.
  - Ring de focus: `--shadow-input-focus`.
  - Texto del monto: `--text-primary`, font-size `2xl`, weight 700, centrado.
  - Símbolo "$": `--text-tertiary`, font-size `2xl`.
  - Border en error: `--border-error`. Ring: `0 0 0 3px rgba(248,113,113,0.20)`.

- **Cuatro estados del input — especificación:**

  | Estado | Fondo | Border | Ring | Ícono derecho |
  |---|---|---|---|---|
  | Vacío (default) | `--bg-input` | `--border-default` | ninguno | ninguno |
  | Focus | `--bg-input-focus` | `--border-focus` (cyan) | `--shadow-input-focus` | ninguno |
  | Error | `--bg-input` | `--border-error` (rojo) | 3px rgba(248,113,113,0.20) | `AlertCircle` `--accent-danger` |
  | Success/Valid | `--bg-input` | `--border-success` (verde) | ninguno | `CheckCircle` `--accent-success` |

#### CategoriaSelector (chips)

- **Chip no seleccionado (default):**
  - Fondo: `rgba(255, 255, 255, 0.06)`.
  - Border: 1px `--border-default`.
  - Texto: `--text-secondary`.
  - Hover: fondo `rgba(255, 255, 255, 0.10)`, border `--border-strong`.
- **Chip seleccionado:**
  - Fondo: color de la categoría con 20% opacidad (ej. para Alimentación `rgba(245,158,11,0.20)`).
  - Border: 2px con el color de la categoría en dark mode (de la Sección 6).
  - Texto: color brillante de la categoría en dark mode (de la Sección 6).
  - Ícono Check: mismo color que el texto.
- **Dot de categoría:** color brillante dark mode de la categoría (Sección 6).
- **Error del selector:** texto `--text-error`, font-size `xs`, `role="alert"`.

#### CategoriaCustomInput (condicional)

- Mismo estilo de input que el campo Monto en estado default/focus/error.
- Label: `--text-secondary`, font-size `sm`, weight 500.
- Contador de caracteres: `--text-tertiary`, font-size `xs`.

#### Campo Descripción (opcional)

- Mismo estilo de input. El badge "(opcional)" cambia a `--text-tertiary`.
- Placeholder: `--text-disabled` (más sutil que el tertiary para no confundirse con texto real).
- Contador de caracteres: `--text-tertiary`, font-size `xs`, alineado a la derecha.

#### Campo Fecha (Input)

- Mismo estilo de input. El texto de fecha es `--text-primary`. El ícono del date picker nativo hereda el color del sistema operativo — no es modificable de forma confiable cross-browser. Documentar como limitación conocida.
- Label: `--text-secondary`.

#### Dropdown select de mes (en GastosList)

- El `<select>` nativo en dark mode: los navegadores modernos (Chrome, Safari 15+, Firefox) respetan `background-color` y `color` en el elemento `<select>`. Sin embargo, las `<option>` dentro del dropdown adoptan los colores del sistema operativo en algunos contextos.
- Especificación: `background-color: var(--bg-input)`, `color: var(--text-secondary)`, `border: 1px solid var(--border-default)`.
- Fallback documentado: si el dropdown del sistema operativo muestra colores claros sobre texto oscuro, es el comportamiento esperado del SO y no es un bug a corregir.

#### Banner de error de submit

- Fondo: `--accent-danger-subtle`.
- Border izquierdo: 3px `--accent-danger`.
- Ícono: `--accent-danger`.
- Texto: `--text-primary`.

#### Botón "Guardar gasto"

- Mismo tratamiento que "Registrar nuevo gasto": cyan `--accent-primary` con texto `#000000`.
- Estado loading: spinner con color `rgba(0,0,0,0.70)` sobre fondo cyan.

---

### 3.3 Páginas de autenticación (Login y Register)

- **Fondo de la página:** `--bg-base` (el mismo gradiente que el dashboard — consistencia visual desde la primera pantalla).
- **Logo (círculo con DollarSign):** fondo `--accent-primary` (cyan), ícono `#000000`. Mantiene la legibilidad.
- **Título de la app "Control de Gastos":** `--text-primary`.
- **Tagline "Tu dinero, bajo control":** `--text-secondary`.
- **Card del formulario:** `--bg-surface-auth` con glassmorphism pronunciado (ver Sección 5 — Modal/Drawer).
- **Título del formulario ("Iniciar sesión", "Crear cuenta"):** `--text-primary`.
- **Subtítulo ("Comienza a controlar tus gastos hoy"):** `--text-secondary`.
- **Link "¿Olvidaste tu contraseña?":** `--accent-primary` (cyan), opacity-60.
- **Links "Regístrate" / "Iniciar sesión":** `--accent-primary`, underline en hover.
- **Banner de error de credenciales:** fondo `--accent-danger-subtle`, borde izquierdo `--accent-danger`, texto `--text-primary`.
- **Mensaje de email tomado:** texto `--text-error`, link "iniciar sesión" en `--accent-primary`.

---

### 3.4 SettingsPage

- **Fondo:** `--bg-base`.
- **Header:** `--bg-header` con backdrop-filter. Borde inferior `--border-default`.
- **Botón back (←):** `--text-tertiary` default, `--text-secondary` hover.
- **Título "Configuración":** `--text-primary`.
- **Sección de card:** glassmorphism estándar.
- **Título de sección "Presupuesto mensual":** `--text-secondary`, font-size `sm`, weight 600.
- **Labels de campos:** `--text-secondary`.
- **Hints bajo campos ("Dejá vacío para no tener presupuesto"):** `--text-tertiary`.
- **Mensajes de error de validación:** `--text-error` (reemplaza `text-red-600` hardcodeado).
- **Botón "Guardar configuración":** mismo tratamiento cyan con texto negro.

---

## Sección 4: Sistema de dos temas

### 4.1 Dark theme (default)

Definido completamente en las secciones 2 y 3. Es el tema por defecto de la aplicación. El atributo inicial en `<html>` se determina por `prefers-color-scheme` del sistema operativo (ver lógica en 4.3).

---

### 4.2 Light theme

El light theme **no es una inversión** del dark theme. Es una identidad visual independiente que hereda la misma estructura semántica de tokens pero con valores propios para pantallas claras.

#### Referencia: Apple Human Interface Guidelines (macOS/iOS light mode)

Fondo: `#F5F5F7` (gris Apple, no blanco puro — reduce el deslumbramiento en pantallas brillantes).
Cards: blanco puro `#FFFFFF` con sombra gris suave.
Texto primario: `#1D1D1F` (no negro puro — suaviza el contraste directo con el blanco).

---

#### Tokens del light theme

```
--bg-base:              #F5F5F7
--bg-card:              #FFFFFF
--bg-card-hover:        #F9F9FB
--bg-input:             #FFFFFF
--bg-input-focus:       #FFFFFF
--bg-overlay:           rgba(0, 0, 0, 0.45)
--bg-header:            rgba(245, 245, 247, 0.90)
--bg-skeleton:          #E5E7EB
--bg-skeleton-highlight: #F3F4F6
--bg-surface-auth:      #FFFFFF

--text-primary:         #1D1D1F
--text-secondary:       #6E6E73
--text-tertiary:        #8E8E93
--text-disabled:        #BCBCC0
--text-link:            #0066CC
--text-error:           #C0392B
--text-success:         #1A7F4B

--border-subtle:        rgba(0, 0, 0, 0.06)
--border-default:       rgba(0, 0, 0, 0.12)
--border-strong:        rgba(0, 0, 0, 0.20)
--border-focus:         #0066CC
--border-error:         #EF4444
--border-success:       #22C55E

--accent-primary:       #0066CC
--accent-primary-hover: #0052A3
--accent-primary-active: #004080
--accent-primary-disabled: rgba(0, 102, 204, 0.35)
--accent-primary-subtle: rgba(0, 102, 204, 0.08)
--accent-success:       #1A7F4B
--accent-success-subtle: rgba(26, 127, 75, 0.08)
--accent-danger:        #D93025
--accent-danger-subtle: rgba(217, 48, 37, 0.08)
--accent-warning:       #B45309
--accent-warning-subtle: rgba(180, 83, 9, 0.08)
--accent-primary-glow:  rgba(0, 102, 204, 0.15)

--shadow-card:          0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)
--shadow-card-hover:    0 4px 12px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)
--shadow-glow:          none
--shadow-fab:           0 4px 12px rgba(99, 102, 241, 0.35)
--shadow-modal:         0 20px 60px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)
--shadow-input-focus:   0 0 0 3px rgba(0, 102, 204, 0.15)
--shadow-toast:         0 4px 16px rgba(0,0,0,0.12)
```

#### Notas del light theme

- El `--accent-primary` en light es `#0066CC` (azul Apple) en lugar del índigo actual `#6366F1`. Contraste `#0066CC` vs `#FFFFFF` = 7.0:1 — pasa AAA. Se mantiene coherencia con la referencia Apple sin ser idéntico al dark theme.
- El `--shadow-fab` en light usa la sombra índigo original del diseño actual, para preservar la identidad de marca ya establecida en light mode.
- No hay glassmorphism en el light theme: las cards son blanco sólido con sombra suave. El glassmorphism es exclusivo del dark theme.
- El botón primary en light usa texto blanco `#FFFFFF` sobre `#0066CC` — contraste 7.0:1. Correcto.

#### Verificación de contraste light theme (pares críticos)

| Par | Contraste | Resultado |
|---|---|---|
| `--text-primary` (#1D1D1F) sobre `--bg-base` (#F5F5F7) | 17.5:1 | PASA AAA |
| `--text-secondary` (#6E6E73) sobre `--bg-base` (#F5F5F7) | 5.4:1 | PASA AA |
| `--text-tertiary` (#8E8E93) sobre `--bg-base` (#F5F5F7) | 4.6:1 | PASA AA |
| `--text-tertiary` (#8E8E93) sobre `--bg-card` (#FFFFFF) | 3.9:1 | NO PASA para texto de 12px. Usar `--text-secondary` para texto de tamaño `xs` sobre cards. |
| `--accent-primary` (#0066CC) sobre `--bg-card` (#FFFFFF) | 7.0:1 | PASA AAA |
| `--text-error` (#C0392B) sobre `--bg-card` (#FFFFFF) | 5.8:1 | PASA AA |
| `--text-success` (#1A7F4B) sobre `--bg-card` (#FFFFFF) | 5.2:1 | PASA AA |

**Acción requerida para light theme:** El token `--text-tertiary` en light no cumple 4.5:1 sobre cards blancas. Para uso de texto `xs` (12px normal) sobre `--bg-card`, usar `--text-secondary` en su lugar. Esto aplica únicamente a los contadores de caracteres y hints dentro de cards.

---

### 4.3 Toggle de tema

#### Posición y presentación

- **Ubicación:** esquina superior derecha del header, antes del botón de Settings.
- **Forma:** botón circular de 32×32px (igual al avatar de iniciales).
- **Ícono dark mode activo:** luna (`Moon` de Lucide React), 16px, `--text-secondary`.
- **Ícono light mode activo:** sol (`Sun` de Lucide React), 16px, `--text-secondary`.
- **Aria-label:** `"Cambiar a tema claro"` (cuando está en dark) / `"Cambiar a tema oscuro"` (cuando está en light).
- **Fondo del botón:** `rgba(255,255,255,0.08)` en dark / `rgba(0,0,0,0.05)` en light. Border-radius `full`.
- **Hover:** fondo ligeramente más opaco (`rgba(255,255,255,0.14)` en dark / `rgba(0,0,0,0.08)` en light).

#### Transición

- `transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease, box-shadow 200ms ease`
- Se aplica sobre `:root` o `[data-theme]` para que todas las CSS custom properties transicionen.
- **No usar** `transition: all` — es costoso en repaint.
- Las propiedades que deben transicionar: `background-color`, `color`, `border-color`, `box-shadow`, `fill` (para SVG).
- El gradiente de fondo `--bg-base` **no transiciona** — el cambio es instantáneo para los fondos de página porque animar gradientes en CSS produce artefactos visuales y costo de rendering elevado.

#### Persistencia y estado inicial

1. Al cargar la app, el hook `useTheme` lee `localStorage.getItem('theme')`.
2. Si existe el valor `'dark'` o `'light'`, lo aplica inmediatamente al `<html>` con `document.documentElement.setAttribute('data-theme', value)`.
3. Si no existe (primera visita), lee `window.matchMedia('(prefers-color-scheme: dark)').matches`.
4. Si el sistema prefiere dark: aplica `data-theme="dark"` y guarda `'dark'` en localStorage.
5. Si el sistema prefiere light o no hay preferencia: aplica `data-theme="light"` y guarda `'light'`.
6. Al hacer toggle, actualiza ambos: el atributo del `<html>` y el localStorage.
7. El hook escucha cambios en `prefers-color-scheme` solo mientras no haya un override manual en localStorage.

#### Implementación del atributo en HTML

- El atributo `data-theme` se coloca en el elemento `<html>` (no en `<body>` ni en un contenedor React).
- Razón: el gradiente de fondo se aplica sobre `html` o `body`. Si el atributo está en un div hijo, el fondo de página queda fuera del scope.
- En `index.html` se recomienda agregar `data-theme="dark"` como valor inicial antes de que React hidrate, para evitar el FOUC (flash of unstyled content). El hook `useTheme` lo sobreescribirá inmediatamente tras leer localStorage.
- El `meta name="theme-color"` debe actualizarse dinámicamente por el hook `useTheme`:
  - Dark: `content="#0f1b3d"`.
  - Light: `content="#F5F5F7"`.

---

## Sección 5: Glassmorphism — especificaciones técnicas

### 5.1 Card estándar (componente `Card`, `BudgetWidget`, `GastosList`)

```
background: rgba(15, 27, 61, 0.85)
backdrop-filter: blur(12px)
-webkit-backdrop-filter: blur(12px)
border: 1px solid rgba(255, 255, 255, 0.12)
border-radius: 18px
box-shadow: var(--shadow-card)
```

**Verificación WCAG:** Texto blanco (#FFFFFF) sobre el color efectivo de la card (rgba(15,27,61,0.85) mezclado con fondo #0f1b3d) ≈ #0f1b3d con mínima variación. Ratio = 17.5:1. PASA AAA.

---

### 5.2 Card en estado hover

```
background: rgba(15, 27, 61, 0.92)
border: 1px solid rgba(255, 255, 255, 0.16)
box-shadow: var(--shadow-card-hover)
transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease
```

---

### 5.3 Modal y BottomSheet (elemento en primer plano)

```
background: rgba(10, 20, 50, 0.95)
backdrop-filter: blur(24px)
-webkit-backdrop-filter: blur(24px)
border: 1px solid rgba(255, 255, 255, 0.14)
border-radius: 20px  /* Modal */
border-radius: 20px 20px 0 0  /* BottomSheet — solo esquinas superiores */
box-shadow: var(--shadow-modal)
```

El Modal y el BottomSheet tienen mayor opacidad (`0.95`) que las cards estándar (`0.85`) porque están en primer plano y el contenido detrás no debe distraer al usuario durante el flujo de registro.

---

### 5.4 Header sticky

```
background: rgba(10, 18, 45, 0.90)
backdrop-filter: blur(8px)
-webkit-backdrop-filter: blur(8px)
border-bottom: 1px solid rgba(255, 255, 255, 0.10)
```

El blur es menor (8px vs 12px) porque el header es un elemento secundario visualmente. Un blur excesivo en el header consume resources de GPU innecesariamente en scroll.

---

### 5.5 Fallback para mobile (cuando backdrop-filter es costoso)

`backdrop-filter: blur()` activa el compositor de GPU en cada capa. En dispositivos mobile con poca memoria de video (equipos con menos de 2GB RAM o chips inferiores a Snapdragon 665 / A12), puede causar jank de scroll.

**Criterio de fallback:** dispositivos que no soporten `backdrop-filter` o donde el sistema reporta `prefers-reduced-motion: reduce`.

**Fallback para `@supports not (backdrop-filter: blur(12px))`:**

```
/* Card fallback */
background: rgba(10, 16, 40, 0.97)
backdrop-filter: none
-webkit-backdrop-filter: none
border: 1px solid rgba(255, 255, 255, 0.12)
border-radius: 18px
box-shadow: var(--shadow-card)
```

El color de fondo más oscuro y opaco (`0.97` vs `0.85`) compensa la ausencia del blur. La estética se mantiene oscura y cohesiva; solo se pierde el efecto glass. El texto mantiene contraste idéntico porque el fondo efectivo es incluso más oscuro que en la versión con blur.

**Para `@media (prefers-reduced-motion: reduce)`:** no aplicar transiciones de backdrop-filter. El blur puede mantenerse estático.

```
/* Snippet de implementación (referencia para Teff) */
/* Aplicar bajo [data-theme="dark"] */
.glass-card {
  background: rgba(15, 27, 61, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
}

@supports (backdrop-filter: blur(12px)) {
  .glass-card {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
}

@supports not (backdrop-filter: blur(12px)) {
  .glass-card {
    background: rgba(10, 16, 40, 0.97);
  }
}
```

---

## Sección 6: Paleta de categorías

### Nota sobre las categorías del sistema

El sistema tiene 10 categorías: Alimentación, Transporte, Hogar, Salud, Ocio, Ropa, Educación, Servicios, Viajes, Otros. Los colores dark-mode están optimizados para mayor luminancia (más brillantes) para que sean visibles sobre fondos oscuros sin aumentar la saturación de forma artificial.

Los colores dark-mode son los que deben usarse en:
- Los gráficos de barras (GraficoBarras) cuando el tema es dark.
- Los dots de los badges.
- Los borders de chips seleccionados.
- El color de texto de chips seleccionados.

Los fondos de badges dark-mode son versiones oscuras con 20% de opacidad del color base, apropiados para contrastar con el glassmorphism de las cards.

| Categoría | Color light mode | Color dark mode | Fondo badge dark | Texto badge dark | Contraste texto/fondo dark |
|---|---|---|---|---|---|
| Alimentación | `#F97316` | `#FB923C` | `rgba(251,146,60,0.18)` | `#FB923C` | 4.9:1 — PASA |
| Transporte | `#3B82F6` | `#60A5FA` | `rgba(96,165,250,0.18)` | `#60A5FA` | 5.6:1 — PASA |
| Hogar | `#F59E0B` | `#FBBF24` | `rgba(251,191,36,0.18)` | `#FBBF24` | 8.2:1 — PASA |
| Salud | `#10B981` | `#34D399` | `rgba(52,211,153,0.18)` | `#34D399` | 7.4:1 — PASA |
| Ocio | `#A855F7` | `#C084FC` | `rgba(192,132,252,0.18)` | `#C084FC` | 5.4:1 — PASA |
| Ropa | `#14B8A6` | `#2DD4BF` | `rgba(45,212,191,0.18)` | `#2DD4BF` | 7.8:1 — PASA |
| Educación | `#6366F1` | `#818CF8` | `rgba(129,140,248,0.18)` | `#818CF8` | 5.1:1 — PASA |
| Servicios | `#64748B` | `#94A3B8` | `rgba(148,163,184,0.18)` | `#94A3B8` | 5.9:1 — PASA |
| Viajes | `#0EA5E9` | `#38BDF8` | `rgba(56,189,248,0.18)` | `#38BDF8` | 7.2:1 — PASA |
| Otros | `#6B7280` | `#9CA3AF` | `rgba(156,163,175,0.18)` | `#9CA3AF` | 5.4:1 — PASA |

**Contraste calculado:** texto del badge sobre el color efectivo del fondo de card (`#0f1b3d`). Todos los valores cumplen WCAG AA (4.5:1).

### Nota sobre la implementación de colores de categoría en dark mode

Los colores de categoría vienen del backend a través de `Categoria.color`. Para que el dark mode muestre los colores más brillantes, existen dos estrategias:

**Estrategia A (recomendada para este proyecto):** Mantener los colores del backend tal como están. En el frontend, definir un mapa de colores dark-mode en `types/index.ts` paralelo a `SYSTEM_CATEGORIES`, llamado `SYSTEM_CATEGORIES_DARK`, y usar el color del mapa cuando `data-theme="dark"` esté activo. Los colores del gráfico (que usan `entry.categoria_color` del backend) deberán ser sobrescritos por el mapa local cuando el tema sea dark.

**Estrategia B (alternativa):** Modificar el backend para que devuelva dos valores de color por categoría. Más limpio arquitectónicamente pero requiere cambios en el backend y los tipos.

La Sección 7 documenta la Estrategia A como la ruta recomendada para Teff.

---

## Sección 7: Checklist de handoff para Teff

### Prerrequisitos antes de comenzar

- [ ] Resolver el conflicto de colores de categorías (CHANGELOG DD-001) antes de agregar los dark-mode colors. Confirmar que `SYSTEM_CATEGORIES` en `types/index.ts` es la fuente de verdad definitiva.
- [ ] Confirmar que el directorio `docs/design/` está en el repo (sí lo está).

---

### Paso 1: Variables CSS y tokens (implementar PRIMERO)

En `frontend/src/index.css`, dentro de `@layer base`, agregar:

```
:root, [data-theme="light"] {
  /* Todos los tokens del light theme de la Sección 4.2 */
}

[data-theme="dark"] {
  /* Todos los tokens de las Secciones 2 y 5 */
}
```

Nótese que `:root` es sinónimo de `[data-theme="light"]` aquí — esto asegura que sin ningún atributo data-theme, el light theme sea el fallback.

El `@layer base` ya existe en `index.css`. Las variables CSS van dentro de ese layer.

---

### Paso 2: Hook `useTheme()`

Crear `frontend/src/hooks/useTheme.ts` con la siguiente lógica (sin implementación de código, solo especificación de comportamiento):

- Expone: `{ theme: 'dark' | 'light', toggleTheme: () => void }`.
- Al montar: leer `localStorage.getItem('theme')`. Si existe, usar ese valor. Si no, leer `window.matchMedia('(prefers-color-scheme: dark)').matches`. Aplicar a `document.documentElement.setAttribute('data-theme', theme)`.
- `toggleTheme`: alterna el valor, actualiza `document.documentElement.setAttribute('data-theme', newTheme)` y `localStorage.setItem('theme', newTheme)` y actualiza el meta tag `theme-color` con `document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color)`.
- El hook escucha cambios de `prefers-color-scheme` solo si no hay override en localStorage.

---

### Paso 3: Componente ThemeToggle

Crear `frontend/src/components/ui/ThemeToggle.tsx`:
- Usar los íconos `Moon` y `Sun` de Lucide React (ya es dependencia del proyecto).
- Botón 32×32px, border-radius `full`, estilo definido en Sección 4.3.
- Llamar a `toggleTheme()` del hook `useTheme`.
- Aria-label dinámico según el tema activo.

Insertar en `DashboardPage.tsx` y `SettingsPage.tsx` en el header, antes del botón `<Settings>`.

---

### Paso 4: Fondo base

En `DashboardPage.tsx`, `LoginPage.tsx`, `RegisterPage.tsx`, `SettingsPage.tsx`:

Cambiar:
- `className="min-h-screen bg-background"` → `className="min-h-screen bg-[var(--bg-base)]"` o `className="min-h-screen"` con CSS en `html { background: var(--bg-base); }`.

Recomendación: aplicar `background: var(--bg-base)` directamente en `html` o `body` en `index.css` dentro de `[data-theme="dark"]`. Así se evita modificar todos los componentes para el fondo de página.

---

### Paso 5: Cards del dashboard

Componente `Card` (`frontend/src/components/ui/Card.tsx`):

Cambiar:
- `baseClass`: `'bg-surface rounded-lg overflow-hidden'` → usar `var(--bg-card)` en lugar de `bg-surface` para la variante en dark mode. En light mode `--bg-card` = `#FFFFFF`, por lo que el comportamiento light es idéntico al actual.
- `variantClass` para `elevated`: reemplazar `shadow-md` por `var(--shadow-card)`.
- `interactiveClass`: reemplazar `hover:bg-neutral-100/50` por `hover:bg-[var(--bg-card-hover)]`.

Aplicar glassmorphism a través de una clase utilitaria CSS en lugar de inline. Propuesta de nombre: `.glass-card`. Ver especificación en Sección 5.

**Para `BudgetWidget` y `GastosList`** (que no usan el componente `Card` sino `div` directos con clases Tailwind): aplicar la clase `.glass-card` o los estilos equivalentes directamente.

---

### Paso 6: Tipografía y colores de texto

Reemplazos de clases en todos los componentes:

| Clase actual | Reemplazar por | Componentes afectados |
|---|---|---|
| `text-neutral-900` | `text-[var(--text-primary)]` | GastoItem, ResumenMes, Modal, BottomSheet, GastoForm, LoginForm, BudgetWidget, SettingsPage |
| `text-neutral-700` | `text-[var(--text-secondary)]` | GastosList header, GraficoBarras título, BudgetWidget subtítulos, Card header |
| `text-neutral-600` | `text-[var(--text-secondary)]` | DashboardPage (fecha), SettingsPage labels, EmptyState |
| `text-neutral-500` | `text-[var(--text-tertiary)]` | GastosList "No hay gastos", BudgetWidget hints |
| `text-neutral-400` | `text-[var(--text-tertiary)]` | Footer, botones ghost default, FAB (si aplica) |
| `text-primary` | `text-[var(--accent-primary)]` | Links, botón "Ver todos", botón "Definir presupuesto" |
| `text-danger` | `text-[var(--accent-danger)]` | Errores de validación, variación mensual positiva |
| `text-success` | `text-[var(--accent-success)]` | Variación mensual negativa, validación correcta |
| `text-green-600` | `text-[var(--accent-success)]` | BudgetWidget estado "none" |
| `text-yellow-600`, `text-yellow-800` | `text-[var(--accent-warning)]` | BudgetWidget y Banner estado "warning" |
| `text-red-600`, `text-red-700`, `text-red-800`, `text-red-900` | `text-[var(--accent-danger)]` | BudgetWidget y Banner estados "critical"/"exceeded" |

**GraficoBarras — atención especial:**

El `tick` del `YAxis` usa `fill: '#374151'` (propiedad SVG, no CSS class). Pasar a través de una variable en el componente:

```tsx
// En GraficoBarras.tsx — prop a pasar al tick
const theme = useTheme()  // hook de tema
const labelColor = theme === 'dark' ? 'rgba(255,255,255,0.65)' : '#374151'
// Usar labelColor en tick={{ fontSize: 12, fill: labelColor }}
```

El cursor del gráfico: cambiar `rgba(99,102,241,0.05)` por `rgba(0, 194, 255, 0.06)` en dark, `rgba(99,102,241,0.05)` en light.

---

### Paso 7: Botones y acentos

Componente `Button` (`frontend/src/components/ui/Button.tsx`):

**Variante `primary` en dark mode:**
- Background default: `var(--accent-primary)` (cyan en dark, azul Apple en light).
- Texto: en dark mode, `#000000` (no `#FFFFFF` — el cyan es demasiado claro). En light mode, `#FFFFFF`.
- Hover: `var(--accent-primary-hover)`.
- Active: `var(--accent-primary-active)`.
- Disabled: `var(--accent-primary-disabled)`.
- Box-shadow hover en dark: `var(--shadow-glow)`.

La forma de implementar el texto negro/blanco condicional es con CSS variables:
```
--btn-primary-text: #FFFFFF;  /* en light */
/* [data-theme="dark"] */
--btn-primary-text: #000000;
```

**Variante `secondary` en dark mode:**
- Background: `rgba(255, 255, 255, 0.06)`.
- Texto: `var(--accent-primary)`.
- Border: 1px `var(--accent-primary)`.
- Hover background: `var(--accent-primary-subtle)`.

**Variante `ghost` en dark mode:**
- Texto default: `var(--text-secondary)`.
- Hover background: `rgba(255, 255, 255, 0.08)`.
- Hover texto: `var(--text-primary)`.

**Variante `danger` en dark mode:**
- Background default: `var(--accent-danger)` (`#F87171`). Texto: `#000000` (mismo criterio que primary — el rojo claro tiene alta luminancia). Ratio `#000000` vs `#F87171` = 6.8:1. PASA.
- Hover: `#EF4444`. Texto: `#000000`.

**Focus ring (todos los botones):**
- `focus-visible:ring-2 focus-visible:ring-primary` → `focus-visible:ring-[var(--accent-primary)]`.

**FAB** (`FAB.tsx`):
- Background: `var(--accent-primary)`.
- Ícono: `#000000` (misma razón que botón primary).
- Shadow: `var(--shadow-fab)`.
- Hover background: `var(--accent-primary-hover)`.

---

### Paso 8: Formulario e inputs

Componente `Input` (`frontend/src/components/ui/Input.tsx`) y inputs manuales en `GastoForm.tsx` y `CategoriaCustomInput.tsx`:

**Reemplazos de clases:**

| Clase actual | Reemplazar por |
|---|---|
| `bg-surface` | `bg-[var(--bg-input)]` |
| `border-neutral-300` | `border-[var(--border-default)]` |
| `text-neutral-900` (en el input) | `text-[var(--text-primary)]` |
| `placeholder:text-neutral-400` | `placeholder:text-[var(--text-disabled)]` |
| `focus:border-primary` | `focus:border-[var(--border-focus)]` |
| `focus:ring-primary/15` | `focus:ring-[var(--accent-primary-glow)]` o usar `var(--shadow-input-focus)` |
| `disabled:bg-neutral-100` | `disabled:bg-[var(--bg-input)]` con `opacity-50` |
| `disabled:text-neutral-600` | `disabled:text-[var(--text-disabled)]` |
| `border-danger` (error) | `border-[var(--border-error)]` |
| `border-success` (valid) | `border-[var(--border-success)]` |
| `text-neutral-700` (label) | `text-[var(--text-secondary)]` |
| `text-neutral-400` (hint) | `text-[var(--text-tertiary)]` |

**`CategoriaSelector`** — chips (hardcoded inline styles):
- Chip no seleccionado: reemplazar `backgroundColor: '#F3F4F6'` por `var(--bg-card-hover)` y `color: '#374151'` por `var(--text-secondary)`.
- Chip seleccionado: el `backgroundColor: style.bg` y `color: style.text` deben respetar el tema. Implementar `getCategoryBadgeStyle` con overrides para dark mode, o usar el mapa de colores dark de la Sección 6.

**`BudgetAlertBanner`** — objeto `config` con clases hardcodeadas:
Cambiar de un mapa de clases Tailwind a un mapa de clases que usen los tokens CSS:

| Estado | Clases actuales | Clases dark-mode |
|---|---|---|
| `warning` | `bg-yellow-50 border-yellow-300 text-yellow-800` | `bg-[var(--accent-warning-subtle)] border-[var(--accent-warning)] text-[var(--accent-warning)]` |
| `critical` | `bg-red-50 border-red-300 text-red-800` | `bg-[var(--accent-danger-subtle)] border-[var(--accent-danger)] text-[var(--accent-danger)]` |
| `exceeded` | `bg-red-100 border-red-400 text-red-900` | `bg-[rgba(248,113,113,0.20)] border-[var(--accent-danger)] text-[var(--text-primary)]` |

Dado que las clases condicionales ya están en un objeto de configuración, la forma más limpia es tener dos objetos: `configLight` y `configDark`, seleccionados con el hook `useTheme`.

**`BudgetWidget`** — los `barColor` y `remainingColor` hardcodeados:
Cambiar a CSS variables:

| Clave | Clase actual | CSS variable |
|---|---|---|
| `none` (barra) | `bg-primary` | `bg-[var(--accent-primary)]` |
| `warning` (barra) | `bg-yellow-400` | `bg-[var(--accent-warning)]` |
| `critical` (barra) | `bg-red-500` | `bg-[var(--accent-danger)]` |
| `exceeded` (barra) | `bg-red-600` | `bg-[var(--accent-danger)]` con glow |
| `none` (texto) | `text-green-600` | `text-[var(--accent-success)]` |
| `warning` (texto) | `text-yellow-600` | `text-[var(--accent-warning)]` |
| `critical` (texto) | `text-red-600` | `text-[var(--accent-danger)]` |
| `exceeded` (texto) | `text-red-700` | `text-[var(--accent-danger)]` |

---

### Paso 9: Toggle funcional

- Integrar el componente `ThemeToggle` en el header del `DashboardPage` y `SettingsPage`.
- Agregar el hook `useTheme` al contexto global o como singleton (puede ser un hook simple sin contexto ya que solo lee/escribe localStorage y un atributo DOM).
- Actualizar `index.html` para incluir `data-theme="dark"` como valor por defecto hasta que el JS hidrate: `<html lang="es" data-theme="dark">`. Esto evita el FOUC en la primera carga.

---

### Paso 10: Glassmorphism fino y ajustes de Skeleton

- Aplicar la clase `.glass-card` o el conjunto de propiedades equivalentes a: `Card`, `BudgetWidget`, `GastosList`, `Modal`, `BottomSheet`, `LoginPage` card, `RegisterPage` card, `SettingsPage` sección.
- Agregar `@supports` fallback según Sección 5.5.
- Actualizar colores del `DashboardSkeleton`: `bg-neutral-200` → `bg-[var(--bg-skeleton)]`.
- Actualizar los skeleton inline en `BudgetWidget` (loading state): misma sustitución.

---

### Paso 11: Colores de categorías en dark mode (Sección 6)

En `frontend/src/types/index.ts`:

1. Agregar `SYSTEM_CATEGORIES_DARK` con los colores dark de la Sección 6.
2. Agregar `CATEGORY_BADGE_STYLES_DARK` con fondos y textos dark de la Sección 6.
3. Actualizar `getCategoryBadgeStyle` para aceptar un parámetro `theme: 'light' | 'dark'` y retornar el set correcto.
4. En `GraficoBarras`, los colores de las celdas del gráfico (`entry.categoria_color`) vienen del backend. Agregar lógica que, cuando el tema es dark, use el mapa `SYSTEM_CATEGORIES_DARK` por ID de categoría en lugar del color del backend.

---

### Orden de implementación recomendado (con dependencias)

```
1. Variables CSS + tokens (index.css)        ← sin dependencias
2. Hook useTheme + ThemeToggle               ← depende de (1)
3. Fondo base (html/body en index.css)       ← depende de (1)
4. Componente Card (glassmorphism)           ← depende de (1) y (3)
5. DashboardPage cards y BudgetWidget        ← depende de (4)
6. Tipografía y colores de texto (globals)   ← depende de (1)
7. Botones y acentos (Button, FAB)           ← depende de (1) y (6)
8. Formulario e inputs                       ← depende de (1), (6) y (7)
9. Toggle funcional en UI                    ← depende de (2) y (4)
10. Glassmorphism fino + fallback mobile     ← depende de (4)
11. Colores de categorías dark mode          ← depende de (1) y (5)
12. Páginas auth (Login, Register)           ← depende de (1), (4), (7), (8)
13. SettingsPage                             ← depende de (1), (6), (7), (8)
14. Skeleton loaders                         ← depende de (1)
15. Toast colores                            ← depende de (1)
```

---

### Tabla de archivos a modificar

| Archivo | Tipo de cambio | Prioridad |
|---|---|---|
| `frontend/src/index.css` | Agregar CSS custom properties bajo `:root` y `[data-theme="dark"]`. Agregar `.glass-card` con `@supports`. | Alta — bloquea todo lo demás |
| `frontend/tailwind.config.ts` | Agregar `safelist` de clases `[var(--...)]` si es necesario. Considerar agregar los dark mode colors de categorías al config. | Media |
| `frontend/index.html` | Agregar `data-theme="dark"` al `<html>` y `theme-color` dark. | Alta |
| `frontend/src/hooks/useTheme.ts` | Crear el hook (nuevo archivo). | Alta |
| `frontend/src/components/ui/ThemeToggle.tsx` | Crear el componente (nuevo archivo). | Alta |
| `frontend/src/components/ui/Button.tsx` | Actualizar tokens de color para todos los estados y variantes. | Alta |
| `frontend/src/components/ui/Input.tsx` | Actualizar tokens de color para todos los estados. | Alta |
| `frontend/src/components/ui/Card.tsx` | Agregar glassmorphism, actualizar tokens. | Alta |
| `frontend/src/components/ui/FAB.tsx` | Actualizar color y sombra. | Alta |
| `frontend/src/components/ui/Modal.tsx` | Aplicar glassmorphism modal, actualizar tokens de texto. | Alta |
| `frontend/src/components/ui/BottomSheet.tsx` | Aplicar glassmorphism, actualizar tokens. | Alta |
| `frontend/src/components/ui/EmptyState.tsx` | Actualizar colores inline de ícono y textos. | Media |
| `frontend/src/components/ui/Skeleton.tsx` | Actualizar colores de skeleton. | Media |
| `frontend/src/components/ui/Toast.tsx` | Verificar que los colores de toast usen los nuevos tokens. | Media |
| `frontend/src/components/dashboard/GastosList.tsx` | Actualizar tokens, glassmorphism del contenedor, select de mes. | Alta |
| `frontend/src/components/dashboard/GastoItem.tsx` | Actualizar tokens de texto y borde. | Alta |
| `frontend/src/components/dashboard/ResumenMes.tsx` | Actualizar tokens de texto. | Alta |
| `frontend/src/components/dashboard/GraficoBarras.tsx` | Reemplazar `fill` y `cursor` hardcodeados. Usar colores de categoría dark. | Alta — hallazgo crítico |
| `frontend/src/components/dashboard/BudgetWidget.tsx` | Reemplazar mapas de clases Tailwind hardcodeadas por tokens CSS. | Alta — hallazgo crítico |
| `frontend/src/components/dashboard/BudgetAlertBanner.tsx` | Reemplazar objeto `config` con clases por tokens CSS. | Alta — hallazgo crítico |
| `frontend/src/components/gastos/GastoForm.tsx` | Actualizar inputs manuales y tokens de texto. | Alta |
| `frontend/src/components/gastos/CategoriaSelector.tsx` | Reemplazar estilos inline hardcodeados. | Alta — hallazgo crítico |
| `frontend/src/components/gastos/CategoriaCustomInput.tsx` | Actualizar tokens de input. | Media |
| `frontend/src/components/auth/LoginForm.tsx` | Actualizar banner de error y tokens. | Media |
| `frontend/src/components/auth/RegisterForm.tsx` | Actualizar tokens. | Media |
| `frontend/src/pages/DashboardPage.tsx` | Integrar ThemeToggle en header, actualizar clases de layout. | Alta |
| `frontend/src/pages/LoginPage.tsx` | Actualizar fondo y card. | Media |
| `frontend/src/pages/RegisterPage.tsx` | Actualizar fondo y card. | Media |
| `frontend/src/pages/SettingsPage.tsx` | Integrar ThemeToggle en header, actualizar tokens. | Media |
| `frontend/src/App.tsx` | Footer: actualizar `text-neutral-400` por `text-[var(--text-tertiary)]`. | Baja |
| `frontend/src/types/index.ts` | Agregar colores dark mode de categorías. Actualizar `getCategoryBadgeStyle`. | Alta |

---

### Notas finales para Teff

1. **No romper el light theme:** al implementar los tokens CSS, verificar que los valores de `:root` / `[data-theme="light"]` sean idénticos a los valores actuales Tailwind. El objetivo es que el light theme actual no cambie visualmente.

2. **Tailwind y CSS custom properties:** en Tailwind 3.x, se pueden usar CSS variables con la sintaxis `bg-[var(--bg-card)]`. No es necesario agregar los tokens al `tailwind.config.ts` si se usan con corchetes, pero agregarlos permite autocomplete en el IDE.

3. **Recharts y temas:** Recharts pasa props directamente a elementos SVG. Las CSS variables no se propagan automáticamente a SVG attributes como `fill`. La solución documentada en el Paso 6 (leer el tema desde el hook y pasarlo como prop al componente) es la más simple y no requiere librerías adicionales.

4. **El `<select>` nativo:** no hay forma cross-browser de estilizar completamente el dropdown del select nativo en dark mode. Las `<option>` dentro del dropdown abierto usarán los colores del sistema operativo del usuario. Si en el futuro se requiere control total sobre el dropdown, se deberá reemplazar el `<select>` por un componente custom (fuera del alcance de este documento).

5. **Test de regresión visual:** tras implementar el light theme tokens, tomar capturas de pantalla del light mode antes y después para verificar que no haya regresión visual. El dark theme no puede implementarse correctamente sin antes verificar que el light mode preserva su aspecto actual.

---

*Fin del documento. Versión 1.0.0 — Richard, 21 de abril de 2026.*

---

Dado que no cuento con una herramienta de escritura de archivos en este entorno, el contenido completo del documento está en esta respuesta. A continuación el resumen del análisis y los puntos clave:

---

## Resumen ejecutivo del análisis

### Lo que encontré en el código

**Inventario real:** 28 componentes en `frontend/src/`. La app está bien estructurada con un sistema de componentes UI reutilizables ya establecido. Inter como fuente, Tailwind con tokens semánticos parciales, Lucide React para íconos.

**Problemas críticos que se agravan en dark mode (4 hallazgos críticos):**

1. `GraficoBarras.tsx` — Los labels del gráfico usan `fill: '#374151'` hardcodeado. En dark mode ese texto sería invisible (ratio ≈ 1.5:1).

2. `CategoriaSelector.tsx` — Estilos inline con `#F3F4F6` y `#374151` hardcodeados para chips no seleccionados. Se verían completamente fuera de lugar sobre glassmorphism oscuro.

3. `BudgetWidget.tsx` y `BudgetAlertBanner.tsx` — Mapas de clases Tailwind con colores light mode hardcodeados (`bg-yellow-50`, `bg-red-50`, `text-yellow-800`, etc.). Rompen la estética dark completamente.

4. `CATEGORY_BADGE_STYLES` en `types/index.ts` — Fondos pastel claros que no tienen contraste correcto en dark mode.

**Deuda preexistente importante:** el `CHANGELOG-design.md` tiene una "Guía Visual Rápida" informal (sección 2.1) con colores de dark theme distintos a los del brief. Esa sección queda obsoleta con este documento.

### Decisión de acento primary: índigo → cyan

El cambio de `#6366F1` a `#00C2FF` para el dark theme está completamente justificado: el índigo sobre azul marino oscuro produce colisión cromática análoga que reduce la legibilidad perceptiva. El cyan opera como complementario-análogo y replica la identidad visual de la referencia iCloud. El índigo se preserva en light mode, manteniendo la identidad de la marca en ambos temas.

### Contraste WCAG: todos los tokens verificados

El único ajuste necesario fue elevar `--text-tertiary` de `rgba(255,255,255,0.40)` (ratio 3.5:1, FALLA) a `rgba(255,255,255,0.50)` (ratio 4.7:1, PASA). También se identificó que `--text-tertiary` del light theme no pasa sobre `--bg-card` blanco para texto `xs` — documentado con la recomendación de usar `--text-secondary` en ese contexto específico.

Archivos relevantes:
- `/c:/Users/Julsp/repos/control-gastos/frontend/src/index.css` — donde van todos los tokens CSS custom properties
- `/c:/Users/Julsp/repos/control-gastos/frontend/index.html` — donde agregar `data-theme="dark"` al `<html>`
- `/c:/Users/Julsp/repos/control-gastos/frontend/src/types/index.ts` — donde agregar `SYSTEM_CATEGORIES_DARK` y `CATEGORY_BADGE_STYLES_DARK`
- `/c:/Users/Julsp/repos/control-gastos/frontend/src/components/dashboard/GraficoBarras.tsx` — hallazgo crítico de visibilidad
- `/c:/Users/Julsp/repos/control-gastos/frontend/src/components/dashboard/BudgetWidget.tsx` — hallazgo crítico de colores hardcodeados
- `/c:/Users/Julsp/repos/control-gastos/frontend/src/components/dashboard/BudgetAlertBanner.tsx` — hallazgo crítico de colores hardcodeados
- `/c:/Users/Julsp/repos/control-gastos/frontend/src/components/gastos/CategoriaSelector.tsx` — hallazgo crítico de estilos inline
- `/c:/Users/Julsp/repos/control-gastos/docs/design/dark-theme-redesign.md` — archivo a crear con el contenido de esta respuesta