from datetime import datetime

from sqlalchemy import DateTime, Integer, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str | None] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )

    monthly_budget: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    alert_threshold_warning: Mapped[int] = mapped_column(Integer, nullable=False, default=70)
    alert_threshold_critical: Mapped[int] = mapped_column(Integer, nullable=False, default=90)

    gastos: Mapped[list["Gasto"]] = relationship("Gasto", back_populates="user", cascade="all, delete-orphan")  # noqa: F821
    refresh_tokens: Mapped[list["RefreshToken"]] = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")  # noqa: F821
    categorias_custom: Mapped[list["Categoria"]] = relationship("Categoria", back_populates="user", cascade="all, delete-orphan")  # noqa: F821
