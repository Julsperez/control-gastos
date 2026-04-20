# Bug Report: Budget Sync y Persistencia de Gastos

**Fecha:** 2026-04-20
**Autor:** Guido (Arquitecto Backend)
**Commits revisados:** `dcb012b` (First aidd commit), `6009193` (First functional version)

---

## 1. Resumen de auditoría

### Commits revisados

| Hash | Mensaje | Alcance |
|------|---------|---------|
| `dcb012b` | First aidd commit | Estado inicial del proyecto |
| `6009193` | First functional version | Introducción de `budgetStore`, `useBudget`, router `/budget`, refactor de `DashboardPage`, ajustes en `ApiService` y `LocalStorageService` |

### Archivos involucrados en los bugs

**Frontend:**
- `frontend/src/hooks/useGastos.ts` — lógica de add/delete gasto
- `frontend/src/hooks/useDashboard.ts` — fetch inicial del dashboard
- `frontend/src/hooks/useBudget.ts` — fetch y update de presupuesto
- `frontend/src/store/gastosStore.ts` — estado de gastos, dashboard, categorias
- `frontend/src/store/budgetStore.ts` — estado de presupuesto (store separado)
- `frontend/src/components/dashboard/GastosList.tsx` — lista de gastos (lee del store)
- `frontend/src/pages/DashboardPage.tsx` — orquestación de hooks y render

**Backend:**
- `backend/app/routers/budget.py` — endpoints GET /budget/status, PUT /budget/settings
- `backend/app/schemas/budget.py` — schemas BudgetStatus, BudgetUpdate
- `backend/app/models/user.py` — columnas monthly_budget, alert_threshold_*

El backend no presentó problemas. Ambos bugs tienen causa raíz exclusivamente en el frontend.

---

## 2. Bug 1: Presupuesto no se actualiza en tiempo real

### Síntoma

Al registrar un gasto, el widget de presupuesto en el dashboard no refleja el nuevo monto gastado. Solo se actualiza al recargar la página (F5).

### Causa raíz

`budgetStore` y `gastosStore` son stores Zustand independientes sin coordinación entre ellos. Cuando `useGastos.handleAddGasto` ejecuta un nuevo gasto, actualiza `gastosStore.dashboard` (llamando a `getDashboardData`), pero no actualiza `budgetStore.budgetStatus`. El hook `useBudget` solo dispara su `refetch` al montarse el componente (via `useEffect`), y no vuelve a ejecutarse a menos que cambie `mesActual`.

**Flujo problemático (pre-fix):**

```
handleAddGasto()
  → svc.addGasto()            OK — gasto guardado en backend/localStorage
  → addGasto(newGasto)        OK — agrega al array en gastosStore
  → svc.getDashboardData()    OK — refresca resumen en gastosStore.dashboard
  → [nada toca budgetStore]   BUG — budgetStore.budgetStatus queda obsoleto
```

**Flujo correcto (post-fix):**

```
handleAddGasto()
  → svc.addGasto()
  → addGasto(newGasto)
  → Promise.all([getDashboardData(), getBudgetStatus()])
  → setDashboard(dashboard)
  → setBudgetStatus(budgetStatus)   NUEVO — sincroniza ambos stores
```

### Archivos modificados

**`frontend/src/hooks/useGastos.ts`**

- Se importa `useBudgetStore` para obtener el setter `setBudgetStatus`.
- En `handleAddGasto` y `handleDeleteGasto`, el fetch de dashboard se convierte en `Promise.all([getDashboardData(), getBudgetStatus()])`.
- Ambos resultados se escriben en sus respectivos stores en la misma operación.

### Criterios de aceptación

- Al guardar un gasto, el `BudgetWidget` refleja el nuevo monto `spent` sin recargar la página.
- Al eliminar un gasto, el widget también actualiza en tiempo real.
- La llamada a `getBudgetStatus` es paralela a `getDashboardData`, sin latencia adicional perceptible.
- El comportamiento es idéntico tanto con `VITE_DATA_SOURCE=api` como con `VITE_DATA_SOURCE=local`.

---

## 3. Bug 2: Lista de gastos vacía al recargar

### Síntoma

Al cargar o recargar el dashboard, la sección "Recientes" aparece vacía aunque haya gastos registrados en el mes actual.

