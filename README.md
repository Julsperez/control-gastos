# Control de Gastos Personales

Aplicación web SPA para el seguimiento y análisis de gastos personales. Frontend en React con TypeScript, backend en FastAPI con autenticación JWT y doble capa de servicios que permite operar con o sin backend activo.

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Vite 5, React 18, TypeScript, Tailwind CSS |
| Estado | Zustand con persist middleware |
| Gráficos | Recharts |
| HTTP | Axios |
| Backend | FastAPI, Python 3.12 |
| ORM | SQLAlchemy 2.x |
| Base de datos | SQLite 3 (WAL mode) |
| Autenticación | PyJWT, bcrypt |
| Contenedores | Docker, Docker Compose |

---

## Quick Start con Docker

**Requisitos previos:** Docker Desktop instalado y corriendo.

**1. Clonar el repositorio y entrar al directorio**

```bash
git clone <repo-url> control-gastos
cd control-gastos
```

**2. Configurar las variables de entorno**

```bash
cp .env.example .env
```

Editar `.env` y reemplazar `SECRET_KEY` con un valor generado:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

**3. Levantar los servicios**

```bash
docker compose up --build
```

Una vez iniciados:

- Frontend: [http://localhost:5173](http://localhost:5173)
- API / Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)

Para detener:

```bash
docker compose down
```

Para detener y eliminar el volumen de datos:

```bash
docker compose down -v
```

---

## Desarrollo sin Docker

### Backend

Ver la guía completa en [`docs/backend/LOCAL_SETUP.md`](docs/backend/LOCAL_SETUP.md).

Resumen:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El servidor de desarrollo queda disponible en [http://localhost:5173](http://localhost:5173).

Para apuntar al backend local, asegurar que el archivo `.env` del frontend (o `frontend/.env.local`) contenga:

```
VITE_API_URL=http://localhost:8000/api/v1
VITE_DATA_SOURCE=api
```

---

## Variables de entorno

### Backend

| Variable | Default | Descripción |
|---|---|---|
| `SECRET_KEY` | `dev-secret-key-change-in-production` | Clave HMAC para firma de JWT. **Obligatorio cambiar en producción.** |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `15` | Tiempo de vida del access token en minutos. |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` | Tiempo de vida del refresh token en días. |
| `CORS_ORIGINS` | `http://localhost:5173` | Orígenes permitidos por CORS, separados por coma si hay varios. |
| `DATABASE_URL` | `sqlite:////data/gastos.db` | URI de conexión a la base de datos. En Docker, el volumen monta `/data`. |

### Frontend

| Variable | Default | Descripción |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000/api/v1` | URL base del backend. Debe ser accesible desde el navegador. |
| `VITE_DATA_SOURCE` | `local` | Fuente de datos activa. `api` usa el backend; `local` usa LocalStorage. |

---

## Modo local sin backend

El frontend tiene una capa de servicio dual controlada por `VITE_DATA_SOURCE`:

- `VITE_DATA_SOURCE=local` — activa `LocalStorageGastosService`, que persiste todos los datos en el localStorage del navegador. No requiere backend ni base de datos. Es el modo por defecto en Docker para desarrollo.
- `VITE_DATA_SOURCE=api` — activa `ApiGastosService`, que realiza las llamadas HTTP al backend FastAPI. Es el modo que debe usarse en producción.

Ambas implementaciones respetan la interfaz `IGastosService`, por lo que el comportamiento del frontend es idéntico en ambos modos salvo por la persistencia y la autenticación.

---

## Estructura del proyecto

```
control-gastos/
├── backend/                        # Servicio FastAPI
│   ├── app/
│   │   ├── main.py                 # Punto de entrada, configuración de la app
│   │   ├── routers/                # Endpoints: auth, gastos, categorias, dashboard
│   │   ├── models/                 # Modelos SQLAlchemy (tablas)
│   │   ├── schemas/                # Esquemas Pydantic (validación y serialización)
│   │   ├── auth/                   # jwt.py (generación/verificación), hashing.py
│   │   └── _seed.py                # Script de datos iniciales para desarrollo
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                       # SPA Vite + React + TypeScript
│   └── src/
│       ├── pages/                  # Páginas principales (Dashboard, Login, etc.)
│       ├── components/             # Componentes reutilizables y de dominio
│       ├── services/               # GastosService.ts, ApiService.ts, LocalStorageService.ts
│       ├── store/                  # authStore.ts, gastosStore.ts (Zustand)
│       ├── types/                  # Definiciones de tipos TypeScript
│       └── hooks/                  # Custom hooks
├── docs/
│   ├── architecture/               # ADR-001.md y notas de decisiones
│   ├── backend/                    # LOCAL_SETUP.md
│   ├── design/                     # design-system.md
│   ├── frontend/                   # implementation-plan.md
│   └── postman/                    # Colección Postman de la API
├── docker-compose.yml
└── .env.example
```

---

## Decisiones de arquitectura

Las decisiones están documentadas formalmente en [`docs/architecture/ADR-001.md`](docs/architecture/ADR-001.md). Resumen de las principales:

**SQLite con WAL mode en lugar de PostgreSQL**
Dado que la aplicación es de uso personal y monousuario, SQLite en modo WAL ofrece suficiente concurrencia de lectura y elimina la necesidad de operar un servidor de base de datos separado. El volumen Docker garantiza la persistencia. La migración a PostgreSQL está contemplada si el alcance cambia: SQLAlchemy abstrae el dialecto sin reescrituras.

**FastAPI como backend**
Validación de esquemas con Pydantic integrada, documentación OpenAPI automática en `/docs`, soporte nativo de async y tipado estático. Para una API REST de este alcance, es la elección con menor overhead operativo en Python.

**JWT con refresh token rotation**
El access token tiene vida corta (15 min) para limitar la ventana de exposición. El refresh token (7 días) se almacena con un hash SHA-256 del `jti` en base de datos, lo que permite revocación explícita. Al rotar, el token anterior se invalida.

**Dual service layer en el frontend**
La interfaz `IGastosService` desacopla los componentes de React de la fuente de datos concreta. Permite desarrollar y demostrar la aplicación sin backend activo (`VITE_DATA_SOURCE=local`) y cambiar a la implementación real de API con una variable de entorno, sin modificar ningún componente.

---

## API Docs

Con el backend corriendo (Docker o local), la documentación interactiva de la API está disponible en:

- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- OpenAPI JSON: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

La colección Postman está en [`docs/postman/`](docs/postman/) para pruebas de integración manuales.
