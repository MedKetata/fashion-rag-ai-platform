from sqlalchemy import Column, Integer, String, DateTime, Enum
from datetime import datetime, timezone
import enum

from src.database import Base


class UserRole(str, enum.Enum):
    USER = "USER"
    ADMIN = "ADMIN"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    first_name = Column(String(100), nullable=False)

    last_name = Column(String(100), nullable=False)

    email = Column(String(255), unique=True, index=True, nullable=False)

    password_hash = Column(String(255), nullable=False)

    role = Column(Enum(UserRole), default=UserRole.USER)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))