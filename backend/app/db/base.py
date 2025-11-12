from app.models import Base


async def init_db():
    """Initialize database tables."""
    from app.db.session import _engine

    async with _engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

