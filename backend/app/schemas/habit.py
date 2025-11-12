from datetime import date, datetime

from pydantic import BaseModel, Field

from app.models.habit import HabitCategory, HabitFrequency


class HabitBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200, description="Habit name")
    frequency: HabitFrequency = Field(default=HabitFrequency.DAILY, description="Habit frequency")
    category: HabitCategory = Field(default=HabitCategory.HEALTH, description="Habit category")
    start_date: date = Field(default_factory=date.today, description="Start date for the habit")
    description: str | None = Field(default=None, max_length=1000, description="Optional description")


class HabitCreate(HabitBase):
    pass


class HabitUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    frequency: HabitFrequency | None = None
    category: HabitCategory | None = None
    start_date: date | None = None
    description: str | None = Field(default=None, max_length=1000)


class HabitResponse(HabitBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

