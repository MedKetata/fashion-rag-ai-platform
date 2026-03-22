from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.auth.schemas import UserResponse
from fastapi import Response, status
from src.auth.dependencies import require_admin
from src.core.config import JWT_EXPIRE_MINUTES

from src.database import get_db

from src.auth.schemas import (
    UserRegister,
    UserLogin,
    UserResponse
)

from src.auth.auth_service import (
    register_user,
    login_user
)


router = APIRouter(prefix="/auth", tags=["Authentication"])


# =========================
# REGISTER
# =========================

@router.post("/register", response_model=UserResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):

    user = register_user(user_data, db)

    return user


# =========================
# LOGIN
# =========================

@router.post("/login")
def login(credentials: UserLogin, response: Response, db: Session = Depends(get_db)):
    token = login_user(credentials.email, credentials.password, db)

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,      # True en production HTTPS
        samesite="lax",
        path="/",
        max_age=JWT_EXPIRE_MINUTES * 60
    )

    return {
        "message": "Login successful"
    }


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        path="/"
    )
    return {"message": "Logged out"}


# =========================
# CURRENT USER
# =========================

@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/check-admin")
def check_admin(user = Depends(require_admin)):
    return Response(status_code=status.HTTP_200_OK)