from datetime import date, datetime

from pydantic import BaseModel, Field

from app.schemas.categoria import CategoriaOut


class GastoCreate(BaseModel):
    amount: float = Field(gt=0)
    category_id: int
    description: str | None = Field(default=None, max_length=255)
    fecha: date | None = None


class GastoOut(BaseModel):
    id: int
    amount: float
    description: str | None
    fecha: date
    created_at: datetime
    categoria: CategoriaOut

    model_config = {"from_attributes": True}


class GastosListOut(BaseModel):
    items: list[GastoOut]
    total: int
    sum: float
