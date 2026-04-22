from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.config import settings
from app.database import Base, engine
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
