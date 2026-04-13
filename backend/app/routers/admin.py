from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from app.core.database import async_session
from app.core.security import get_current_admin
from app.models.models import PageContent, ContactMessage, AdminUser
from app.schemas.schemas import PageContentUpdate, PageContentOut

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])


@router.get("/sections", response_model=list[PageContentOut])
async def list_sections(_=Depends(get_current_admin)):
    async with async_session() as session:
        result = await session.execute(select(PageContent).order_by(PageContent.id))
        return result.scalars().all()


@router.get("/sections/{section}", response_model=PageContentOut)
async def get_section(section: str, _=Depends(get_current_admin)):
    async with async_session() as session:
        result = await session.execute(
            select(PageContent).where(PageContent.section == section)
        )
        row = result.scalar_one_or_none()
        if not row:
            raise HTTPException(status_code=404, detail=f"Seção '{section}' não encontrada")
        return row


@router.put("/sections/{section}", response_model=PageContentOut)
async def upsert_section(section: str, body: PageContentUpdate, _=Depends(get_current_admin)):
    async with async_session() as session:
        result = await session.execute(
            select(PageContent).where(PageContent.section == section)
        )
        row = result.scalar_one_or_none()

        if row:
            row.content = body.content
        else:
            row = PageContent(section=section, content=body.content)
            session.add(row)

        await session.commit()
        await session.refresh(row)
        return row


@router.get("/contacts", response_model=list[ContactOut])
async def list_contacts(_=Depends(get_current_admin)):
    async with async_session() as session:
        result = await session.execute(
            select(ContactMessage).order_by(ContactMessage.created_at.desc())
        )
        return result.scalars().all()


@router.get("/me", response_model=dict)
async def get_me(_=Depends(get_current_admin)):
    return {"status": "ok", "message": "Authenticated"}
