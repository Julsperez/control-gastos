from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.config import settings
from app.database import Base, engine
from app.models import monthly_budget as _mb_model  # noqa: F401 — registra tabla en metadata
from app.routers import auth, budget, categorias, dashboard, gastos

# Crear tablas nuevas (idempotente)
Base.metadata.create_all(bind=engine)

# Migración de columnas: agrega campos que no existían en tablas ya creadas
_COLUMN_MIGRATIONS = [
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS monthly_budget NUMERIC(12, 2)",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS alert_threshold_warning INTEGER NOT NULL DEFAULT 70",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS alert_threshold_critical INTEGER NOT NULL DEFAULT 90",
]
for _stmt in _COLUMN_MIGRATIONS:
    with engine.begin() as _conn:
        _conn.execute(text(_stmt))

# Migración de datos: reasignar gastos y eliminar categorías obsoletas del sistema
# Idempotente: UPDATE sin matches y DELETE de filas inexistentes no tienen efecto
_CATEGORY_DATA_MIGRATIONS = [
    "UPDATE gastos SET category_id = 2  WHERE category_id = 14",   # Gasolina → Transporte
    "UPDATE gastos SET category_id = 5  WHERE category_id = 15",   # Citas → Ocio y entretenimiento
    "UPDATE gastos SET category_id = 10 WHERE category_id = 9",    # Viajes → Familia y otros
    "UPDATE gastos SET category_id = 10 WHERE category_id = 11",   # Compras en línea → Familia y otros
    "UPDATE gastos SET category_id = 10 WHERE category_id = 12",   # Impuestos → Familia y otros
    "DELETE FROM categorias WHERE id IN (9, 11, 12, 14, 15) AND user_id IS NULL",
]
for _stmt in _CATEGORY_DATA_MIGRATIONS:
    with engine.begin() as _conn:
        _conn.execute(text(_stmt))

from app._seed import seed_categorias  # noqa: E402

seed_categorias()

app = FastAPI(
    title="Control de Gastos API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers bajo /api/v1
PREFIX = "/api/v1"
app.include_router(auth.router, prefix=PREFIX)
app.include_router(gastos.router, prefix=PREFIX)
app.include_router(categorias.router, prefix=PREFIX)
app.include_router(dashboard.router, prefix=PREFIX)
app.include_router(budget.router, prefix=PREFIX)


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
