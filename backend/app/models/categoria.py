from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Categoria(Base):
    __tablename__ = "categorias"
    __table_args__ = (UniqueConstraint("user_id", "name", name="uq_categorias_user_name"),)

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True
    )
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    color: Mapped[str] = mapped_column(String(7), nullable=False, default="#6B7280")
    icon: Mapped[str] = mapped_column(String(50), nullable=False, default="tag")
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())

    user: Mapped["User | None"] = relationship("User", back_populates="categorias_custom")  # noqa: F821
    gastos: Mapped[list["Gasto"]] = relationship("Gasto", back_populates="categoria")  # noqa: F821

    @property
    def is_custom(self) -> bool:
        return self.user_id is not None
