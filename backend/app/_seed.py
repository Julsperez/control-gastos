from app.database import SessionLocal
from app.models.categoria import Categoria

SYSTEM_CATEGORIES = [
    {"id": 1,  "name": "Despensa y súper",           "color": "#F97316", "icon": "utensils"},
    {"id": 13, "name": "Restaurantes y comida fuera", "color": "#F43F5E", "icon": "utensils-crossed"},
    {"id": 2,  "name": "Transporte",                  "color": "#3B82F6", "icon": "car"},
    {"id": 3,  "name": "Hogar",                       "color": "#F59E0B", "icon": "home"},
    {"id": 8,  "name": "Servicios y suscripciones",   "color": "#0D9488", "icon": "zap"},
    {"id": 4,  "name": "Salud",                       "color": "#10B981", "icon": "heart"},
    {"id": 6,  "name": "Cuidado personal",            "color": "#A855F7", "icon": "scissors"},
    {"id": 5,  "name": "Ocio y entretenimiento",      "color": "#8B5CF6", "icon": "gamepad-2"},
    {"id": 7,  "name": "Educación",                   "color": "#6366F1", "icon": "book"},
    {"id": 10, "name": "Familia y otros",             "color": "#6B7280", "icon": "users"},
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
