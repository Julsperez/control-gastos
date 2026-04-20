from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import auth, categorias, dashboard, gastos

# Crear tablas + seed categorías del sistema (idempotente)
Base.metadata.create_all(bind=engine)

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


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
