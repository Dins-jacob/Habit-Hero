from datetime import date, datetime
from typing import Sequence

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.habit import Habit
from app.schemas.habit import HabitCreate, HabitUpdate


class HabitService:
    @staticmethod
    async def create(db: AsyncSession, habit_in: HabitCreate) -> Habit:
        """Create a new habit."""
        habit = Habit(
            name=habit_in.name,
            frequency=habit_in.frequency,
            category=habit_in.category,
            start_date=habit_in.start_date,
            description=habit_in.description,
        )
        db.add(habit)
        await db.commit()
        await db.refresh(habit)
        return habit

    @staticmethod
    async def get_by_id(db: AsyncSession, habit_id: int) -> Habit | None:
        """Get a habit by ID."""
        result = await db.execute(select(Habit).where(Habit.id == habit_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_all(db: AsyncSession, skip: int = 0, limit: int = 100) -> Sequence[Habit]:
        """Get all habits with pagination."""
        result = await db.execute(select(Habit).offset(skip).limit(limit).order_by(Habit.created_at.desc()))
        return result.scalars().all()

    @staticmethod
    async def update(db: AsyncSession, habit_id: int, habit_in: HabitUpdate) -> Habit | None:
        """Update a habit."""
        habit = await HabitService.get_by_id(db, habit_id)
        if not habit:
            return None

        update_data = habit_in.model_dump(exclude_unset=True)
        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            await db.execute(update(Habit).where(Habit.id == habit_id).values(**update_data))
            await db.commit()
            await db.refresh(habit)

        return habit

    @staticmethod
    async def delete(db: AsyncSession, habit_id: int) -> bool:
        """Delete a habit."""
        habit = await HabitService.get_by_id(db, habit_id)
        if not habit:
            return False

        await db.delete(habit)
        await db.commit()
        return True

