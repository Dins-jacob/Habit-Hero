from fastapi import FastAPI

from app.api.router import api_router
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
)


@app.get("/", summary="API root")
def read_root() -> dict[str, str]:
    return {"message": "Habit Hero API"}


app.include_router(api_router, prefix="/api")
