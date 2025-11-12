from typing import List

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.habit import Habit
from app.services.ai_service import AIService
from sqlalchemy import select

router = APIRouter()


class MoodAnalysisRequest(BaseModel):
    notes: str


@router.get("/suggest-habits", summary="Get habit suggestions based on existing habits")
async def suggest_habits(db: AsyncSession = Depends(get_db)) -> dict[str, List[dict[str, str]]]:
    """Get AI-powered habit suggestions based on user's existing habits."""
    # Get all user habits
    result = await db.execute(select(Habit))
    user_habits = result.scalars().all()

    suggestions = await AIService.suggest_habits(db, list(user_habits))
    return {"suggestions": suggestions}


@router.post("/analyze-mood", summary="Analyze mood from notes")
async def analyze_mood(request: MoodAnalysisRequest) -> dict[str, dict[str, str | float | List[str]]]:
    """Analyze mood/sentiment from habit log notes."""
    analysis = AIService.analyze_mood_from_notes(request.notes)
    return {"analysis": analysis}


@router.get("/motivational-quote", summary="Get a random motivational quote")
async def get_motivational_quote() -> dict[str, dict[str, str]]:
    """Get a random motivational quote."""
    quote = AIService.get_motivational_quote()
    return {"quote": quote}
