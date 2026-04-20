# Mixed Fixes — Fase 3 & 4: Correcciones Cruzadas

**Estado:** Aplicado  
**Fecha:** 2026-04-14  
**Autores:** Guido (Arquitecto) · Teff (Senior Engineer)  
**Referencia:** ADR-001 v1.0 → correcciones post-auditoría cruzada

---

## Contexto

Tras completar la implementación inicial (Fases 1-2), se realizó una auditoría cruzada entre agentes (Fase 3). Este documento registra todas las correcciones CRÍTICO y ALTO aplicadas en Fase 4, organizadas por capa.

---

## @guido — Correcciones de Arquitectura & Backend

### CRÍTICO-1: N+1 queries en dashboard

**Archivo:** `backend/app/routers/dashboard.py`  
**Problema:** `gastos_del_mes()` cargaba la relación `.categoria` lazy por defecto. Con N gastos → N SELECT adicionales.  
**Corrección:** `joinedload(Gasto.categoria)` en ambas queries del mes actual y mes anterior.

```python
from sqlalchemy.orm import Session, joinedload

def gastos_del_mes(target_mes: str) -> list[Gasto]:
    return (
        db.query(Gasto)
        .options(joinedload(Gasto.categoria))  # evita N+1
        .filter(...)
        .all()
    )
```

**Defensiva adicional:** uso de `str(g.fecha)[:10]` en lugar de `.strftime()` para tolerar tanto `date` como `str` devuelto por SQLite.

---

### CRÍTICO-2: Inconsistencia UTC en JWT vs SQLite

**Archivos:** `backend/app/auth/jwt.py`, `backend/app/routers/auth.py`  
**Problema:** SQLite almacena y retorna datetimes naive (sin tzinfo). El código usaba `datetime.now()` (local) o `datetime.now(tz=timezone.utc)` (aware), causando comparaciones inconsistentes al verificar `expires_at`.  
**Corrección:** `_utcnow()` usando `datetime.utcnow()` (naive UTC) en `jwt.py` y en las comparaciones de `refresh` en `auth.py`.

```python
# jwt.py
def _utcnow() -> datetime:
    return datetime.utcnow()

# auth.py — refresh endpoint
if not rt or rt.revoked or rt.expires_at < datetime.utcnow():
    raise HTTPException(401, ...)
```

---

### CRÍTICO-3: Header WWW-Authenticate ausente en 401

**Archivo:** `backend/app/auth/jwt.py`  
**Problema:** Las respuestas 401 no incluían el header `WWW-Authenticate: Bearer`, requerido por RFC 6750. Algunos clientes HTTP dependen de este header para detectar que deben renovar el token.  
**Corrección:** Se agregó `headers={"WWW-Authenticate": "Bearer"}` a todos los `HTTPException(401)` en `decode_access_token`.

```python
raise HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Token inválido o expirado",
    headers={"WWW-Authenticate": "Bearer"},
)
```

---

### ALTO-1: TOCTOU en registro de usuario y categorías

**Archivos:** `backend/app/routers/auth.py`, `backend/app/routers/categorias.py`  
**Problema:** El patrón `if existing: raise 409 / else: insert` crea una ventana de race condition entre el SELECT y el INSERT.  
**Corrección:** Se eliminó el pre-check. El constraint UNIQUE de la DB es la verificación autorizada; se captura `IntegrityError` al hacer commit.

```python
from sqlalchemy.exc import IntegrityError

# En register y create_categoria:
try:
    db.commit()
except IntegrityError:
    db.rollback()
    raise HTTPException(status_code=409, detail="Ya existe")
```

---

### ALTO-2: Path incorrecto en DELETE /gastos

**Archivo:** `backend/app/routers/gastos.py`  
**Problema:** El endpoint usaba `/{gasto_id}` pero el contrato en ADR-001 y el frontend esperan `/{id}`. Genera mismatch en la URL al eliminar gastos.  
**Corrección:** Renombrado a `/{id}` con `Path(...)` explícito.

```python
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_gasto(
    id: int = Path(...),
    ...
)
```

**Limpieza adicional:** eliminado `db.refresh(gasto, ["categoria"])` innecesario post-DELETE; reemplazado con `_ = gasto.categoria` para forzar la carga lazy antes de retornar la respuesta.

