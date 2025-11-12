from fastapi import APIRouter

from app.api.routes import health, habit_logs, habits

api_router = APIRouter()
api_router.include_router(health.router, tags=["system"])
api_router.include_router(habits.router, prefix="/habits", tags=["habits"])
api_router.include_router(habit_logs.router, prefix="/habit-logs", tags=["habit-logs"])
