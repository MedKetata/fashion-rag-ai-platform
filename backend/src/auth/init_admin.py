from sqlalchemy.orm import Session

from src.database import SessionLocal
from src.auth.models import User, UserRole
from src.auth.security import hash_password
from src.core.config import (
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    ADMIN_FIRST_NAME,
    ADMIN_LAST_NAME
)


def create_admin_if_not_exists():

    db: Session = SessionLocal()

    admin = db.query(User).filter(User.role == UserRole.ADMIN).first()

    if admin:
        db.close()
        return

    admin_user = User(
        first_name=ADMIN_FIRST_NAME,
        last_name=ADMIN_LAST_NAME,
        email=ADMIN_EMAIL,
        password_hash=hash_password(ADMIN_PASSWORD),
        role=UserRole.ADMIN
    )

    db.add(admin_user)
    db.commit()

    db.close()

    print(" Default admin created")