---

### ALTO-3: Seed de categorías no es idempotente

**Archivo:** `backend/app/_seed.py`  
**Problema:** La función de seed usaba `INSERT OR IGNORE`, lo que significa que si los colores/iconos de una categoría existente cambiaban (ej. ajuste de diseño), los cambios nunca se aplicaban en BDs ya inicializadas.  
**Corrección:** Upsert verdadero: si la fila ya existe, compara cada campo y actualiza si hay diferencias.

```python
else:
    for field in ("name", "color", "icon"):
        if getattr(existing, field) != data[field]:
            setattr(existing, field, data[field])
            changed = True
```

---

### Notas sobre ADR-001 (pendientes de actualizar en el documento base)

| Sección | Desvío actual | Estado |
|---|---|---|
| §2.2 Seed SQL | `INSERT OR IGNORE` obsoleto; `_seed.py` usa upsert | Pendiente |
| §3.4 Hashing | Menciona `passlib[bcrypt]` — reemplazado por `bcrypt` directo | Pendiente |
| §5.1 docker-compose | Healthcheck con `curl` no disponible en `python:3.12-slim` | Corregido en compose real |
| §6.1 requirements.txt | Versiones fijadas con `==`; ahora con `>=` para compatibilidad Python 3.14 | Pendiente |

---

## @teff — Correcciones de Frontend & Servicios

### CRÍTICO-1: ApiService accedía a localStorage directamente

**Archivo:** `frontend/src/services/ApiService.ts`  
**Problema:** El interceptor de Axios leía `localStorage.getItem('cg_auth')` manualmente para obtener tokens, ignorando el store de Zustand. Cualquier cambio en la forma de persistir auth (o el uso de `persist` middleware) dejaba de funcionar.  
**Corrección:** Todo acceso a tokens ahora pasa por `useAuthStore.getState()`, que es la API pública del store.

```typescript
// Interceptor request
const token = useAuthStore.getState().accessToken

// Después de refresh exitoso
useAuthStore.getState().updateTokens(newTokens)

// En logout forzado
useAuthStore.getState().clearAuth()
```

---

### CRÍTICO-2: `updateTokens` faltaba en authStore

**Archivo:** `frontend/src/store/authStore.ts`  
**Problema:** El ApiService necesitaba actualizar solo los tokens (sin tocar `user` ni `isAuthenticated`) después de un refresh. No existía ese método, obligando al service a acceder a localStorage directamente.  
**Corrección:** Agregado `updateTokens(tokens: AuthTokens): void` a la interfaz y la implementación del store.

```typescript
updateTokens: (tokens: AuthTokens) =>
  set({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
  }),
```

---

### ALTO-1: `reset()` en gastosStore no limpiaba categorías

**Archivo:** `frontend/src/store/gastosStore.ts`  
**Problema:** Al hacer logout (que llama `reset()`), el array `categorias` no se vaciaba. Si otro usuario iniciaba sesión en la misma sesión de browser, veía las categorías del usuario anterior hasta el primer fetch.  
**Corrección:** Incluido `categorias: []` en el objeto de reset.

```typescript
reset: () =>
  set({
    dashboard: null,
    gastos: [],
    categorias: [],       // ← corregido
    isLoading: false,
    error: null,
    mesActual: currentMonth(),
  }),
```

---

### ALTO-2: `useIsMobile` no reactivo al resize

**Archivo:** `frontend/src/pages/DashboardPage.tsx`  
**Problema:** El hook calculaba el valor inicial con `window.innerWidth < 640` una sola vez. Al rotar el dispositivo o redimensionar la ventana, el componente no se actualizaba y el FAB / gráficos podían quedar en estado incorrecto.  
**Corrección:** Reescrito como hook reactivo con `matchMedia` y listener de cambio.

```tsx
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === 'undefined' ? true : window.innerWidth < 640,
  )
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 639px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])
  return isMobile
}
```

---

### ALTO-3: Botón cambia de ancho durante estado loading

**Archivo:** `frontend/src/components/ui/Button.tsx`  
**Problema:** Al mostrar el spinner, el texto desaparecía y el botón se encogía al ancho del icono, causando layout shift visible al usuario.  
**Corrección:** Botón con `relative`, spinner posicionado `absolute inset-0`, children con `invisible` (mantiene el espacio en el layout sin renderizarse visualmente).

