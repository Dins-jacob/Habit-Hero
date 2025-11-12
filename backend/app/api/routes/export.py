from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.habit import Habit
from app.models.habit_log import HabitLog
from app.services.analytics_service import AnalyticsService
from app.services.gamification_service import GamificationService
from sqlalchemy import select, func

router = APIRouter()


@router.get("/pdf", summary="Export progress report as PDF")
async def export_pdf(db: AsyncSession = Depends(get_db)) -> Response:
    """Generate and download a PDF progress report."""
    try:
        # Get all habits
        habits_result = await db.execute(select(Habit))
        habits = habits_result.scalars().all()

        # Get overall stats
        overall_stats = await AnalyticsService.get_overall_stats(db)
        gamification_stats = await GamificationService.get_user_stats(db)
        badges = await GamificationService.get_all_badges(db)

        # Generate simple HTML report (we'll convert to PDF on frontend)
        # For now, return JSON data that frontend can use to generate PDF
        from app.services.habit_log_service import HabitLogService
        
        habits_data = []
        for habit in habits:
            streak = await HabitLogService.get_streak(db, habit.id)
            success_rate = await HabitLogService.get_success_rate(db, habit.id)
            logs_result = await db.execute(
                select(HabitLog).where(HabitLog.habit_id == habit.id).order_by(HabitLog.log_date.desc()).limit(10)
            )
            recent_logs = logs_result.scalars().all()
            
            from datetime import date
            start_date_str = habit.start_date.isoformat() if isinstance(habit.start_date, date) else str(habit.start_date)
            
            habits_data.append({
                "id": habit.id,
                "name": habit.name,
                "category": habit.category,
                "frequency": habit.frequency,
                "start_date": start_date_str,
                "streak": streak,
                "success_rate": success_rate,
                "recent_checkins": len(recent_logs),
            })

        report_data = {
            "generated_at": datetime.now().isoformat(),
            "overall_stats": overall_stats,
            "gamification": {
                "total_xp": gamification_stats.total_xp,
                "level": gamification_stats.level,
                "badges": badges,
            },
            "habits": habits_data,
        }

        # Return as JSON (frontend will convert to PDF using jsPDF or similar)
        from fastapi.responses import JSONResponse
        return JSONResponse(content=report_data)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {str(e)}")

