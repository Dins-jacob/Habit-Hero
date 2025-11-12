from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from app.api.router import api_router
from app.core.config import get_settings
from app.db.base import init_db

settings = get_settings()


class HTTPSRedirectMiddleware(BaseHTTPMiddleware):
    """Middleware to ensure redirects use HTTPS."""
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        # Fix Location header in redirects to use HTTPS
        if response.status_code in (301, 302, 303, 307, 308):
            location = response.headers.get("location")
            if location and location.startswith("http://"):
                response.headers["location"] = location.replace("http://", "https://", 1)
        return response


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    await init_db()
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
    lifespan=lifespan,
)

# Add HTTPS redirect fix middleware (before CORS)
app.add_middleware(HTTPSRedirectMiddleware)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://habit-hero-nine.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", summary="API root")
def read_root() -> dict[str, str]:
    return {"message": "Habit Hero API"}


app.include_router(api_router, prefix="/api")
