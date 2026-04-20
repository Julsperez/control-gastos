"""
Script standalone para inicializar la base de datos y sembrar categorías del sistema.
Uso: python init_db.py

También se ejecuta automáticamente al arrancar main.py (Base.metadata.create_all).
Este script es útil para pre-cargar el seed en desarrollo sin levantar la app.
"""

from app.database import Base, SessionLocal, engine
from app.models import Categoria  # importa todos los modelos via __init__

SYSTEM_CATEGORIES = [
    {"id": 1,  "name": "Alimentación", "color": "#F97316", "icon": "utensils"},
    {"id": 2,  "name": "Transporte",   "color": "#3B82F6", "icon": "car"},
    {"id": 3,  "name": "Hogar",        "color": "#F59E0B", "icon": "home"},
    {"id": 4,  "name": "Salud",        "color": "#10B981", "icon": "heart"},
    {"id": 5,  "name": "Ocio",         "color": "#A855F7", "icon": "gamepad-2"},
    {"id": 6,  "name": "Ropa",         "color": "#14B8A6", "icon": "shirt"},
    {"id": 7,  "name": "Educación",    "color": "#6366F1", "icon": "book"},
    {"id": 8,  "name": "Servicios",    "color": "#64748B", "icon": "zap"},
    {"id": 9,  "name": "Viajes",       "color": "#0EA5E9", "icon": "plane"},
    {"id": 10, "name": "Otros",        "color": "#6B7280", "icon": "more-horizontal"},
]


def init_db():
    print("Creando tablas...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        for cat_data in SYSTEM_CATEGORIES:
            existing = db.get(Categoria, cat_data["id"])
            if existing is None:
                cat = Categoria(
                    id=cat_data["id"],
                    user_id=None,
                    name=cat_data["name"],
                    color=cat_data["color"],
                    icon=cat_data["icon"],
                )
                db.add(cat)
                print(f"  Agregando categoría: {cat_data['name']}")
        db.commit()
        print("Seed completado.")
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
