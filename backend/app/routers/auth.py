import secrets
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth.hashing import hash_password, verify_password
from app.auth.jwt import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    hash_jti,
)
from app.config import settings
from app.dependencies import get_db
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.schemas.auth import (
    AuthResponse,
    ForgotPasswordRequest,
    LoginRequest,
    RefreshRequest,
    RegisterRequest,
    ResetPasswordRequest,
    TokensOut,
    UserOut,
)
from app.services.email import send_reset_email

router = APIRouter(prefix="/auth", tags=["auth"])


def _build_auth_response(user: User, db: Session) -> AuthResponse:
    access_token = create_access_token(user.id, user.email)
    refresh_token, jti, expires_at = create_refresh_token(user.id)

    rt = RefreshToken(
        user_id=user.id,
        token_hash=hash_jti(jti),
        expires_at=expires_at,
    )
    db.add(rt)
    db.commit()

    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserOut.model_validate(user),
    )


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        full_name=data.full_name,
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email ya registrado")
    db.refresh(user)

    return _build_auth_response(user, db)


@router.post("/login", response_model=AuthResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales incorrectas")

    return _build_auth_response(user, db)


_GENERIC_RESET_MSG = {"message": "Si el correo está registrado, recibirás un enlace en los próximos minutos."}


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if user:
        raw_token = secrets.token_urlsafe(32)
        user.reset_token = hash_jti(raw_token)
        user.reset_token_expires = datetime.utcnow() + timedelta(hours=settings.RESET_TOKEN_EXPIRE_HOURS)
        db.commit()
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={raw_token}"
        send_reset_email(user.email, reset_url)
    return _GENERIC_RESET_MSG


@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    token_hash = hash_jti(data.token)
    user = (
        db.query(User)
        .filter(User.reset_token == token_hash, User.reset_token_expires > datetime.utcnow())
        .first()
    )
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El enlace expiró o ya fue utilizado.")

    user.password_hash = hash_password(data.new_password)
    user.reset_token = None
    user.reset_token_expires = None

    db.query(RefreshToken).filter(
        RefreshToken.user_id == user.id, RefreshToken.revoked == False  # noqa: E712
    ).update({"revoked": True})

    db.commit()
    return {"message": "Contraseña restablecida correctamente."}


@router.post("/refresh", response_model=TokensOut)
def refresh(data: RefreshRequest, db: Session = Depends(get_db)):
    payload = decode_refresh_token(data.refresh_token)

    jti = payload.get("jti")
    if not jti:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token inválido")

    token_hash = hash_jti(jti)
    user_id = int(payload["sub"])

    rt = db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash).first()
    # Comparación UTC naive — consistente con _utcnow() en jwt.py
    if not rt or rt.revoked or rt.expires_at < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token inválido o revocado")

    # Rotación: revocar el token anterior
    rt.revoked = True
    db.commit()

    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no encontrado")

    new_access = create_access_token(user.id, user.email)
    new_refresh, new_jti, new_expires = create_refresh_token(user.id)

    new_rt = RefreshToken(
        user_id=user.id,
        token_hash=hash_jti(new_jti),
        expires_at=new_expires,
    )
    db.add(new_rt)
    db.commit()

    return TokensOut(access_token=new_access, refresh_token=new_refresh)
