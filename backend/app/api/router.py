from fastapi import APIRouter

from app.api.routes import ai, analytics, export, gamification, health, habit_logs, habits

api_router = APIRouter()
api_router.include_router(health.router, tags=["system"])
api_router.include_router(habits.router, prefix="/habits", tags=["habits"])
api_router.include_router(habit_logs.router, prefix="/habit-logs", tags=["habit-logs"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(gamification.router, prefix="/gamification", tags=["gamification"])
api_router.include_router(export.router, prefix="/export", tags=["export"])
