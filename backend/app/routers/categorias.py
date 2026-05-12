from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.models.categoria import Categoria
from app.models.user import User
from app.schemas.categoria import CategoriaCreate, CategoriaOut, CategoriasListOut

router = APIRouter(prefix="/categorias", tags=["categorias"])

# Orden de display de las categorías del sistema (Familia y otros siempre al final)
_SYSTEM_DISPLAY_ORDER = [1, 13, 2, 3, 8, 4, 6, 5, 7, 10]


@router.get("", response_model=CategoriasListOut)
def list_categorias(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    all_cats = (
        db.query(Categoria)
        .filter(
            (Categoria.user_id == None) | (Categoria.user_id == current_user.id)  # noqa: E711
        )
        .all()
    )
    system_cats = sorted(
        [c for c in all_cats if c.user_id is None],
        key=lambda c: _SYSTEM_DISPLAY_ORDER.index(c.id) if c.id in _SYSTEM_DISPLAY_ORDER else 999,
    )
    custom_cats = [c for c in all_cats if c.user_id is not None]
    return CategoriasListOut(items=system_cats + custom_cats)


@router.post("", response_model=CategoriaOut, status_code=status.HTTP_201_CREATED)
def create_categoria(
    data: CategoriaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cat = Categoria(
        user_id=current_user.id,
        name=data.name,
        color=data.color or "#6B7280",
        icon=data.icon or "tag",
    )
    db.add(cat)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Categoría ya existe")
    db.refresh(cat)

    return cat
