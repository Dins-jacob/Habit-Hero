from datetime import datetime

from pydantic import BaseModel, Field


class HabitLogBase(BaseModel):
    log_date: datetime = Field(default_factory=datetime.utcnow, description="Date and time of the log entry")
    notes: str | None = Field(default=None, max_length=2000, description="Optional notes for this check-in")


class HabitLogCreate(HabitLogBase):
    habit_id: int = Field(..., description="ID of the habit this log belongs to")


class HabitLogResponse(HabitLogBase):
    id: int
    habit_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class HabitLogUpdate(BaseModel):
    log_date: datetime | None = None
    notes: str | None = Field(default=None, max_length=2000)

