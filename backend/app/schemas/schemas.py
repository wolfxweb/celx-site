from pydantic import BaseModel, EmailStr
from typing import Any
from datetime import datetime


# ─── Auth ────────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ─── Page Content ─────────────────────────────────────────
class PageContentOut(BaseModel):
    id: int
    section: str
    content: dict
    updated_at: datetime | None

    class Config:
        from_attributes = True


class PageContentUpdate(BaseModel):
    content: dict  # Full JSON replacement


class HomePageOut(BaseModel):
    """All sections combined for GET /api/v1/pages/home"""
    hero: dict
    stats: dict
    sobre: dict
    especialidades: dict
    portfolio: dict
    artigos: dict
    servicos: dict
    contato: dict


# ─── Contact ──────────────────────────────────────────────
class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    message: str


class ContactOut(BaseModel):
    id: int
    name: str
    email: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Admin User ───────────────────────────────────────────
class AdminUserOut(BaseModel):
    id: int
    email: str
    created_at: datetime

    class Config:
        from_attributes = True
