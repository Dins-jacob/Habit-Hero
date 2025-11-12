from collections import defaultdict
from datetime import datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.habit_log import HabitLog


class AnalyticsService:
    @staticmethod
    async def get_best_days(db: AsyncSession, habit_id: int | None = None) -> dict[str, int]:
        """Get check-in counts by day of week."""
        query = select(HabitLog.log_date)

        if habit_id:
            query = query.where(HabitLog.habit_id == habit_id)

        try:
            result = await db.execute(query)
            logs = result.scalars().all()

            # Count by day of week (0=Monday, 6=Sunday in Python)
            day_counts = defaultdict(int)
            day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

            for log_date in logs:
                if log_date:
                    # Python weekday(): 0=Monday, 6=Sunday
                    day_num = log_date.weekday()
                    day_name = day_names[day_num]
                    day_counts[day_name] += 1

            return dict(day_counts)
        except Exception as e:
            print(f"Error in get_best_days: {e}")
            return {}

    @staticmethod
    async def get_checkins_by_date(
        db: AsyncSession, habit_id: int | None = None, days: int = 30
    ) -> dict[str, int]:
        """Get check-in counts by date for the last N days."""
        start_date = datetime.now() - timedelta(days=days)
        
        query = select(HabitLog.log_date).where(HabitLog.log_date >= start_date)

        if habit_id:
            query = query.where(HabitLog.habit_id == habit_id)

        try:
            result = await db.execute(query)
            logs = result.scalars().all()

            # Count by date
            date_counts = defaultdict(int)
            for log_date in logs:
                if log_date:
                    date_str = log_date.date().isoformat()
                    date_counts[date_str] += 1

            return dict(date_counts)
        except Exception as e:
            print(f"Error in get_checkins_by_date: {e}")
            return {}

    @staticmethod
    async def get_category_stats(db: AsyncSession) -> dict[str, dict[str, int]]:
        """Get statistics grouped by habit category."""
        from app.models.habit import Habit

        try:
            # Get all habits with their categories
            habits_query = select(Habit.id, Habit.category)
            habits_result = await db.execute(habits_query)
            habits = habits_result.all()

            # Get log counts per habit
            logs_query = select(
                HabitLog.habit_id,
                func.count(HabitLog.id).label("log_count")
            ).group_by(HabitLog.habit_id)
            logs_result = await db.execute(logs_query)
            log_counts = {row.habit_id: row.log_count for row in logs_result.all()}

            # Aggregate by category
            stats = defaultdict(lambda: {"total_logs": 0, "habit_count": 0})
            
            for habit in habits:
                category = habit.category
                stats[category]["habit_count"] += 1
                stats[category]["total_logs"] += log_counts.get(habit.id, 0)

            return dict(stats)
        except Exception as e:
            print(f"Error in get_category_stats: {e}")
            return {}

    @staticmethod
    async def get_overall_stats(db: AsyncSession) -> dict[str, int | float]:
        """Get overall statistics across all habits."""
        from app.models.habit import Habit

        try:
            # Total habits
            habits_result = await db.execute(select(func.count(Habit.id)))
            total_habits = habits_result.scalar() or 0

            # Total check-ins
            logs_result = await db.execute(select(func.count(HabitLog.id)))
            total_checkins = logs_result.scalar() or 0

            # Total check-ins this week
            week_start = datetime.now() - timedelta(days=datetime.now().weekday())
            week_logs_result = await db.execute(
                select(func.count(HabitLog.id)).where(HabitLog.log_date >= week_start)
            )
            week_checkins = week_logs_result.scalar() or 0

            return {
                "total_habits": total_habits,
                "total_checkins": total_checkins,
                "week_checkins": week_checkins,
            }
        except Exception as e:
            print(f"Error in get_overall_stats: {e}")
            return {
                "total_habits": 0,
                "total_checkins": 0,
                "week_checkins": 0,
            }
