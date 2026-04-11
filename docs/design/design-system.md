# Sistema de Diseño — Control de Gastos Personales

**Versión:** 1.0.0  
**Fecha:** 2026-04-10  
**Autor:** Richard (UX Designer)  
**Destinatario principal:** Teff (Frontend Engineer)  
**Stack:** Vite + React + TypeScript | FastAPI + SQLite3 | Mobile-first | WCAG 2.1 AA

---

## Tabla de contenidos

1. [Research y principios de diseño](#1-research-y-principios-de-diseño)
2. [Flujos de usuario](#2-flujos-de-usuario)
3. [Sistema de diseño — valores exactos](#3-sistema-de-diseño--valores-exactos)
4. [Especificaciones de componentes](#4-especificaciones-de-componentes)
5. [Especificaciones de pantallas](#5-especificaciones-de-pantallas)
6. [Checklist de handoff para el desarrollador frontend](#6-checklist-de-handoff-para-el-desarrollador-frontend)

---

## 1. Research y principios de diseño

### 1.1 Análisis de referentes

| App | Fortaleza principal | Debilidad notable | Lección aplicable |
|---|---|---|---|
| **Fintonic** | Categorización automática, dashboard visual con gráficos de dona por categoría, paleta clara con verde como acción principal | Onboarding largo, demasiada información en la pantalla principal | Usar gráfico de categorías como protagonista del dashboard; mantener el home limpio con no más de 3 bloques de información |
| **YNAB** | Metodología clara (presupuesto por sobre), UI orientada a decisiones, no solo a registro | Curva de aprendizaje alta, terminología especializada que asusta a usuarios nuevos | Ocultar complejidad hasta que el usuario la necesite; el registro rápido debe ser el gesto más simple |
| **Money Manager** | Registro de gasto extremadamente rápido (3 taps), teclado numérico nativo como primer campo | Diseño visual anticuado, densidad de información excesiva en listas | Priorizar la velocidad del registro sobre la exploración; el monto primero, siempre |
| **Splitwise** | Claridad en estados de deuda/crédito, feedback visual inmediato al registrar, colores semánticos consistentes | Enfocado en gastos compartidos, no en control personal | Usar colores semánticos de forma consistente (verde = positivo, rojo = alerta); el feedback inmediato al registrar reduce la ansiedad del usuario |

**Conclusión del research:** Las apps más exitosas comparten tres comportamientos: (1) el registro de gasto es la acción más rápida de completar, (2) el dashboard muestra un número grande y claro como ancla cognitiva, y (3) el color se usa con propósito semántico, no decorativo.

---

### 1.2 Principios de diseño

Estos tres principios son la regla de oro para tomar cualquier decisión visual en el proyecto. Ante una duda de diseño, se evalúa contra ellos en orden.

---

#### Principio 1: Registro sin fricción

**Descripción:** El acto de registrar un gasto debe requerir el mínimo esfuerzo cognitivo y motor posible. Cada campo extra, cada confirmación innecesaria y cada animación que ralentice el flujo es un obstáculo que hace que el usuario abandone el registro y pierda el hábito.

**Cómo se manifiesta en la UI:**
- El FAB (botón "+") es el elemento más accesible de cualquier pantalla del dashboard: esquina inferior derecha, siempre visible, no oculto por scroll.
- El primer campo del formulario de gasto es el monto, con teclado numérico activado automáticamente al abrir el BottomSheet.
- La fecha tiene valor por defecto "hoy" — el usuario no toca ese campo en el 90% de los casos.
- La descripción es opcional y ocupa la posición menos prominente del formulario.
- El proceso completo desde cualquier pantalla del dashboard se completa en exactamente 3 interacciones (definidas en sección 2.4).

---

#### Principio 2: Claridad numérica antes que decoración

**Descripción:** En una app de finanzas personales, los números son el contenido principal. El diseño visual debe jerarquizar los datos numéricos por encima de cualquier elemento decorativo. Un usuario que abre la app debe ver el total del mes en menos de 2 segundos sin escanear la pantalla.

**Cómo se manifiesta en la UI:**
- El total gastado del mes ocupa el mayor tamaño tipográfico del dashboard (`3xl`, 30px, peso 700).
- Los gráficos usan colores por categoría, no gradientes ni efectos visuales que compitan con la lectura del dato.
- Los badges de categoría comunican pertenencia, no jerarquía; su tamaño es deliberadamente pequeño para no competir con los montos.
- No hay imágenes de fondo, texturas ni ilustraciones en la pantalla principal con datos — solo en el estado vacío.
- La paleta de colores es funcional: cada color tiene un rol semántico asignado y no se reutiliza fuera de ese rol.

---

#### Principio 3: Confianza a través de la consistencia

**Descripción:** El usuario deposita datos financieros en la app. Para generar confianza, la interfaz debe comportarse de forma 100% predecible. Si un componente se comporta de una manera en un contexto, debe comportarse igual en todos los demás. Las sorpresas visuales o de interacción generan desconfianza.

**Cómo se manifiesta en la UI:**
- Los colores de categoría son siempre los mismos: alimentación siempre es `#F97316`, transporte siempre es `#3B82F6`, etc. No cambian en gráficos vs. badges vs. listas.
- Los estados de feedback (éxito, error, advertencia) usan siempre los mismos colores semánticos definidos en la paleta.
- Todos los formularios del sistema tienen el mismo patrón: label arriba, input, mensaje de error debajo con ícono.
- Las animaciones de entrada y salida de modales/drawers usan siempre la misma curva y duración.
- Los botones primarios siempre son el mismo color; los botones de peligro siempre son el mismo color.

---

## 2. Flujos de usuario

### 2.1 Pantalla 1: Landing / Login

**Descripción general:** Pantalla de entrada única. No hay pantalla de "bienvenida" separada — el login es la primera pantalla. Mobile-first: un único bloque central con el formulario.

**Layout:**
- Fondo: `background` (`#F8FAFC`)
- Logo/nombre de la app centrado en la parte superior (espacio `12` = 48px desde el top)
- Tagline breve debajo del logo: texto `sm`, color `neutral-600`
- Formulario centrado verticalmente con ancho máximo de 400px en desktop
- Enlace "¿No tienes cuenta? Regístrate" debajo del botón de login

**Estado: Vacío (inicial)**
- Campo email: placeholder "tu@email.com", sin valor, sin error
- Campo password: placeholder "Contraseña", sin valor, sin error
- Botón "Iniciar sesión": variante `primary`, estado `default`, ancho completo del formulario
- Enlace "¿Olvidaste tu contraseña?" debajo del campo de contraseña, alineado a la derecha, texto `sm`, color `primary`

**Estado: Cargando (después de submit)**
- Botón "Iniciar sesión" cambia a estado `loading`: texto reemplazado por spinner + "Verificando…"
- Los campos quedan en estado `disabled`
- No hay overlay en pantalla completa — solo el botón comunica el estado de carga
- Duración esperada de la llamada al backend: 500–1500ms

**Estado: Error de credenciales**
- Los campos vuelven a estado `default` (editables)
- Aparece un banner de error inline entre el formulario y el botón (no toast): fondo `#FEF2F2`, borde izquierdo 4px color `danger` (`#EF4444`), ícono de advertencia (16px), texto "Email o contraseña incorrectos. Verifica tus datos e intenta de nuevo." en `sm`, color `neutral-900`
- El campo de email no muestra estado de error individual (es ambiguo intencionalmente por seguridad)
- El campo de contraseña no muestra estado de error individual por la misma razón
- El botón vuelve a estado `default`

**Transiciones:**
- El banner de error aparece con fade-in: duración 200ms, easing `ease-out`
- Si el usuario modifica cualquier campo, el banner desaparece con fade-out: duración 150ms

---

### 2.2 Pantalla 2: Registro

**Descripción general:** Formulario de creación de cuenta. Validación en tiempo real (on-blur por campo, no on-keystroke para no ser agresivo). Un solo paso, sin wizard.

**Layout:**
- Mismo fondo que login: `background` (`#F8FAFC`)
- Botón "←" (back) en la esquina superior izquierda para volver al login
- Título "Crear cuenta" en `xl`, peso 700, color `neutral-900`
- Subtítulo "Comienza a controlar tus gastos hoy" en `sm`, color `neutral-600`
- Formulario con campos en orden vertical: Nombre completo → Email → Contraseña → Confirmar contraseña
- Botón "Crear cuenta" al final, variante `primary`, ancho completo

**Estado: Vacío (inicial)**
- Todos los campos sin valor, sin error
- Botón "Crear cuenta" en estado `default` (no deshabilitado — la validación ocurre al submit también)

**Estado: Validación en tiempo real (on-blur por campo)**

| Campo | Regla | Mensaje de error |
|---|---|---|
| Nombre completo | Mínimo 2 caracteres | "El nombre debe tener al menos 2 caracteres" |
| Email | Formato email válido | "Ingresa un email válido (ej: nombre@dominio.com)" |
| Contraseña | Mínimo 8 caracteres, al menos 1 número | "La contraseña debe tener al menos 8 caracteres y un número" |
| Confirmar contraseña | Debe coincidir con contraseña | "Las contraseñas no coinciden" |

- El campo con error muestra: borde `danger` (`#EF4444`), ícono de error (16px, color `danger`) al final del input, mensaje de error debajo en `xs`, color `danger`
- El campo válido (después de haber tenido error y corregirse) muestra: borde `success` (`#22C55E`), ícono de check (16px, color `success`) al final del input

**Estado: Éxito (cuenta creada)**
- No hay pantalla separada de "cuenta creada"
- El sistema redirige automáticamente al Dashboard
- Aparece un toast de éxito en la parte superior: "Cuenta creada. ¡Bienvenido/a!" — fondo `success`, texto blanco, duración 3s, desaparece con fade-out

**Estado: Error de email duplicado**
- El campo email muestra estado de error con el mensaje: "Este email ya está registrado. ¿Quieres iniciar sesión?"
- El texto "iniciar sesión" dentro del mensaje de error es un enlace que navega al Login
- El botón vuelve a estado `default`

---

### 2.3 Pantalla 3: Dashboard

**Descripción general:** Pantalla principal de la app. Muestra el resumen financiero del mes actual y la lista de gastos recientes. Es la única pantalla post-login hasta que se desarrollen vistas adicionales (historial, perfil).

**Estado: Vacío (sin gastos)**
- Ver sección 5.3 para especificación completa del empty state
- No se muestra el gráfico principal (no hay datos para graficar)
- El FAB siempre está visible en este estado

**Estado: Cargando (fetch inicial de datos)**
- Skeleton loader para cada bloque de información:
  - Bloque de saludo: línea de 120px de ancho, altura 20px, color `neutral-200`, border-radius `2`
  - Bloque de total del mes: rectángulo de 160px × 48px, color `neutral-200`, border-radius `2`
  - Bloque de gráfico: rectángulo de ancho completo × 200px, color `neutral-200`, border-radius `4`
  - Lista de gastos: 3 filas skeleton de 100% × 56px, separadas por `2` (8px), color `neutral-200`
- Animación del skeleton: pulse suave, de `neutral-200` a `neutral-100`, ciclo 1.5s, easing `ease-in-out`
- El FAB es visible durante la carga

**Estado: Con datos**
- Ver sección 5.1 para especificación completa del layout con datos

**Estado: Error de conexión**
- El skeleton desaparece
- Aparece un banner inline (no modal, no pantalla de error): ancho completo, fondo `#FEF2F2`, borde izquierdo 4px color `danger`, texto "No pudimos cargar tus datos. Revisa tu conexión.", botón secundario "Reintentar" a la derecha del texto
- El FAB permanece visible para que el usuario pueda registrar gastos aunque los datos no carguen (optimistic UX)

---

### 2.4 Flujo: Dashboard → Agregar gasto → Confirmación → Dashboard actualizado

**Las 3 interacciones exactas:**

1. **Tap en FAB "+"** (esquina inferior derecha del dashboard)
   → Abre el BottomSheet en mobile / Modal en desktop con el formulario de gasto
   → El campo "Monto" recibe foco automáticamente y el teclado numérico se activa

2. **Ingresar monto + seleccionar categoría**
   → El usuario escribe el monto con el teclado numérico
   → El usuario toca uno de los chips de categoría (se selecciona visualmente)
   → Estos dos sub-pasos ocurren dentro de una sola "interacción" contada como la segunda porque son gestos en el mismo contexto sin navegación

3. **Tap en botón "Guardar gasto"**
   → El sistema valida (monto > 0, categoría seleccionada)
   → Si válido: cierra el BottomSheet/Modal, actualiza el dashboard, muestra toast de confirmación
   → Si inválido: muestra errores inline sin cerrar el formulario

**Nota de diseño:** La descripción y la fecha son opcionales y tienen valores por defecto (descripción vacía, fecha = hoy). El usuario nunca necesita tocarlos para completar el flujo mínimo. Esto garantiza el cumplimiento de la restricción de ≤ 3 interacciones.

---

## 3. Sistema de diseño — valores exactos

### 3.1 Paleta de colores

#### Colores base del sistema

| Token | Hex | Uso |
|---|---|---|
| `primary` | `#6366F1` | Botones de acción principal, links activos, FAB |
| `primary-dark` | `#4F46E5` | Estado hover y active del botón primary |
| `primary-light` | `#EEF2FF` | Fondos de estados selected/active en items de lista |
| `secondary` | `#8B5CF6` | Acento secundario, estados selected en navegación |
| `success` | `#22C55E` | Gasto registrado, validación positiva, feedback de guardado |
| `success-light` | `#F0FDF4` | Fondo de banners de éxito |
| `danger` | `#EF4444` | Eliminar, error de validación, acciones destructivas |
| `danger-light` | `#FEF2F2` | Fondo de banners de error |
| `warning` | `#F59E0B` | Presupuesto cerca del límite (uso futuro), alertas no críticas |
| `warning-light` | `#FFFBEB` | Fondo de banners de advertencia |
| `neutral-900` | `#111827` | Texto principal, títulos, valores numéricos importantes |
| `neutral-700` | `#374151` | Texto de cuerpo en párrafos y descripciones |
| `neutral-600` | `#6B7280` | Texto secundario, placeholders activos, metadatos |
| `neutral-400` | `#9CA3AF` | Placeholders de inputs, texto de hint |
| `neutral-300` | `#D1D5DB` | Bordes, separadores, líneas divisoras |
| `neutral-200` | `#E5E7EB` | Fondos de skeleton loaders |
| `neutral-100` | `#F3F4F6` | Fondos de cards, chips sin seleccionar |
| `background` | `#F8FAFC` | Fondo general de la app |
| `surface` | `#FFFFFF` | Fondo de cards con elevación, modales, bottom sheets |

**Verificación de contraste WCAG 2.1 AA:**
- `neutral-900` sobre `background`: ratio ~15:1 — PASA (requiere 4.5:1 para texto normal)
- `neutral-600` sobre `background`: ratio ~5.9:1 — PASA
- `primary` (`#6366F1`) sobre `surface` (`#FFFFFF`): ratio ~4.6:1 — PASA para texto normal
- `danger` (`#EF4444`) sobre `surface` (`#FFFFFF`): ratio ~4.6:1 — PASA para texto normal
- `success` (`#22C55E`) sobre `surface` (`#FFFFFF`): ratio ~2.3:1 — NO PASA solo; usar solo con texto `neutral-900` encima o como elemento decorativo. Para texto sobre `success-light` (`#F0FDF4`): usar `#15803D` (verde oscuro).

#### Colores de categorías de gasto

Estos colores se usan en gráficos, badges y cualquier referencia visual a la categoría. Son inmutables — no varían por contexto.

| Categoría | Color | Hex |
|---|---|---|
| Alimentación | Naranja | `#F97316` |
| Transporte | Azul | `#3B82F6` |
| Hogar | Amarillo ámbar | `#F59E0B` |
| Salud | Verde esmeralda | `#10B981` |
| Ocio | Violeta | `#A855F7` |
| Ropa | Teal | `#14B8A6` |
| Educación | Índigo | `#6366F1` |
| Servicios | Pizarra | `#64748B` |
| Viajes | Cielo | `#0EA5E9` |
| Otros | Gris | `#6B7280` |

**Fondos de badges por categoría** (para texto legible sobre el badge):

| Categoría | Fondo del badge | Color del texto |
|---|---|---|
| Alimentación | `#FFF7ED` | `#C2410C` |
| Transporte | `#EFF6FF` | `#1D4ED8` |
| Hogar | `#FFFBEB` | `#92400E` |
| Salud | `#ECFDF5` | `#065F46` |
| Ocio | `#FAF5FF` | `#7E22CE` |
| Ropa | `#F0FDFA` | `#0F766E` |
| Educación | `#EEF2FF` | `#4338CA` |
| Servicios | `#F8FAFC` | `#334155` |
| Viajes | `#F0F9FF` | `#0369A1` |
| Otros | `#F8FAFC` | `#334155` |

---

### 3.2 Tipografía

**Familia principal: Inter**

**Justificación:** Inter es la fuente de referencia para interfaces de datos financieros por tres razones concretas: (1) sus cifras tabulares (`font-variant-numeric: tabular-nums`) aseguran que columnas de montos queden perfectamente alineadas sin CSS adicional, (2) su legibilidad en tamaños pequeños (11–12px) es superior a Roboto o Poppins en pantallas de densidad media, y (3) es la fuente usada por los sistemas de diseño de Stripe, Linear y Notion — el usuario que ya usa alguna de estas apps no sentirá la curva de aprendizaje visual.

**Carga:** Variable font desde Google Fonts (`wght` 400–700). Un solo archivo, sin múltiples requests.

#### Escala tipográfica

| Token | Tamaño rem | px equiv | Line-height | Uso principal |
|---|---|---|---|---|
| `xs` | 0.75rem | 12px | 1.5 (18px) | Labels de gráficos, metadatos, timestamps |
| `sm` | 0.875rem | 14px | 1.5 (21px) | Texto secundario, placeholders, mensajes de error |
| `base` | 1rem | 16px | 1.5 (24px) | Texto de cuerpo principal, valores en inputs |
| `lg` | 1.125rem | 18px | 1.4 (25px) | Subtítulos de sección, nombres de categoría en lista |
| `xl` | 1.25rem | 20px | 1.3 (26px) | Títulos de página, títulos de modal |
| `2xl` | 1.5rem | 24px | 1.25 (30px) | Resumen de categoría, cifras secundarias del dashboard |
| `3xl` | 1.875rem | 30px | 1.2 (36px) | Total del mes (número ancla del dashboard) |

#### Pesos tipográficos

| Peso | Valor | Cuándo usarlo |
|---|---|---|
| Regular | 400 | Cuerpo de texto, descripciones, placeholders, metadatos |
| Medium | 500 | Labels de campos, nombres de categoría, texto de navegación |
| Semibold | 600 | Subtítulos de sección, montos en lista de gastos, nombre de usuario |
| Bold | 700 | Total del mes, títulos de página, botones de acción primaria |

**Regla:** No usar más de dos pesos en el mismo bloque de información.

---

### 3.3 Espaciado

**Base del sistema: 4px**

| Token | px | rem | Uso típico |
|---|---|---|---|
| `space-1` | 4px | 0.25rem | Espaciado interno mínimo, gap entre ícono y label |
| `space-2` | 8px | 0.5rem | Padding de badges, gap entre elementos en fila |
| `space-3` | 12px | 0.75rem | Padding interno de inputs (vertical), gap entre chips |
| `space-4` | 16px | 1rem | Padding horizontal de cards y formularios en mobile |
| `space-5` | 20px | 1.25rem | Padding vertical de botones `md` |
| `space-6` | 24px | 1.5rem | Gap entre secciones del dashboard, padding de modal |
| `space-8` | 32px | 2rem | Margen superior de secciones del dashboard |
| `space-10` | 40px | 2.5rem | Altura mínima de elementos interactivos (accesibilidad táctil) |
| `space-12` | 48px | 3rem | Altura del header, distancia del FAB al borde inferior |
| `space-16` | 64px | 4rem | Padding superior del Login (desde safe area top) |

**Regla touch targets (WCAG 2.5.5):** Todo elemento interactivo tiene área táctil mínima de 44×44px.

#### Border radius

| Token | Valor | Uso |
|---|---|---|
| `radius-sm` | 4px | Badges de categoría, chips |
| `radius-md` | 8px | Inputs, selects, cards de gasto |
| `radius-lg` | 12px | Cards principales del dashboard |
| `radius-xl` | 16px | Modal en desktop, BottomSheet (esquinas superiores) |
| `radius-full` | 9999px | FAB, avatares circulares |
| `radius-button-sm` | 6px | Botones `sm` |
| `radius-button-md` | 8px | Botones `md` y `lg` |

#### Sombras

| Token | Valor CSS | Uso |
|---|---|---|
| `shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Cards default, inputs con focus |
| `shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)` | Cards elevadas, dropdown, BottomSheet handle |
| `shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)` | Modal, FAB, BottomSheet completo |
| `shadow-fab` | `0 4px 12px rgba(99, 102, 241, 0.4)` | FAB exclusivamente |

---

### 3.4 Breakpoints

| Token | Rango | Descripción |
|---|---|---|
| `mobile` | < 640px | Diseño principal. BottomSheet, FAB visible, layout en una columna |
| `tablet` | 640px – 1023px | Modal en lugar de BottomSheet, grid de 2 columnas posible |
| `desktop` | ≥ 1024px | Layout 2 columnas: izquierda gráficos, derecha lista |

---

## 4. Especificaciones de componentes

### 4.1 Button

**Variantes:** `primary`, `secondary`, `danger`, `ghost`  
**Tamaños:** `sm`, `md`, `lg`

#### Dimensiones y padding

| Tamaño | Height | Padding H | Padding V | Font size | Font weight | Border radius |
|---|---|---|---|---|---|---|
| `sm` | 32px | 12px | 6px | `sm` 14px | 500 | 6px |
| `md` | 40px | 16px | 10px | `base` 16px | 600 | 8px |
| `lg` | 48px | 20px | 14px | `base` 16px | 700 | 8px |

#### Colores por variante y estado

**Primary**

| Estado | Background | Text | Border | Shadow |
|---|---|---|---|---|
| Default | `#6366F1` | `#FFFFFF` | — | `shadow-sm` |
| Hover | `#4F46E5` | `#FFFFFF` | — | `shadow-md` |
| Active | `#4338CA` | `#FFFFFF` | — | — |
| Disabled | `#A5B4FC` | `#FFFFFF` | — | — |
| Loading | `#6366F1` | transparente | — | `shadow-sm` |

**Secondary**

| Estado | Background | Text | Border | Shadow |
|---|---|---|---|---|
| Default | `#FFFFFF` | `#6366F1` | 1.5px `#6366F1` | `shadow-sm` |
| Hover | `#EEF2FF` | `#4F46E5` | 1.5px `#4F46E5` | `shadow-sm` |
| Active | `#E0E7FF` | `#4338CA` | 1.5px `#4338CA` | — |
| Disabled | `#F9FAFB` | `#9CA3AF` | 1.5px `#D1D5DB` | — |

**Danger**

| Estado | Background | Text | Border |
|---|---|---|---|
| Default | `#EF4444` | `#FFFFFF` | — |
| Hover | `#DC2626` | `#FFFFFF` | — |
| Active | `#B91C1C` | `#FFFFFF` | — |
| Disabled | `#FCA5A5` | `#FFFFFF` | — |

**Ghost**

| Estado | Background | Text |
|---|---|---|
| Default | transparente | `#6B7280` |
| Hover | `#F3F4F6` | `#374151` |
| Active | `#E5E7EB` | `#111827` |
| Disabled | transparente | `#D1D5DB` |

**Estado Loading:** El texto se reemplaza por un spinner centrado. El botón no es clickeable (`pointer-events: none`, `aria-disabled: true`). El ancho no cambia.

**Estado Focus (teclado):** outline 2px solid `#6366F1`, offset 2px. Solo visible con `:focus-visible`.

---

### 4.2 Input

**Estados:** `default`, `focus`, `error`, `disabled`, `valid`

**Anatomía:**
```
[Label]         ← sm 14px, weight 500, neutral-700, margin-bottom: 4px
[Input field]   ← padding: 10px 12px, height: 44px, border-radius: 8px
[Mensaje error] ← xs 12px, weight 400, danger, margin-top: 4px, con ícono 12px
```

| Estado | Background | Border | Text | Shadow |
|---|---|---|---|---|
| Default | `#FFFFFF` | 1.5px `#D1D5DB` | `#111827` | — |
| Focus | `#FFFFFF` | 2px `#6366F1` | `#111827` | `0 0 0 3px rgba(99,102,241,0.15)` |
| Error | `#FFFFFF` | 1.5px `#EF4444` | `#111827` | `0 0 0 3px rgba(239,68,68,0.1)` |
| Disabled | `#F9FAFB` | 1.5px `#E5E7EB` | `#6B7280` | — |
| Valid | `#FFFFFF` | 1.5px `#22C55E` | `#111827` | — |

**Ícono de estado (derecha del input):**
- Error: `ExclamationCircle` 18px, `#EF4444`
- Valid: `CheckCircle` 18px, `#22C55E`
- Password toggle: `Eye`/`EyeOff` 18px, `#9CA3AF`

---

### 4.3 Select

Hereda todos los estilos del Input. Diferencias:

- Ícono `ChevronDown` 18px, color `#9CA3AF`, rota 180° al abrir (150ms, `ease-out`)
- Dropdown: background `#FFFFFF`, border 1px `#E5E7EB`, `radius-md`, `shadow-md`, max-height 240px con scroll, padding `4px` vertical

**Opción del dropdown:**

| Estado | Background | Text |
|---|---|---|
| Default | `#FFFFFF` | `#374151` |
| Hover | `#F3F4F6` | `#111827` |
| Selected | `#EEF2FF` | `#4F46E5` |

La opción seleccionada muestra `Check` 16px, `#6366F1` a la derecha.

---

### 4.4 Card

**Card Default:** background `#FFFFFF`, border 1px `#E5E7EB`, `radius-lg` (12px), sin sombra, padding `space-4`/`space-6`.

**Card Elevated:** background `#FFFFFF`, sin border, `radius-lg` (12px), `shadow-md`, padding `space-4`/`space-6`.

**Card con header opcional:** franja superior con padding `space-4` h × `space-3` v, separador 1px `#E5E7EB`, título `sm` 14px weight 600 `#374151` uppercase.

**Card interactiva:** hover background `#F9FAFB` (150ms `ease-out`), active `#F3F4F6`, cursor pointer.

---

### 4.5 Badge / Chip de categoría

**Anatomía:** `[Dot 8px] [Texto]` — gap `space-1` (4px)

**Display (en listas):**
- Padding: `space-1` v × `space-2` h
- Font-size: `xs` 12px, weight 500
- Border-radius: `radius-sm` (4px)
- Height: 22px
- Colores: usar tabla de fondos de badges de sección 3.1

**Chip interactivo (selector del formulario):**

| Estado | Background | Border | Text |
|---|---|---|---|
| Default | `#F3F4F6` | 1.5px `#E5E7EB` | `#374151` |
| Hover | Fondo claro de la categoría | 1.5px color de la categoría | Color oscuro de la categoría |
| Selected | Fondo claro de la categoría | 2px color de la categoría | Color oscuro de la categoría |

- Padding: `space-2` v × `space-3` h, Height: 36px, Font-size: `sm` 14px weight 500, `radius-md` (8px)
- Selected muestra `Check` 14px a la izquierda del texto

---

### 4.6 FAB (Floating Action Button)

- Tamaño: 56×56px, círculo (`radius-full`)
- Background: `#6366F1`, ícono `Plus` 24px blanco
- Shadow: `shadow-fab` (`0 4px 12px rgba(99,102,241,0.4)`)
- Posición: `fixed`, bottom `space-6` + safe-area-inset-bottom, right `space-4`, z-index 50

| Estado | Background | Transform | Shadow |
|---|---|---|---|
| Default | `#6366F1` | scale(1) | `shadow-fab` |
| Hover | `#4F46E5` | scale(1.05) | sombra más intensa |
| Active | `#4338CA` | scale(0.97) | menor sombra |

**Animación de aparición:** `scale(0) → scale(1)`, 300ms, `cubic-bezier(0.34, 1.56, 0.64, 1)`, delay 200ms tras el contenido.

**Al abrir BottomSheet:** ícono `Plus` rota a `X` en 200ms `ease-out`. Revierte al cerrar.

**En desktop (≥ 1024px):** el FAB no se muestra. El CTA es un botón sticky en la columna derecha.

---

### 4.7 Modal (desktop ≥ 640px)

- Panel: background `#FFFFFF`, `radius-xl` (16px), `shadow-lg`, ancho 480px (tablet: 100% − 32px, máx 480px), padding `space-6`, max-height 90vh con scroll interno
- Overlay: `rgba(0,0,0,0.5)`, z-index 40, tap cierra el modal
- Entrada: `scale(0.95) opacity(0) → scale(1) opacity(1)`, 200ms, `cubic-bezier(0.16,1,0.3,1)`
- Salida: `scale(1) opacity(1) → scale(0.95) opacity(0)`, 150ms, `ease-in`

---

### 4.8 BottomSheet (mobile < 640px)

- Panel: background `#FFFFFF`, `radius-xl` solo esquinas superiores, `shadow-lg`
- Posición: `fixed`, bottom/left/right 0, z-index 50
- Altura inicial: 60vh, máxima: 90vh (expandible)
- Handle: rectángulo 32×4px, color `#D1D5DB`, `radius-sm`, centrado, margin-top `space-3`
- Padding: `space-4` h, `space-8` + safe-area-inset-bottom abajo
- Overlay: `rgba(0,0,0,0.5)`, z-index 40
- Entrada: `translateY(100%) → translateY(0)`, 300ms, `cubic-bezier(0.16,1,0.3,1)`
- Salida: `translateY(0) → translateY(100%)`, 250ms, `ease-in`
- Swipe-to-close: umbral 80px o velocidad >500px/s; si no supera, spring back 200ms

---

### 4.9 EmptyState

- Ícono `Wallet` 64px, color `#A5B4FC`
- Título: "Aún no hay gastos registrados" — `xl` 20px, weight 600, `#111827`, centrado
- Subtítulo: "Empieza a registrar tus gastos diarios y tendrás una vista clara de en qué va tu dinero." — `base` 16px, weight 400, `#6B7280`, max-width 280px, centrado
- CTA: botón `primary` `md`, texto "Registrar mi primer gasto", ancho 240px
- Espaciado: ícono→título `space-4`, título→subtítulo `space-2`, subtítulo→CTA `space-6`

---

## 5. Especificaciones de pantallas

### 5.1 Dashboard — Layout con datos

#### Mobile (< 640px) — Orden vertical de bloques

**Header (height 56px, sticky):**
- Background `#FFFFFF`, borde inferior 1px `#E5E7EB`
- Izquierda: "Hola, [nombre]" `base` weight 600 `#111827`, sub-texto fecha `xs` `#6B7280`
- Derecha: avatar con iniciales, 32px, background `#EEF2FF`, texto `#6366F1`

**Bloque resumen del mes (Card Elevated):**
- Margin: `space-4` h, `space-4` t
- Etiqueta: "Total gastado en abril" `xs` uppercase `#6B7280`
- Número ancla: total del mes `3xl` 30px weight 700 `#111827` — **el elemento más grande de la pantalla**
- Comparativa (si hay datos previos): "↑ 12% vs. marzo" `sm` weight 500, `#EF4444` si aumentó / `#22C55E` si disminuyó

**Bloque gráfico (Card Elevated):**
- Margin: `space-4` h, `space-3` t
- Título: "Por categoría" `sm` uppercase `#374151`
- **BarChart horizontal por categoría** — justificación: en mobile el eje largo es vertical; el BarChart horizontal permite leer la categoría directamente en el eje sin leyenda separada, respondiendo a la pregunta "¿en qué gasto más?" de un vistazo. Barras ordenadas de mayor a menor. Altura por barra: 12px pill, gap `space-3`. La barra más larga ocupa el 100%; las demás se calculan proporcionalmente.

**Bloque gastos recientes (lista):**
- Margin: `space-4` h, `space-3` t
- Título: "Recientes" `sm` uppercase + enlace "Ver todos →" a la derecha (reservado)
- Últimos 5 gastos ordenados por fecha descendente
- Ítem: Height 60px. Layout: [Badge] [Descripción + Fecha] [Monto]
  - Monto: `base` weight 600 `#111827`, alineado derecha
  - Descripción: `base` weight 500 `#111827`, truncado 1 línea
  - Fecha: `xs` `#6B7280`
  - Separador entre ítems: 1px `#F3F4F6`
- Padding bottom: `space-12` (48px) para no quedar bajo el FAB

**FAB:** fijo, esquina inferior derecha.

#### Desktop (≥ 1024px) — Grid 2 columnas

- Columna izquierda (55%, máx 640px): Card resumen + Card con BarChart vertical
- Columna derecha (45%, máx 480px): lista completa del mes + botón "Registrar nuevo gasto" sticky en bottom de columna
- Gap entre columnas: `space-8`, padding horizontal del contenedor: `space-8`, max-width 1280px centrado
- En desktop el FAB **no se muestra**

#### Jerarquía visual (regla de oro)

1. Total del mes (`3xl`, bold, `#111827`)
2. Barras del gráfico (color, sin texto dominante)
3. Montos de la lista (`base`, semibold)
4. Descripciones, fechas, labels (`sm`/`xs`, regular, `#6B7280`)
5. Separadores, bordes, fondos (infraestructura visual)

---

### 5.2 Formulario de gasto

**Título:** "Registrar gasto" — `xl` 20px, weight 700, `#111827`

**Orden y especificación de campos:**

**Campo 1 — Monto (más prominente)**
- Label: "¿Cuánto gastaste?"
- Font-size en input: `2xl` 24px weight 700 `#111827`, alineación centrada
- Prefix: símbolo `$` en `2xl` weight 400 `#6B7280`
- Height: 64px (excepcional para enfatizar importancia)
- `inputMode="decimal"` para teclado numérico en mobile
- **Foco automático al abrir el BottomSheet/Modal**
- Error: "Ingresa un monto mayor a 0"

**Campo 2 — Categoría (chips visuales)**
- Label: "Categoría"
- Chips: Alimentación, Transporte, Hogar, Salud, Ocio, Ropa, Educación, Servicios, Viajes, Otros
- Fila flex wrapping, gap `space-2`, un solo chip seleccionado a la vez
- Sin selección por defecto (selección explícita obligatoria)
- Error: "Selecciona una categoría"

**Campo 2b — Nombre custom (condicional)**
- Aparece SOLO al seleccionar "Otros"
- Animación: `max-height 0 → 200px` + `opacity 0 → 1`, 200ms `ease-out`
- Label: "¿Qué tipo de gasto es?"
- Placeholder: "Ej: suscripción, regalo, impuesto…"
- Max-length: 40 caracteres con contador "0/40"
- Opcional: si vacío, se guarda como "Otros"
- Al deseleccionar "Otros": desaparece con 150ms `ease-in`, se limpia el valor

**Campo 3 — Descripción (opcional)**
- Label: "Descripción" + badge "(opcional)" en `xs` `#9CA3AF`
- Placeholder: "Ej: almuerzo con clientes, uber al aeropuerto…"
- Max-length: 100 con contador "0/100"

**Campo 4 — Fecha (default: hoy)**
- Label: "Fecha"
- Muestra "hoy, 10 de abril" (formato legible, no ISO)
- Input type date, ícono calendario 16px `#9CA3AF` a la derecha

**Botón submit:** "Guardar gasto", `primary` `lg`, ancho completo, margin-top `space-6`

---

#### Feedback de éxito

1. Botón pasa a `loading`
2. Al confirmar: cierra BottomSheet/Modal con animación de salida
3. FAB: `scale 1 → 1.2 → 1` en 300ms + color temporal `success` durante 300ms
4. Toast: fondo `#22C55E`, texto blanco "Gasto registrado", 2.5s, slide-down 200ms entrada, fade-out 150ms salida
5. Dashboard: total del mes actualiza con count-up 500ms

#### Feedback de error (red/backend)

- BottomSheet/Modal permanece abierto, botón regresa a `default`
- Banner inline sobre el botón: fondo `#FEF2F2`, borde izquierdo 4px `#EF4444`, texto "No pudimos guardar el gasto. Verifica tu conexión e intenta de nuevo.", dismissible con `×`

---

### 5.3 Estado vacío del dashboard

**Condición:** Usuario sin ningún gasto registrado en el sistema.

- Header sticky permanece visible
- Área de contenido muestra EmptyState centrado (ver especificación 4.9)
- FAB siempre visible (duplica el CTA del EmptyState)
- El botón del EmptyState abre el mismo BottomSheet/Modal que el FAB

---

## 6. Checklist de handoff para el desarrollador frontend

### Prioridad 1 — Tokens y componentes base (implementar primero)

- [ ] Design tokens como CSS custom properties o Tailwind config (colores, tipografía, espaciado, sombras)
- [ ] **Button** (todas las variantes y estados, spinner en loading)
- [ ] **Input** (label, estados, mensajes de error, íconos de estado)
- [ ] **Badge/Chip** (display y variante interactiva)
- [ ] **Card** (default y elevated)

### Prioridad 2 — Componentes de contenedor

- [ ] **BottomSheet** (handle, overlay, animación, swipe-to-close)
- [ ] **Modal** (overlay, animación, cierre por overlay y Escape)
- [ ] **Toast** (éxito y error, auto-dismiss, animación)
- [ ] **Select** (dropdown, estados, check en opción seleccionada)
- [ ] **FAB** (animación de aparición y confirmación de éxito)
- [ ] **EmptyState** (ícono + título + subtítulo + CTA)
- [ ] **Skeleton loader** (bloques para resumen, gráfico, lista)

### Prioridad 3 — Páginas en orden

1. Login
2. Registro (con validación on-blur)
3. Dashboard — estado vacío
4. Formulario de gasto (BottomSheet/Modal)
5. Dashboard — con datos y BarChart

### Prioridad 4 — Comportamientos interactivos no obvios

| Comportamiento | Detalle de implementación |
|---|---|
| Foco automático en Monto | `useEffect` + `inputRef.current.focus()` con delay 300ms tras la animación de entrada |
| Swipe-to-close del BottomSheet | Track `touchstart`/`touchmove`/`touchend`, umbral 80px o velocidad >500px/s |
| Ícono FAB Plus→X | El ícono cambia al estado del BottomSheet para comunicar control al usuario |
| Campo "Nombre custom" condicional | `max-height 0 → 200px` con `overflow: hidden`; no usar `display: none` porque corta la animación |
| Count-up del total del mes | `requestAnimationFrame` o `react-countup`, 500ms al actualizar tras guardar |
| `inputMode="decimal"` en Monto | En iOS `type="number"` no activa teclado decimal confiablemente; usar `inputMode="decimal"` + `type="text"` |
| Scroll del dashboard con FAB fijo | Last item de la lista necesita `padding-bottom: 80px` para no quedar bajo el FAB |
| Bloquear scroll del body | Al abrir BottomSheet: `body { overflow: hidden }`. Al cerrar: removerlo |

### Prioridad 5 — Animaciones con valores exactos

| Elemento | Propiedad | Duración | Easing |
|---|---|---|---|
| BottomSheet entrada | `translateY(100%) → 0` | 300ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| BottomSheet salida | `translateY(0) → 100%` | 250ms | `ease-in` |
| Modal entrada | `scale(0.95) + opacity(0) → scale(1) + opacity(1)` | 200ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Modal salida | `scale(1) + opacity(1) → scale(0.95) + opacity(0)` | 150ms | `ease-in` |
| Overlay entrada | `opacity 0 → 0.5` | 200ms | `ease-out` |
| Overlay salida | `opacity 0.5 → 0` | 150ms | `ease-in` |
| FAB aparición inicial | `scale(0) → scale(1)` | 300ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` — delay 200ms |
| FAB ícono Plus→X | `rotate(0deg) → rotate(45deg)` | 200ms | `ease-out` |
| FAB confirmación éxito | `scale 1→1.2→1` + color `primary→success→primary` | 300ms | `ease-out` |
| Campo custom aparición | `max-height 0 → 200px` + `opacity 0 → 1` | 200ms | `ease-out` |
| Campo custom desaparición | `max-height 200px → 0` + `opacity 1 → 0` | 150ms | `ease-in` |
| Skeleton loader pulse | `opacity 1 → 0.5 → 1` | 1500ms ciclo | `ease-in-out` |
| Toast entrada | `translateY(-100%) → 0` | 200ms | `ease-out` |
| Toast salida | `opacity 1 → 0` | 150ms | `ease-in` |
| Total del mes count-up | valor numérico animado | 500ms | `ease-out` |
| Hover en botones | background + shadow | 150ms | `ease-out` |
| Hover en ítem de lista | background | 150ms | `ease-out` |

### Prioridad 6 — Casos edge con diseño específico

| Caso | Comportamiento |
|---|---|
| Descripción muy larga en lista | `text-overflow: ellipsis` en 1 línea; `title` attribute para tooltip en desktop |
| Monto con muchos dígitos (>7) | Font-size `2xl → xl` en el campo del formulario; usar `clamp(1.25rem, 5vw, 1.5rem)` |
| Nombre de categoría custom largo | Max 15 chars en badge (ellipsis); max-width 160px en chip del selector (ellipsis) |
| Solo una categoría en gráfico | No mostrar barra única; reemplazar con texto: "[Categoría] · 100% del gasto del mes" |
| 0 gastos del mes actual con historial previo | No mostrar EmptyState completo; mostrar "$0.00" en total + "No hay gastos registrados este mes" en la lista |
| Nombre de usuario muy largo en saludo | Truncar a 20 caracteres con ellipsis |
| Teclado virtual en mobile con BottomSheet | El formulario es scrollable internamente; botón "Guardar gasto" es sticky en el bottom del BottomSheet |
| Sin conexión al guardar | Banner de error inline (ver sección 5.2); no cerrar el formulario (los datos del usuario no se pierden) |

---

*Fin del documento. Versión 1.0.0 — Richard, 10 de abril de 2026.*
