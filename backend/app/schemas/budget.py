from typing import Literal

from pydantic import BaseModel, field_validator, model_validator


class BudgetUpdate(BaseModel):
    monthly_budget: float | None = None
    alert_threshold_warning: int = 70
    alert_threshold_critical: int = 90

    @field_validator("monthly_budget")
    @classmethod
    def budget_positive(cls, v: float | None) -> float | None:
        if v is not None and v <= 0:
            raise ValueError("El presupuesto debe ser un valor positivo")
        return v

    @field_validator("alert_threshold_warning")
    @classmethod
    def warning_valid(cls, v: int) -> int:
        if not (1 <= v <= 99):
            raise ValueError("alert_threshold_warning debe estar entre 1 y 99")
        return v

    @field_validator("alert_threshold_critical")
    @classmethod
    def critical_range(cls, v: int) -> int:
        if not (2 <= v <= 100):
            raise ValueError("alert_threshold_critical debe estar entre 2 y 100")
        return v

    @model_validator(mode="after")
    def critical_gt_warning(self) -> "BudgetUpdate":
        if self.alert_threshold_critical <= self.alert_threshold_warning:
            raise ValueError("alert_threshold_critical debe ser mayor que alert_threshold_warning")
        return self


class BudgetStatus(BaseModel):
    budget: float | None
    spent: float
    remaining: float | None
    percentage_used: float | None
    alert_level: Literal["none", "warning", "critical", "exceeded"]
    alert_threshold_warning: int
    alert_threshold_critical: int
