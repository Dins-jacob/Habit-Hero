from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.habit_log import HabitLogCreate, HabitLogResponse, HabitLogUpdate
from app.services.habit_log_service import HabitLogService

router = APIRouter()


@router.post("/", response_model=HabitLogResponse, status_code=status.HTTP_201_CREATED, summary="Create a new habit log")
async def create_habit_log(
    log_in: HabitLogCreate, db: AsyncSession = Depends(get_db)
) -> HabitLogResponse:
    """Create a new habit log entry (check-in)."""
    log = await HabitLogService.create(db, log_in)
    return HabitLogResponse.model_validate(log)


@router.get("/habit/{habit_id}", response_model=List[HabitLogResponse], summary="Get all logs for a habit")
async def get_habit_logs(
    habit_id: int,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
) -> List[HabitLogResponse]:
    """Get all log entries for a specific habit."""
    logs = await HabitLogService.get_by_habit_id(db, habit_id, skip=skip, limit=limit)
    return [HabitLogResponse.model_validate(log) for log in logs]


@router.get("/{log_id}", response_model=HabitLogResponse, summary="Get a habit log by ID")
async def get_habit_log(log_id: int, db: AsyncSession = Depends(get_db)) -> HabitLogResponse:
    """Get a specific habit log by ID."""
    log = await HabitLogService.get_by_id(db, log_id)
    if not log:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit log not found")
    return HabitLogResponse.model_validate(log)


@router.put("/{log_id}", response_model=HabitLogResponse, summary="Update a habit log")
async def update_habit_log(
    log_id: int,
    log_in: HabitLogUpdate,
    db: AsyncSession = Depends(get_db),
) -> HabitLogResponse:
    """Update a habit log entry."""
    log = await HabitLogService.update(db, log_id, log_in)
    if not log:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit log not found")
    return HabitLogResponse.model_validate(log)


@router.delete("/{log_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a habit log")
async def delete_habit_log(log_id: int, db: AsyncSession = Depends(get_db)) -> None:
    """Delete a habit log entry."""
    success = await HabitLogService.delete(db, log_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit log not found")


@router.get("/habit/{habit_id}/streak", summary="Get current streak for a habit")
async def get_habit_streak(habit_id: int, db: AsyncSession = Depends(get_db)) -> dict[str, int]:
    """Get the current streak count for a habit."""
    streak = await HabitLogService.get_streak(db, habit_id)
    return {"habit_id": habit_id, "streak": streak}


@router.get("/habit/{habit_id}/success-rate", summary="Get success rate for a habit")
async def get_habit_success_rate(
    habit_id: int, db: AsyncSession = Depends(get_db)
) -> dict[str, int | float]:
    """Get the success rate (percentage) for a habit."""
    success_rate = await HabitLogService.get_success_rate(db, habit_id)
    return {"habit_id": habit_id, "success_rate": success_rate}