### Causa raíz

`GastosList` consume `gastosStore.gastos`, que es estado en memoria puro (Zustand sin persistencia). Al recargar, el store se inicializa con `gastos: []`.

`useDashboard` —el hook que se monta en `DashboardPage` y es el único punto de fetch al cargar— solo llamaba a `getDashboardData` y `getCategorias`. Nunca llamaba a `getGastos`. El array `gastosStore.gastos` se llenaba únicamente cuando el usuario agregaba un gasto en la sesión actual (vía `addGasto` en `useGastos`), pero nunca se poblaba desde el servidor al iniciar.

**Estado al recargar (pre-fix):**

```
gastosStore.gastos = []       ← nunca fetched en mount
gastosStore.dashboard = {...} ← sí fetched por useDashboard
GastosList → lee gastos → [] → muestra "No hay gastos registrados este mes"
```

**Estado al recargar (post-fix):**

```
useDashboard.fetchDashboard()
  → Promise.all([getDashboardData(), getCategorias(), getGastos(mesActual)])
  → setGastos(gastosResponse.items)   NUEVO
GastosList → lee gastos → [gasto1, gasto2, ...] → muestra lista correcta
```

### Archivos modificados

**`frontend/src/store/gastosStore.ts`**

- Se agrega la acción `setGastos(gastos: Gasto[])` a la interfaz `GastosState` y a la implementación del store. Esta acción reemplaza el array completo (necesario para sincronizar el estado al cargar desde servidor).

**`frontend/src/hooks/useDashboard.ts`**

- Se desestructura `setGastos` del store.
- El `Promise.all` existente se extiende con `svc.getGastos(mesActual)`, que devuelve un `GastosResponse`.
- Se llama a `setGastos(gastosResponse.items)` para poblar el store.
- `setGastos` se agrega a las dependencias del `useCallback` para que el lint no genere advertencias.

### Criterios de aceptación

- Al recargar el dashboard, la lista de gastos muestra los registros del mes actual desde el primer render.
- Al cambiar de mes (si la UI lo soporta y `mesActual` cambia), el fetch se repite y la lista se actualiza al mes correspondiente.
- El fetch de gastos es paralelo a los otros fetches: no hay regresión en el tiempo de carga del dashboard.
- En modo `local`, `LocalStorageGastosService.getGastos()` devuelve los gastos desde localStorage correctamente.
- En modo `api`, `ApiGastosService.getGastos()` llama a `GET /api/v1/gastos?mes=YYYY-MM` con el mes correcto.

---

## 4. Notas adicionales

### Problema menor: guard `hasData` en DashboardPage

```tsx
const hasData = dashboard && dashboard.total_mes > 0
```

Si el usuario tiene gastos registrados en el mes pero su `total_mes` es `0` (imposible en la práctica dado que `amount > 0` es validado), el dashboard mostraría `EmptyState` y `GastosList` nunca se renderizaría. No es un bug activo, pero el guard es semánticamente incorrecto: debería validar presencia de gastos, no monto total. Se deja como deuda técnica menor dado que el validador de monto en backend y frontend previene `amount <= 0`.

### Observación sobre coordinación de stores

La solución aplicada al Bug 1 (escribir directamente en `budgetStore` desde `useGastos`) es pragmática y mínimamente invasiva, pero introduce un acoplamiento implícito: `useGastos` ahora conoce la existencia de `budgetStore`. Si el sistema crece, la alternativa más limpia sería un bus de eventos (por ejemplo, un store de eventos o un patrón pub/sub) que permita a `useBudget` reaccionar a cambios en gastos sin que `useGastos` conozca a `budgetStore`. Para la escala actual del proyecto, la solución aplicada es suficiente y justificada.

### Observación sobre el backend de budget

`PUT /api/v1/budget/settings` calcula el `spent` usando `datetime.now().strftime("%Y-%m")` en lugar de aceptar un parámetro `mes`. Esto significa que si se actualiza la configuración viendo un mes histórico, el `spent` devuelto corresponde al mes actual, no al visualizado. No tiene impacto en el bug reportado, pero es un comportamiento a documentar o corregir si se implementa navegación por meses en la UI del presupuesto.
