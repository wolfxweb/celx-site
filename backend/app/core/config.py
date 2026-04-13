from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres123@postgres:5432/celx_site"

    # JWT
    jwt_secret: str = "CHANGE_ME_IN_PROD"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24  # 24 hours

    # Telegram
    telegram_bot_token: str = "8312031269:AAFto1ZfqRbj3e4mWYEBsV4KgaJ7GLGgVJ8"
    telegram_chat_id: str = "1229273513"

    # CORS
    cors_origin: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        extra = "allow"


@lru_cache
def get_settings() -> Settings:
    return Settings()
