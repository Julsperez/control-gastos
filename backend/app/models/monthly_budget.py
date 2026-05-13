from sqlalchemy import ForeignKey, Numeric, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class MonthlyBudget(Base):
    __tablename__ = "monthly_budgets"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    mes: Mapped[str] = mapped_column(String(7), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)

    __table_args__ = (UniqueConstraint("user_id", "mes", name="uq_monthly_budget_user_mes"),)

    user: Mapped["User"] = relationship("User", back_populates="monthly_budgets")  # noqa: F821
