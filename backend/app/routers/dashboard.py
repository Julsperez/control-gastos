import calendar
from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.dependencies import get_current_user, get_db
from app.models.gasto import Gasto
from app.models.user import User
from app.schemas.dashboard import DashboardResumenOut, GastoDiario, TopCategoria, TotalPorCategoria

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/resumen", response_model=DashboardResumenOut)
def get_resumen(
    mes: str | None = Query(default=None, pattern=r"^\d{4}-\d{2}$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if mes is None:
        mes = datetime.now().strftime("%Y-%m")

    year, month = int(mes[:4]), int(mes[5:7])

    # Mes anterior
    if month == 1:
        prev_year, prev_month = year - 1, 12
    else:
        prev_year, prev_month = year, month - 1
    prev_mes = f"{prev_year}-{prev_month:02d}"

    def gastos_del_mes(target_mes: str) -> list[Gasto]:
        return (
            db.query(Gasto)
            .options(joinedload(Gasto.categoria))  # evita N+1
            .filter(
                Gasto.user_id == current_user.id,
                func.strftime("%Y-%m", Gasto.fecha) == target_mes,
            )
            .all()
        )

    current_gastos = gastos_del_mes(mes)
    prev_gastos = gastos_del_mes(prev_mes)

    total_mes = sum(float(g.amount) for g in current_gastos)
    total_prev = sum(float(g.amount) for g in prev_gastos) if prev_gastos else None

    variacion = None
    if total_prev is not None and total_prev > 0:
        variacion = ((total_mes - total_prev) / total_prev) * 100

    # Total por categoría
    cat_map: dict[int, dict] = {}
    for g in current_gastos:
        cat = g.categoria
        if cat.id not in cat_map:
            cat_map[cat.id] = {"cat": cat, "total": 0.0, "count": 0}
        cat_map[cat.id]["total"] += float(g.amount)
        cat_map[cat.id]["count"] += 1

    total_por_categoria = sorted(
        [
            TotalPorCategoria(
                categoria_id=e["cat"].id,
                categoria_name=e["cat"].name,
                categoria_color=e["cat"].color,
                total=e["total"],
                porcentaje=(e["total"] / total_mes * 100) if total_mes > 0 else 0.0,
                cantidad_gastos=e["count"],
            )
            for e in cat_map.values()
        ],
        key=lambda x: x.total,
        reverse=True,
    )

    # Gasto diario — todos los días del mes (incluye días con 0)
    days_in_month = calendar.monthrange(year, month)[1]
    day_map: dict[str, float] = {}
    for g in current_gastos:
        day_key = str(g.fecha)[:10]  # seguro tanto para date como string
        day_map[day_key] = day_map.get(day_key, 0.0) + float(g.amount)

    gasto_diario = [
        GastoDiario(
            fecha=f"{year}-{month:02d}-{d:02d}",
            total=day_map.get(f"{year}-{month:02d}-{d:02d}", 0.0),
        )
        for d in range(1, days_in_month + 1)
    ]

    # Top 4 categorías + Otros
    top4 = total_por_categoria[:4]
    rest = total_por_categoria[4:]
    top_categorias: list[TopCategoria] = [
        TopCategoria(name=c.categoria_name, value=c.total, color=c.categoria_color)
        for c in top4
    ]
    if rest:
        top_categorias.append(
            TopCategoria(
                name="Otros",
                value=sum(c.total for c in rest),
                color="#6B7280",
            )
        )

    return DashboardResumenOut(
        mes=mes,
        total_mes=total_mes,
        total_mes_anterior=total_prev,
        variacion_porcentual=variacion,
        total_por_categoria=total_por_categoria,
        gasto_diario=gasto_diario,
        top_categorias=top_categorias,
    )
