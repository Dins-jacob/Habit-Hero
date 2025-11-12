from datetime import date, datetime, timedelta
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.habit import Habit, HabitFrequency
from app.models.habit_log import HabitLog
from app.schemas.habit_log import HabitLogCreate, HabitLogUpdate


class HabitLogService:
    @staticmethod
    async def create(db: AsyncSession, log_in: HabitLogCreate) -> HabitLog:
        """Create a new habit log entry."""
        log = HabitLog(
            habit_id=log_in.habit_id,
            log_date=log_in.log_date,
            notes=log_in.notes,
        )
        db.add(log)
        await db.commit()
        await db.refresh(log)
        return log

    @staticmethod
    async def get_by_id(db: AsyncSession, log_id: int) -> HabitLog | None:
        """Get a habit log by ID."""
        result = await db.execute(select(HabitLog).where(HabitLog.id == log_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_habit_id(
        db: AsyncSession, habit_id: int, skip: int = 0, limit: int = 100
    ) -> Sequence[HabitLog]:
        """Get all logs for a specific habit."""
        result = await db.execute(
            select(HabitLog)
            .where(HabitLog.habit_id == habit_id)
            .order_by(HabitLog.log_date.desc())
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    @staticmethod
    async def update(db: AsyncSession, log_id: int, log_in: HabitLogUpdate) -> HabitLog | None:
        """Update a habit log."""
        log = await HabitLogService.get_by_id(db, log_id)
        if not log:
            return None

        update_data = log_in.model_dump(exclude_unset=True)
        if update_data:
            for key, value in update_data.items():
                setattr(log, key, value)
            await db.commit()
            await db.refresh(log)

        return log

    @staticmethod
    async def delete(db: AsyncSession, log_id: int) -> bool:
        """Delete a habit log."""
        log = await HabitLogService.get_by_id(db, log_id)
        if not log:
            return False

        await db.delete(log)
        await db.commit()
        return True

    @staticmethod
    async def get_streak(db: AsyncSession, habit_id: int) -> int:
        """Calculate the current streak for a habit."""
        # Get the habit to check its frequency
        habit_result = await db.execute(select(Habit).where(Habit.id == habit_id))
        habit = habit_result.scalar_one_or_none()
        if not habit:
            return 0

        # Get all logs for this habit, ordered by date descending
        logs_result = await db.execute(
            select(HabitLog)
            .where(HabitLog.habit_id == habit_id)
            .order_by(HabitLog.log_date.desc())
        )
        logs = logs_result.scalars().all()

        if not logs:
            return 0

        # Convert log dates to date objects (without time)
        log_dates = {log.log_date.date() for log in logs}

        # Calculate streak
        streak = 0
        current_date = date.today()

        if habit.frequency == HabitFrequency.DAILY:
            # For daily habits, check consecutive days
            while current_date >= habit.start_date:
                if current_date in log_dates:
                    streak += 1
                    current_date -= timedelta(days=1)
                else:
                    break
        else:
            # For weekly habits, check consecutive weeks
            while current_date >= habit.start_date:
                # Get the start of the week (Monday)
                week_start = current_date - timedelta(days=current_date.weekday())
                # Check if there's any log in this week
                week_logs = [d for d in log_dates if week_start <= d < week_start + timedelta(days=7)]
                if week_logs:
                    streak += 1
                    current_date = week_start - timedelta(days=1)
                else:
                    break

        return streak

    @staticmethod
    async def get_success_rate(db: AsyncSession, habit_id: int) -> float:
        """Calculate success rate (percentage of expected check-ins completed)."""
        habit_result = await db.execute(select(Habit).where(Habit.id == habit_id))
        habit = habit_result.scalar_one_or_none()
        if not habit:
            return 0.0

        start_date = habit.start_date
        end_date = date.today()

        # Calculate expected check-ins
        if habit.frequency == HabitFrequency.DAILY:
            expected = (end_date - start_date).days + 1
        else:
            # Weekly: count number of weeks
            weeks = ((end_date - start_date).days // 7) + 1
            expected = weeks

        if expected == 0:
            return 0.0

        # Get actual check-ins
        logs_result = await db.execute(
            select(HabitLog).where(
                HabitLog.habit_id == habit_id,
                HabitLog.log_date >= datetime.combine(start_date, datetime.min.time()),
            )
        )
        actual = len(logs_result.scalars().all())

        return round((actual / expected) * 100, 2) if expected > 0 else 0.0

