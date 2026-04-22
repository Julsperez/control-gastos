from datetime import date, datetime

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from sqlalchemy import func, text
from sqlalchemy.orm import Session, joinedload

from app.dependencies import get_current_user, get_db
from app.models.categoria import Categoria
from app.models.gasto import Gasto
from app.models.user import User
from app.schemas.gasto import GastoCreate, GastoOut, GastosListOut

router = APIRouter(prefix="/gastos", tags=["gastos"])


@router.get("", response_model=GastosListOut)
def list_gastos(
    mes: str | None = Query(default=None, pattern=r"^\d{4}-\d{2}$"),
    categoria_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if mes is None:
        mes = datetime.now().strftime("%Y-%m")

    q = (
        db.query(Gasto)
        .options(joinedload(Gasto.categoria))
        .filter(
            Gasto.user_id == current_user.id,
            func.to_char(Gasto.fecha, "YYYY-MM") == mes,
        )
    )
    if categoria_id is not None:
        q = q.filter(Gasto.category_id == categoria_id)

    items = q.order_by(Gasto.fecha.desc()).all()
    total_sum = sum(float(g.amount) for g in items)

    return GastosListOut(items=items, total=len(items), sum=total_sum)


@router.post("", response_model=GastoOut, status_code=status.HTTP_201_CREATED)
def create_gasto(
    data: GastoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cat = db.query(Categoria).filter(
        Categoria.id == data.category_id,
        (Categoria.user_id == None) | (Categoria.user_id == current_user.id),  # noqa: E711
    ).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")

    gasto = Gasto(
        user_id=current_user.id,
        amount=data.amount,
        category_id=data.category_id,
        description=data.description,
        fecha=data.fecha or date.today(),
    )
    db.add(gasto)
    db.commit()
    db.refresh(gasto)
    # Forzar carga de la relación mientras la sesión está abierta
    _ = gasto.categoria

    return gasto


@router.get("/available-months", response_model=list[str])
def get_available_months(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    mes_col = func.to_char(Gasto.fecha, "YYYY-MM").label("mes")
    rows = (
        db.query(mes_col)
        .filter(Gasto.user_id == current_user.id)
        .distinct()
        .order_by(text("mes DESC"))
        .all()
    )
    return [r[0] for r in rows]


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_gasto(
    id: int = Path(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    gasto = db.query(Gasto).filter(
        Gasto.id == id,
        Gasto.user_id == current_user.id,
    ).first()
    if not gasto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gasto no encontrado")

    db.delete(gasto)
    db.commit()