```tsx
<button className="relative inline-flex ...">
  {isLoading && (
    <span className="absolute inset-0 flex items-center justify-center">
      <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 16} />
    </span>
  )}
  <span className={isLoading ? 'invisible' : ''}>{children}</span>
</button>
```

---

### ALTO-4: Accesibilidad en formularios

**Archivos:** `frontend/src/components/gastos/GastoForm.tsx`, `frontend/src/components/gastos/CategoriaSelector.tsx`  
**Problema:** Los mensajes de error no estaban marcados con `role="alert"`, por lo que lectores de pantalla no los anunciaban al aparecer. El selector de categorías usaba `<div>`/`<label>` en lugar de `<fieldset>`/`<legend>`, lo cual es semánticamente incorrecto para grupos de inputs.  
**Correcciones:**

- `GastoForm.tsx`: `<p role="alert">` en el error de monto.
- `CategoriaSelector.tsx`: `<fieldset>` + `<legend>` en lugar de `<div>` + `<label>`, y `<p role="alert">` en el error.

---

### ALTO-5: FAB visible en escritorio con lector de pantalla

**Archivo:** `frontend/src/pages/DashboardPage.tsx`  
**Problema:** El botón flotante de acción (FAB) usaba solo `lg:hidden` para ocultarse visualmente en pantallas grandes, pero seguía siendo accesible para tecnologías asistivas y recibía foco con Tab.  
**Corrección:** Wrapper con `aria-hidden="true"` adicional.

```tsx
<div className="lg:hidden" aria-hidden="true">
  {/* FAB */}
</div>
```

---

### MEDIO: Toast duration ajustada

**Archivo:** `frontend/src/components/ui/Toast.tsx`  
**Cambio:** Duración aumentada de `2500ms` a `3000ms` para dar más tiempo de lectura en mensajes largos.

---

### MEDIO: Warning en LocalStorageService (modo dev)

**Archivo:** `frontend/src/services/LocalStorageService.ts`  
**Cambio:** Agregado `console.warn` en constructor cuando `import.meta.env.DEV === true`, recordando que las contraseñas se almacenan en texto claro y que es solo para modo dev/local.

```typescript
constructor() {
  if (import.meta.env.DEV) {
    console.warn(
      '[LocalStorageService] Running in local/dev mode — passwords stored in plaintext. ' +
      'Set VITE_DATA_SOURCE=api to use the real backend.',
    )
  }
}
```

---

## Resumen de archivos modificados

| Capa | Archivo | Severidad máxima |
|---|---|---|
| Backend | `app/routers/dashboard.py` | CRÍTICO |
| Backend | `app/auth/jwt.py` | CRÍTICO |
| Backend | `app/routers/auth.py` | CRÍTICO |
| Backend | `app/routers/categorias.py` | ALTO |
| Backend | `app/routers/gastos.py` | ALTO |
| Backend | `app/_seed.py` | ALTO |
| Frontend | `store/authStore.ts` | CRÍTICO |
| Frontend | `services/ApiService.ts` | CRÍTICO |
| Frontend | `store/gastosStore.ts` | ALTO |
| Frontend | `pages/DashboardPage.tsx` | ALTO |
| Frontend | `components/ui/Button.tsx` | ALTO |
| Frontend | `components/gastos/GastoForm.tsx` | ALTO |
| Frontend | `components/gastos/CategoriaSelector.tsx` | ALTO |
| Frontend | `components/ui/Toast.tsx` | MEDIO |
| Frontend | `services/LocalStorageService.ts` | MEDIO |

---

## Items MEDIO pendientes (no aplicados — requieren confirmación)

| # | Descripción | Archivo |
|---|---|---|
| M1 | `create_all` y `seed_categorias()` al import time → migrar a FastAPI `lifespan` | `app/main.py` |
| M2 | Validación hex en campo `color` de `CategoriaCreate` (`^#[0-9A-Fa-f]{6}$`) | `app/schemas/categoria.py` |
| M3 | `max_length=50` en campo `icon` de `CategoriaCreate` | `app/schemas/categoria.py` |

---

*Generado tras auditoría cruzada Fase 3. Correcciones aplicadas en Fase 4.*
