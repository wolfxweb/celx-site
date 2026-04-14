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
    livro: dict
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


# ─── Blog Post ────────────────────────────────────────────
class BlogPostCreate(BaseModel):
    title: str
    slug: str
    excerpt: str | None = None
    content: str
    cover_url: str | None = None
    tags: list[str] | None = None
    published: bool = False


class BlogPostUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    excerpt: str | None = None
    content: str | None = None
    cover_url: str | None = None
    tags: list[str] | None = None
    published: bool | None = None


class BlogPostOut(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: str | None
    content: str
    cover_url: str | None
    tags: list[str] | None
    published: bool
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True


# ─── Admin User ───────────────────────────────────────────
class AdminUserOut(BaseModel):
    id: int
    email: str
    created_at: datetime

    class Config:
        from_attributes = True
