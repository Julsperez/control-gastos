from pydantic import BaseModel, Field


class CategoriaCreate(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    color: str | None = None
    icon: str | None = None


class CategoriaOut(BaseModel):
    id: int
    name: str
    color: str
    icon: str
    is_custom: bool

    model_config = {"from_attributes": True}


class CategoriasListOut(BaseModel):
    items: list[CategoriaOut]
