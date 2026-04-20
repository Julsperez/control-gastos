from pydantic import BaseModel


class TotalPorCategoria(BaseModel):
    categoria_id: int
    categoria_name: str
    categoria_color: str
    total: float
    porcentaje: float
    cantidad_gastos: int


class GastoDiario(BaseModel):
    fecha: str  # 'YYYY-MM-DD'
    total: float


class TopCategoria(BaseModel):
    name: str
    value: float
    color: str


class DashboardResumenOut(BaseModel):
    mes: str
    total_mes: float
    total_mes_anterior: float | None
    variacion_porcentual: float | None
    total_por_categoria: list[TotalPorCategoria]
    gasto_diario: list[GastoDiario]
    top_categorias: list[TopCategoria]
