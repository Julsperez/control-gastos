from app.database import SessionLocal
from app.models.categoria import Categoria

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


def seed_categorias() -> None:
    """Upsert de categorías del sistema. Garantiza el estado deseado en cada arranque."""
    db = SessionLocal()
    try:
        changed = False
        for data in SYSTEM_CATEGORIES:
            existing = db.get(Categoria, data["id"])
            if existing is None:
                db.add(Categoria(
                    id=data["id"],
                    user_id=None,
                    name=data["name"],
                    color=data["color"],
                    icon=data["icon"],
                ))
                changed = True
            else:
                for field in ("name", "color", "icon"):
                    if getattr(existing, field) != data[field]:
                        setattr(existing, field, data[field])
                        changed = True
        if changed:
            db.commit()
    finally:
        db.close()
