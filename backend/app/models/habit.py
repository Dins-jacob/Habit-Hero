from datetime import date, datetime
from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import Column, Date, DateTime, Enum as SQLEnum, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

if TYPE_CHECKING:
    from app.models.habit_log import HabitLog

Base = declarative_base()


class HabitFrequency(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"


class HabitCategory(str, Enum):
    HEALTH = "health"
    WORK = "work"
    LEARNING = "learning"
    FITNESS = "fitness"
    MENTAL_HEALTH = "mental_health"
    PRODUCTIVITY = "productivity"


class Habit(Base):
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    frequency = Column(SQLEnum(HabitFrequency), nullable=False, default=HabitFrequency.DAILY)
    category = Column(SQLEnum(HabitCategory), nullable=False, default=HabitCategory.HEALTH)
    start_date = Column(Date, nullable=False, default=date.today)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    logs = relationship("HabitLog", back_populates="habit", cascade="all, delete-orphan")

