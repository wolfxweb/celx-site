from fastapi import APIRouter, HTTPException
from sqlalchemy import select
from app.core.database import async_session
from app.core.security import hash_password, verify_password, create_access_token
from app.models.models import AdminUser
from app.schemas.schemas import LoginRequest, TokenResponse

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest):
    async with async_session() as session:
        result = await session.execute(
            select(AdminUser).where(AdminUser.email == body.email)
        )
        user = result.scalar_one_or_none()
        if not user or not verify_password(body.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Email ou senha incorretos")
        token = create_access_token({"sub": user.email, "id": user.id})
        return TokenResponse(access_token=token)
