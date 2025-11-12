from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String

from app.models.habit import Base


class UserStats(Base):
    __tablename__ = "user_stats"

    id = Column(Integer, primary_key=True, index=True)
    total_xp = Column(Integer, nullable=False, default=0)
    level = Column(Integer, nullable=False, default=1)
    badges_earned = Column(String, nullable=True)  # JSON string of badge IDs
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
