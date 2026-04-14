from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import get_settings
from app.core.database import init_db
from app.routers import auth, pages, contact, admin, blog

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="celx-site API",
    description="Backend CMS para site institucional Carlos Eduardo Lobo",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(pages.router)
app.include_router(contact.router)
app.include_router(admin.router)
app.include_router(blog.router)

# Static files for uploads
app.mount("/uploads", StaticFiles(directory="/root/celx-site/backend/uploads"), name="uploads")


@app.get("/health")
async def health():
    return {"status": "ok"}
