from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import get_settings


_settings = get_settings()
_engine = create_async_engine(_settings.database_url, echo=_settings.debug)
SessionLocal = async_sessionmaker(bind=_engine, expire_on_commit=False)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session
