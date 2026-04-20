from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.models.categoria import Categoria
from app.models.user import User
from app.schemas.categoria import CategoriaCreate, CategoriaOut, CategoriasListOut

router = APIRouter(prefix="/categorias", tags=["categorias"])


@router.get("", response_model=CategoriasListOut)
def list_categorias(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    items = (
        db.query(Categoria)
        .filter(
            (Categoria.user_id == None) | (Categoria.user_id == current_user.id)  # noqa: E711
        )
        .order_by(Categoria.id)
        .all()
    )
    return CategoriasListOut(items=items)


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
