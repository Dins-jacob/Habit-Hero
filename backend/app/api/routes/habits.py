from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.habit import HabitCreate, HabitResponse, HabitUpdate
from app.services.habit_service import HabitService

router = APIRouter()


@router.post("/", response_model=HabitResponse, status_code=status.HTTP_201_CREATED, summary="Create a new habit")
async def create_habit(habit_in: HabitCreate, db: AsyncSession = Depends(get_db)) -> HabitResponse:
    """Create a new habit."""
    habit = await HabitService.create(db, habit_in)
    return HabitResponse.model_validate(habit)


@router.get("/", response_model=List[HabitResponse], summary="Get all habits")
async def get_habits(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
) -> List[HabitResponse]:
    """Get all habits with pagination."""
    habits = await HabitService.get_all(db, skip=skip, limit=limit)
    return [HabitResponse.model_validate(habit) for habit in habits]


@router.get("/{habit_id}", response_model=HabitResponse, summary="Get a habit by ID")
async def get_habit(habit_id: int, db: AsyncSession = Depends(get_db)) -> HabitResponse:
    """Get a specific habit by ID."""
    habit = await HabitService.get_by_id(db, habit_id)
    if not habit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")
    return HabitResponse.model_validate(habit)


@router.put("/{habit_id}", response_model=HabitResponse, summary="Update a habit")
async def update_habit(
    habit_id: int,
    habit_in: HabitUpdate,
    db: AsyncSession = Depends(get_db),
) -> HabitResponse:
    """Update a habit."""
    habit = await HabitService.update(db, habit_id, habit_in)
    if not habit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")
    return HabitResponse.model_validate(habit)


@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a habit")
async def delete_habit(habit_id: int, db: AsyncSession = Depends(get_db)) -> None:
    """Delete a habit."""
    success = await HabitService.delete(db, habit_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")

