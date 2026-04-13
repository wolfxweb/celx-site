from fastapi import APIRouter
from sqlalchemy import select
from app.core.database import async_session
from app.models.models import ContactMessage
from app.schemas.schemas import ContactCreate, ContactOut
from app.services.telegram import send_telegram_message, format_contact_message

router = APIRouter(prefix="/api/v1/contact", tags=["contact"])


@router.post("", response_model=ContactOut)
async def submit_contact(body: ContactCreate):
    async with async_session() as session:
        msg = ContactMessage(
            name=body.name,
            email=body.email,
            message=body.message,
        )
        session.add(msg)
        await session.commit()
        await session.refresh(msg)

        # Send Telegram notification
        telegram_text = format_contact_message(body.name, body.email, body.message)
        notified = await send_telegram_message(telegram_text)

        if notified:
            msg.notified_telegram = True
            await session.commit()

        return msg


@router.get("", response_model=list[ContactOut])
async def list_contacts():
    async with async_session() as session:
        result = await session.execute(
            select(ContactMessage).order_by(ContactMessage.created_at.desc())
        )
        return result.scalars().all()
