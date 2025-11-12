from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.services.analytics_service import AnalyticsService

router = APIRouter()


@router.get("/best-days", summary="Get best days for check-ins")
async def get_best_days(
    habit_id: int | None = Query(None, description="Filter by specific habit ID"),
    db: AsyncSession = Depends(get_db),
) -> dict[str, dict[str, int]]:
    """Get check-in counts by day of week."""
    best_days = await AnalyticsService.get_best_days(db, habit_id)
    return {"best_days": best_days}


@router.get("/checkins-by-date", summary="Get check-ins by date")
async def get_checkins_by_date(
    habit_id: int | None = Query(None, description="Filter by specific habit ID"),
    days: int = Query(30, ge=1, le=365, description="Number of days to look back"),
    db: AsyncSession = Depends(get_db),
) -> dict[str, dict[str, int]]:
    """Get check-in counts by date for the last N days."""
    checkins = await AnalyticsService.get_checkins_by_date(db, habit_id, days)
    return {"checkins_by_date": checkins}


@router.get("/category-stats", summary="Get statistics by category")
async def get_category_stats(db: AsyncSession = Depends(get_db)) -> dict[str, dict[str, dict[str, int]]]:
    """Get statistics grouped by habit category."""
    stats = await AnalyticsService.get_category_stats(db)
    return {"category_stats": stats}


@router.get("/overall", summary="Get overall statistics")
async def get_overall_stats(db: AsyncSession = Depends(get_db)) -> dict[str, dict[str, int | float]]:
    """Get overall statistics across all habits."""
    stats = await AnalyticsService.get_overall_stats(db)
    return {"overall_stats": stats}

