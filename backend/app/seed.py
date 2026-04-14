"""
Seed script — run once after init_db.
Creates admin user if not exists.
Usage: python -m app.seed
"""
import asyncio
from sqlalchemy import select
from app.core.database import async_session, init_db
from app.core.security import hash_password
from app.models.models import AdminUser


async def seed():
    await init_db()

    async with async_session() as session:
        # Check if admin already exists
        result = await session.execute(
            select(AdminUser).where(AdminUser.email == "carlos@celx.com")
        )
        existing = result.scalar_one_or_none()

        if not existing:
            admin = AdminUser(
                email="carlos@celx.com",
                password_hash=hash_password("@Wolfx2020"),
            )
            session.add(admin)
            await session.commit()
            print("Admin created: carlos@celx.com / AdminCelx@123")
        else:
            print("Admin already exists, skipping.")


if __name__ == "__main__":
    asyncio.run(seed())
