# CHANGELOG de Diseño — Control de Gastos Personales

**Versión actual del design system:** 1.1.0  
**Fecha de última actualización:** 2026-04-14  
**Autor:** Richard (UX Designer Senior)  
**Audiencia:** Equipo de diseño y desarrollo

---

## Tabla de contenidos

1. [Historial de Decisiones de Diseño](#1-historial-de-decisiones-de-diseño)
2. [Guía Visual Rápida](#2-guía-visual-rápida)
3. [Fuentes de Verdad](#3-fuentes-de-verdad)

---

## 1. Historial de Decisiones de Diseño

Este registro documenta las decisiones que cambiaron o se precisaron durante el desarrollo (Fases 1–4). Cada entrada indica qué cambió, por qué y qué impacto tiene en el sistema.

---

### 1.1 Tabla de decisiones

| ID | Decisión | Fase | Razón del cambio | Impacto | Versión del doc |
|----|----------|------|-----------------|---------|----------------|
| DD-001 | Colores de categorías: design-system.md declarado fuente de verdad | Fase 4 | El seed SQL del backend (ADR-001 §2.2) tenía valores distintos a los del design-system.md, generando inconsistencia entre la UI y los datos persistidos. | Crítico — afecta gráficos, badges y chips en toda la interfaz. ADR-001 §2.2 queda desactualizado. | 1.1.0 |
| DD-002 | Duración del Toast: 2500 ms → 3000 ms | Fase 3 | Los mensajes de error compuestos (ej. "Categoría ya existe", "Credenciales incorrectas") no podían leerse completamente en 2500 ms. | Mejora de legibilidad en todos los toasts del sistema, sin afectar el layout. | 1.1.0 |
| DD-003 | Button loading state: patrón `spinner absolute inset-0` + `children invisible` | Fase 2 | El diseño original no especificaba el comportamiento del botón durante carga. Sin esta definición, el botón colapsaba su ancho al mostrar solo el spinner, causando layout shift en formularios. | Microdiseño con impacto directo en percepción de estabilidad visual en todos los formularios. | 1.0.0 |
| DD-004 | FAB en desktop: `lg:hidden` + `aria-hidden="true"` | Fase 3 | El `lg:hidden` de Tailwind oculta el FAB visualmente pero no lo elimina del árbol de accesibilidad. Los lectores de pantalla en escritorio lo anunciaban como elemento interactivo aunque no estuviera visible, violando WCAG 2.1 (criterio 1.3.1). | Accesibilidad — los lectores de pantalla en breakpoint `lg` ya no anuncian el FAB porque el botón equivalente en desktop está en otra posición del layout. | 1.1.0 |
| DD-005 | Errores inline en formularios: `role="alert"` | Fase 3 | Los mensajes de error debajo de los campos no eran anunciados automáticamente por lectores de pantalla al aparecer dinámicamente, violando WCAG 2.1 criterio 4.1.3. | Accesibilidad — cualquier error de validación inline es ahora comunicado de forma inmediata a tecnologías asistivas sin requerir que el usuario mueva el foco. | 1.1.0 |
| DD-006 | CategoriaSelector: `<div>/<label>` → `<fieldset>/<legend>` | Fase 3 | Un grupo de inputs de tipo radio o checkbox sin `<fieldset>/<legend>` no cumple WCAG 2.1 AA (criterio 1.3.1 — información y relaciones). Los lectores de pantalla no asociaban el grupo de chips con su etiqueta contenedora. | Semántica HTML corregida. Efecto visual: el `<fieldset>` tiene borde nativo del navegador que debe resetearse con `border-0` en Tailwind para no alterar el diseño. | 1.1.0 |
| DD-007 | `useIsMobile`: lectura única → listener reactivo en `matchMedia` | Fase 2 | El hook detectaba el tamaño de pantalla una sola vez al montar el componente. Al rotar el dispositivo o redimensionar la ventana, el layout no se actualizaba, mostrando la versión incorrecta (mobile o desktop). | UX técnico — el layout correcto (BottomSheet vs. Modal) se muestra ahora en tiempo real ante cualquier cambio de breakpoint. | 1.0.0 |
| DD-008 | Versión del design-system.md bumpeada a 1.1.0 | Fase 4 | Los cambios de colores de categorías como fuente de verdad representan un cambio con impacto en implementación existente y requieren versión para trazabilidad. | Administrativo — permite al equipo identificar qué versión del design system está implementada en cada entorno. | 1.1.0 |

---

### 1.2 Conflicto activo — colores de categorías

Durante la revisión del design-system.md §3.1 se identificó que la tabla contiene valores que no coinciden con los declarados como fuente de verdad (DD-001). Las diferencias documentadas:

| Categoría | Valor en design-system.md §3.1 | Valor implementado (fuente de verdad) |
|-----------|-------------------------------|--------------------------------------|
| Alimentación | `#F97316` (orange-500) | `#F59E0B` (amber-400) |
| Hogar | `#F59E0B` (amber-400) | `#8B5CF6` (violet-500) |
| Salud | `#10B981` (emerald-500) | `#EF4444` (red-500) |
| Ocio | `#A855F7` (purple-500) | `#EC4899` (pink-500) |

**Acción pendiente:** actualizar la tabla §3.1 del design-system.md para eliminar esta discrepancia y evitar que futuros desarrolladores usen valores incorrectos.

---

## 2. Guía Visual Rápida

Referencia compacta para iteraciones futuras. No reemplaza al design-system.md completo.

---

### 2.1 Paleta principal

| Token semántico | Hex | Tailwind equivalente | Uso |
|----------------|-----|---------------------|-----|
| Background | `#0F1117` | `gray-950` | Fondo general de la aplicación |
| Surface / Cards | `#1A1D27` | `gray-900` custom | Fondo de cards, modales, bottom sheets |
| Border | `#2D3148` | — | Bordes de cards, separadores, inputs |
| Text primary | `#F9FAFB` | `gray-50` | Títulos, valores numéricos, texto principal |
| Text secondary | `#9CA3AF` | `gray-400` | Metadatos, fechas, descripciones, placeholders |
| Accent / Primary | `#6366F1` | `indigo-500` | Botón primario, FAB, links activos, foco de inputs |
| Danger | `#EF4444` | `red-500` | Errores de validación, acciones destructivas, toasts de error |
| Success | `#22C55E` | `green-500` | Confirmaciones de guardado, toasts de éxito |

**Regla:** Cada token tiene un rol semántico único. No reutilizar `accent` como decorativo ni `danger` fuera de contextos de error o destrucción.

---

### 2.2 Colores de categorías de gasto

Valores implementados y vigentes. Aplicar de forma idéntica en gráficos, badges, chips y cualquier referencia visual a la categoría.

| Categoría | Hex | Tailwind equivalente |
|-----------|-----|---------------------|
| Alimentación | `#F59E0B` | `amber-400` |
| Transporte | `#3B82F6` | `blue-500` |
| Hogar | `#8B5CF6` | `violet-500` |
| Salud | `#EF4444` | `red-500` |
| Ocio | `#EC4899` | `pink-500` |
| Ropa | `#14B8A6` | `teal-500` |
| Educación | `#6366F1` | `indigo-500` |
| Servicios | `#64748B` | `slate-500` |
| Viajes | `#0EA5E9` | `sky-500` |
| Otros | `#6B7280` | `gray-500` |

---

### 2.3 Tipografía

**Familia:** Inter (Google Fonts). Usar `font-sans` de Tailwind con Inter como primera opción.

| Escala | Tamaño | Uso principal |
|--------|--------|--------------|
| `xs` | 12px | Mensajes de error inline, hints, etiquetas auxiliares |
| `sm` | 14px | Texto secundario, subtítulos, metadatos, placeholders |
| `base` | 16px | Cuerpo principal, labels de formularios, contenido de listas |
| `lg` | 18px | Subtítulos de sección, títulos de cards |
| `xl` | 20px | Títulos de pantalla, encabezados principales |
| `2xl` | 24px | Totales numéricos secundarios, cifras de resumen |
| `3xl` | 30px | Total del mes en el dashboard (máxima jerarquía numérica) |

**Pesos usados:** 400, 500, 600, 700. No usar pesos fuera de este conjunto.

---

### 2.4 Breakpoints y layout

| Breakpoint | Rango | Layout activo |
|-----------|-------|--------------|
| Mobile | < 640px (`sm`) | Una columna, FAB visible, formulario como BottomSheet |
| Tablet | 640px – 1024px | Transición — usar layout mobile como base |
| Desktop | > 1024px (`lg`) | FAB oculto, formulario como Modal centrado |

**Principio:** Diseño mobile-first. Los breakpoints `sm` y `lg` son los únicos con cambios de layout estructural. El `md` se usa solo para ajustes de espaciado.

---

### 2.5 Componentes — variantes y cuándo usarlos

#### Button

| Variante | Cuándo usarla |
|----------|--------------|
| `primary` | Acción principal de la pantalla (máximo una por vista). Ej: "Guardar gasto", "Iniciar sesión". |
| `secondary` | Acciones secundarias o alternativas. Ej: "Cancelar", "Ver más". |
| `danger` | Acciones destructivas irreversibles. Ej: "Eliminar gasto". Siempre con confirmación explícita. |
| `ghost` | Acciones terciarias en contextos de alta densidad visual o dentro de listas. |

| Tamaño | Cuándo usarlo |
|--------|--------------|
| `sm` | Acciones dentro de listas, chips, contextos compactos. |
| `md` | Uso general — formularios, modales, acciones en cards. |
| `lg` | Acción principal de pantalla completa. |

**Loading state:** Usar `isLoading={true}` durante llamadas asíncronas. El patrón `spinner absolute inset-0` + `children invisible` preserva el ancho del botón. No deshabilitar el botón manualmente — `isLoading` aplica `disabled` y `cursor-wait` automáticamente.

#### Toast

| Variante | Cuándo usarla |
|----------|--------------|
| `success` | Operación completada con éxito: gasto guardado, cuenta creada, sesión iniciada. |
| `error` | Error del sistema que el usuario no puede prevenir con validación inline. |
| `warning` | Estado de alerta no crítico (uso futuro — presupuesto cerca del límite). |
| `info` | Información contextual sin acción requerida. |

**Duración:** 3000 ms fija para todas las variantes.  
**Posición:** Parte superior, centrado en mobile, alineado a la derecha en desktop.

#### CategoriaSelector

Implementado con `<fieldset>/<legend>` para cumplimiento WCAG 2.1 AA. El `<fieldset>` debe llevar `border-0` para eliminar el borde nativo. Los chips son inputs radio ocultos visualmente con el chip como label asociado.

#### GastoForm

Validación inline on-blur (no on-keystroke). Los mensajes de error deben incluir `role="alert"`. El campo de monto recibe foco automático al abrir el formulario.

---

### 2.6 Patrones de accesibilidad aplicados

| Patrón | Implementación | Criterio WCAG |
|--------|---------------|--------------|
| Errores inline anunciados automáticamente | `role="alert"` en el contenedor del mensaje | 4.1.3 — Mensajes de estado |
| Grupo de inputs con etiqueta de grupo | `<fieldset>/<legend>` en CategoriaSelector | 1.3.1 — Información y relaciones |
| Elemento interactivo oculto no anunciado | `aria-hidden="true"` en el wrapper del FAB con `lg:hidden` | 1.3.1, 4.1.2 |
| Estados de foco visibles | `focus-visible:ring-2 focus-visible:ring-primary` en todos los elementos interactivos | 2.4.7 — Foco visible |
| Contraste mínimo AA | 4.5:1 para texto normal, verificado en combinaciones de paleta | 1.4.3 — Contraste mínimo |
| Botón en carga: estado comunicado | `aria-disabled={true}` + `disabled` durante `isLoading` | 4.1.2 — Nombre, función, valor |

---

## 3. Fuentes de Verdad

Ante cualquier discrepancia, prevalece el archivo indicado en la columna "Fuente de verdad".

| Aspecto | Fuente de verdad | Archivo |
|---------|-----------------|---------|
| Paleta principal | Design system | `docs/design/design-system.md` §3.1 |
| Colores de categorías | Implementación + sección 2.2 de este documento | `frontend/src/types/index.ts` (SYSTEM_CATEGORIES) |
| Tipografía | Design system | `docs/design/design-system.md` §3.2 |
| Breakpoints | Design system + Tailwind config | `docs/design/design-system.md` §3.4 |
| Variantes y comportamiento de componentes | Implementación | `frontend/src/components/ui/` |
| Flujos de navegación y estados de pantalla | Design system | `docs/design/design-system.md` §2 |
| Seed de categorías en base de datos | Implementación backend | `backend/app/_seed.py` |
| Decisiones de arquitectura | ADR-001 + mixed_fixes.md | `docs/architecture/ADR-001.md`, `docs/architecture/mixed_fixes.md` |
| Duración del Toast | Este documento (DD-002) | Valor vigente: 3000 ms |
| Patrón de loading state del Button | Implementación | `frontend/src/components/ui/Button.tsx` |
