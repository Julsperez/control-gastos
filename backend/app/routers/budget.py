from datetime import datetime

from fastapi import APIRouter, Depends, Path, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.models.gasto import Gasto
from app.models.monthly_budget import MonthlyBudget
from app.models.user import User
from app.schemas.budget import BudgetStatus, BudgetUpdate, MonthlyBudgetOut, MonthlyBudgetSet

router = APIRouter(prefix="/budget", tags=["budget"])


def _get_monthly_override(user_id: int, mes: str, db: Session) -> MonthlyBudget | None:
    return (
        db.query(MonthlyBudget)
        .filter(MonthlyBudget.user_id == user_id, MonthlyBudget.mes == mes)
        .first()
    )


def _compute_status(
    user: User,
    spent: float,
    monthly_override: MonthlyBudget | None = None,
) -> BudgetStatus:
    if monthly_override is not None:
        budget: float | None = float(monthly_override.amount)
        has_monthly_override = True
    else:
        budget = float(user.monthly_budget) if user.monthly_budget is not None else None
        has_monthly_override = False

    if budget is None:
        return BudgetStatus(
            budget=None,
            spent=spent,
            remaining=None,
            percentage_used=None,
            alert_level="none",
            alert_threshold_warning=user.alert_threshold_warning,
            alert_threshold_critical=user.alert_threshold_critical,
            has_monthly_override=False,
        )

    remaining = budget - spent
    percentage_used = (spent / budget) * 100

    if spent > budget:
        alert_level = "exceeded"
    elif percentage_used >= user.alert_threshold_critical:
        alert_level = "critical"
    elif percentage_used >= user.alert_threshold_warning:
        alert_level = "warning"
    else:
        alert_level = "none"

    return BudgetStatus(
        budget=budget,
        spent=spent,
        remaining=remaining,
        percentage_used=round(percentage_used, 2),
        alert_level=alert_level,
        alert_threshold_warning=user.alert_threshold_warning,
        alert_threshold_critical=user.alert_threshold_critical,
        has_monthly_override=has_monthly_override,
    )


def _spent_for_month(user_id: int, mes: str, db: Session) -> float:
    result = (
        db.query(func.sum(Gasto.amount))
        .filter(
            Gasto.user_id == user_id,
            func.to_char(Gasto.fecha, "YYYY-MM") == mes,
        )
        .scalar()
    )
    return float(result) if result is not None else 0.0


@router.get("/status", response_model=BudgetStatus)
def get_budget_status(
    mes: str | None = Query(default=None, pattern=r"^\d{4}-\d{2}$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> BudgetStatus:
    if mes is None:
        mes = datetime.now().strftime("%Y-%m")
    spent = _spent_for_month(current_user.id, mes, db)
    monthly_override = _get_monthly_override(current_user.id, mes, db)
    return _compute_status(current_user, spent, monthly_override)


@router.put("/settings", response_model=BudgetStatus)
def update_budget_settings(
    payload: BudgetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> BudgetStatus:
    current_user.monthly_budget = payload.monthly_budget
    current_user.alert_threshold_warning = payload.alert_threshold_warning
    current_user.alert_threshold_critical = payload.alert_threshold_critical
    db.commit()
    db.refresh(current_user)

    mes = datetime.now().strftime("%Y-%m")
    spent = _spent_for_month(current_user.id, mes, db)
    monthly_override = _get_monthly_override(current_user.id, mes, db)
    return _compute_status(current_user, spent, monthly_override)


@router.get("/monthly", response_model=list[MonthlyBudgetOut])
def list_monthly_budgets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[MonthlyBudget]:
    return (
        db.query(MonthlyBudget)
        .filter(MonthlyBudget.user_id == current_user.id)
        .order_by(MonthlyBudget.mes.desc())
        .all()
    )


@router.put("/monthly/{mes}", response_model=BudgetStatus)
def set_monthly_budget(
    mes: str = Path(pattern=r"^\d{4}-\d{2}$"),
    payload: MonthlyBudgetSet = MonthlyBudgetSet(),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> BudgetStatus:
    existing = _get_monthly_override(current_user.id, mes, db)

    if payload.amount is None:
        if existing:
            db.delete(existing)
            db.commit()
    else:
        if existing:
            existing.amount = payload.amount  # type: ignore[assignment]
        else:
            db.add(MonthlyBudget(user_id=current_user.id, mes=mes, amount=payload.amount))
        db.commit()

    spent = _spent_for_month(current_user.id, mes, db)
    monthly_override = _get_monthly_override(current_user.id, mes, db)
    return _compute_status(current_user, spent, monthly_override)
