# Plan de Implementación Frontend — Control de Gastos Personales

**Versión:** 1.0.0  
**Fecha:** 2026-04-10  
**Autor:** Teff (Frontend Engineer)  
**Documentos de referencia:** ADR-001.md (Guido), design-system.md (Richard)

---

## Inconsistencias detectadas entre documentos

| # | Inconsistencia | Documento A | Documento B | Resolución |
|---|---|---|---|---|
| 1 | Colores de categorías del seed | ADR-001 seed: Alimentación `#F59E0B`, Hogar `#8B5CF6`, Salud `#EF4444`, Ocio `#EC4899` | design-system: Alimentación `#F97316`, Hogar `#F59E0B`, Salud `#10B981`, Ocio `#A855F7` | **Usar colores de design-system.md** — Richard es la fuente de verdad para decisiones visuales |
| 2 | Puerto del frontend en docker-compose | ADR-001: `5173:5173` en el servicio frontend | design-system: no menciona puertos | **Usar `5173:80`** con nginx en el Dockerfile de producción (el servicio Vite dev corre en 5173, nginx sirve el build en 80) |
| 3 | `VITE_DATA_SOURCE` default en docker-compose | ADR-001 docker-compose: `api` | Plan original: `local` para facilitar desarrollo | **`local` como default** en `.env.example` para que el frontend funcione sin backend levantado |

---

## Árbol de componentes React

```
App
├── ToastProvider (context)
├── BrowserRouter
│   └── Routes
│       ├── /login → LoginPage (smart)
│       │   └── LoginForm (smart — maneja estado del form)
│       │       ├── Input (dumb)
│       │       └── Button (dumb)
│       ├── /register → RegisterPage (smart)
│       │   └── RegisterForm (smart — validación on-blur)
│       │       ├── Input (dumb)
│       │       └── Button (dumb)
│       └── / → ProtectedRoute → DashboardPage (smart)
│           ├── Header (dumb — saludo + avatar)
│           ├── ResumenMes (dumb — recibe total como prop)
│           ├── GraficoBarras (dumb — recibe data Recharts)
│           ├── GastosList (smart — lista + eliminar)
│           │   └── GastoItem (dumb)
│           ├── EmptyState (dumb)
│           ├── Skeleton (dumb — variantes por bloque)
│           ├── FAB (dumb)
│           └── BottomSheet / Modal (smart — gestiona open/close)
│               └── GastoForm (smart — todo el form logic)
│                   ├── Input (dumb)
│                   ├── CategoriaSelector (smart — chips interactivos)
│                   │   ├── Badge/Chip (dumb)
│                   │   └── CategoriaCustomInput (dumb)
│                   └── Button (dumb)
```

**Dumb components:** reciben props, no tienen estado propio (excepto UI state trivial como hover). Puros y reutilizables.  
**Smart components:** acceden a stores/hooks, disparan side effects, coordinan lógica de negocio.

---

## Estrategia de estado — Zustand

**Elección:** Zustand sobre Context API y Redux.

**Justificación:**
- Context API requiere re-renders del árbol completo al cualquier cambio de estado — inaceptable para el dashboard que actualiza frecuentemente.
- Redux es overkill: demasiado boilerplate para una app de un solo usuario.
- Zustand: API mínima, sin providers, selectors granulares, middleware `persist` nativo para tokens.

**Dos stores separados:**

```typescript
// authStore — estado de autenticación
{
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  // Persistido en localStorage con middleware persist
}

// gastosStore — estado de datos de la app
{
  dashboard: DashboardResumen | null
  gastos: Gasto[]
  categorias: Categoria[]
  isLoading: boolean
  error: string | null
  mesActual: string  // 'YYYY-MM'
  // NO persistido — se re-fetcha al montar
}
```

**Por qué no persistir gastosStore:** Los datos financieros deben estar siempre frescos desde el servidor/localStorage. Persistirlos en el store añade complejidad de invalidación sin beneficio real.

---

## Capa de abstracción de datos

### Interfaz `IGastosService`

```typescript
interface IGastosService {
  register(email, password, full_name?): Promise<AuthResponse>
  login(email, password): Promise<AuthResponse>
  refresh(refresh_token): Promise<AuthTokens>
  getGastos(mes?, categoria_id?): Promise<GastosResponse>
  addGasto(data): Promise<Gasto>
  deleteGasto(id): Promise<void>
  getCategorias(): Promise<Categoria[]>
  addCategoria(data): Promise<Categoria>
  getDashboardData(mes?): Promise<DashboardResumen>
}
```

### `LocalStorageGastosService`
- Persiste en `localStorage` con prefijo `cg_` (control-gastos)
- Simula auth con usuarios en `cg_users`, tokens fake con `btoa(JSON.stringify(payload))`
- Calcula dashboard en memoria desde los gastos almacenados
- Delay de 300ms para simular latencia de red
- Incluye las 10 categorías predefinidas como seed inmutable

### `ApiGastosService`
- Axios instance con baseURL desde `VITE_API_URL`
- Interceptor de request: inyecta `Authorization: Bearer <token>` desde authStore
- Interceptor de response: captura 401 → intenta refresh → reintenta request → si falla, clearAuth() + redirect /login

### Factory function

```typescript
export function createGastosService(): IGastosService {
  return import.meta.env.VITE_DATA_SOURCE === 'api'
    ? new ApiGastosService()
    : new LocalStorageGastosService()
}

// Singleton para toda la app
export const gastosService = createGastosService()
```

---

## Plan de implementación por fases

### Fase A — Configuración del proyecto
`package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`

**Por qué primero:** Sin la config de build, ningún archivo TypeScript puede verificarse. Los tokens de Tailwind deben estar disponibles antes de escribir clases en los componentes.

### Fase B — Tipos TypeScript
`src/types/index.ts`

**Por qué segundo:** Todos los archivos subsiguientes importan de types. Sin types, el compilador falla en todos los demás archivos.

### Fase C — Capa de servicios
`src/services/GastosService.ts`, `LocalStorageService.ts`, `ApiService.ts`

**Por qué tercero:** Los stores y hooks dependen del servicio. El `LocalStorageService` funcional permite probar sin backend.

### Fase D — Stores y hooks
`src/store/authStore.ts`, `gastosStore.ts`  
`src/hooks/useAuth.ts`, `useDashboard.ts`, `useGastos.ts`, `useToast.ts`

**Por qué cuarto:** Los componentes smart dependen de los hooks.

### Fase E — Componentes UI base
Todo en `src/components/ui/`

**Por qué quinto:** Los componentes de auth, gastos y dashboard los usan.

### Fase F — Componentes de dominio + páginas
Auth → Gastos → Dashboard → Páginas

### Fase G — Entry points y Docker
`App.tsx`, `main.tsx`, `index.css`, `index.html`, `Dockerfile`, `nginx.conf`, `docker-compose.yml`

---

*Plan aprobado. Implementación iniciada.*
