import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy import select, func
from app.core.database import async_session
from app.core.security import get_current_admin
from app.models.models import BlogPost
from app.schemas.schemas import BlogPostCreate, BlogPostUpdate, BlogPostOut

router = APIRouter(prefix="/api/v1/blog", tags=["blog"])

UPLOAD_DIR = "/root/celx-site/backend/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ─── Public ────────────────────────────────────────────────

@router.get("/posts", response_model=list[BlogPostOut])
async def list_published_posts():
    """List all published blog posts (public)."""
    async with async_session() as session:
        result = await session.execute(
            select(BlogPost)
            .where(BlogPost.published == True)
            .order_by(BlogPost.created_at.desc())
        )
        return result.scalars().all()


@router.get("/posts/{slug}", response_model=BlogPostOut)
async def get_post_by_slug(slug: str):
    """Get a single published blog post by slug (public)."""
    async with async_session() as session:
        result = await session.execute(
            select(BlogPost).where(
                BlogPost.slug == slug,
                BlogPost.published == True
            )
        )
        post = result.scalar_one_or_none()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        return post


# ─── Admin CRUD ────────────────────────────────────────────

@router.get("/admin/posts", response_model=list[BlogPostOut])
async def admin_list_posts(_=Depends(get_current_admin)):
    """List all blog posts (admin only)."""
    async with async_session() as session:
        result = await session.execute(
            select(BlogPost).order_by(BlogPost.created_at.desc())
        )
        return result.scalars().all()


@router.post("/admin/posts", response_model=BlogPostOut, status_code=201)
async def create_post(body: BlogPostCreate, _=Depends(get_current_admin)):
    """Create a new blog post (admin only)."""
    async with async_session() as session:
        # Check slug uniqueness
        existing = await session.execute(
            select(BlogPost).where(BlogPost.slug == body.slug)
        )
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=409, detail="Slug already exists")

        post = BlogPost(**body.model_dump())
        session.add(post)
        await session.commit()
        await session.refresh(post)
        return post


@router.get("/admin/posts/{post_id}", response_model=BlogPostOut)
async def admin_get_post(post_id: int, _=Depends(get_current_admin)):
    """Get a single blog post by ID (admin only)."""
    async with async_session() as session:
        result = await session.execute(
            select(BlogPost).where(BlogPost.id == post_id)
        )
        post = result.scalar_one_or_none()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        return post


@router.put("/admin/posts/{post_id}", response_model=BlogPostOut)
async def update_post(post_id: int, body: BlogPostUpdate, _=Depends(get_current_admin)):
    """Update a blog post (admin only)."""
    async with async_session() as session:
        result = await session.execute(
            select(BlogPost).where(BlogPost.id == post_id)
        )
        post = result.scalar_one_or_none()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        # Check slug uniqueness if slug is being changed
        if body.slug and body.slug != post.slug:
            existing = await session.execute(
                select(BlogPost).where(BlogPost.slug == body.slug)
            )
            if existing.scalar_one_or_none():
                raise HTTPException(status_code=409, detail="Slug already exists")

        update_data = body.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(post, field, value)

        await session.commit()
        await session.refresh(post)
        return post


@router.delete("/admin/posts/{post_id}", status_code=204)
async def delete_post(post_id: int, _=Depends(get_current_admin)):
    """Delete a blog post (admin only)."""
    async with async_session() as session:
        result = await session.execute(
            select(BlogPost).where(BlogPost.id == post_id)
        )
        post = result.scalar_one_or_none()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        await session.delete(post)
        await session.commit()


# ─── Upload ────────────────────────────────────────────────

@router.post("/admin/upload")
async def upload_file(
    file: UploadFile = File(...),
    _=Depends(get_current_admin)
):
    """Upload a file (admin only). Returns the file URL."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    ext = os.path.splitext(file.filename)[1].lower()
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    import aiofiles
    async with aiofiles.open(filepath, "wb") as f:
        content = await file.read()
        await f.write(content)

    return {"url": f"/uploads/{filename}"}
