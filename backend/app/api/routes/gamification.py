from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.services.gamification_service import GamificationService

router = APIRouter()


@router.get("/stats", summary="Get user gamification stats")
async def get_stats(db: AsyncSession = Depends(get_db)) -> dict:
    """Get user XP, level, and badges."""
    stats = await GamificationService.get_user_stats(db)
    
    # Get all earned badges
    badges = await GamificationService.get_all_badges(db)
    
    return {
        "total_xp": stats.total_xp,
        "level": stats.level,
        "xp_to_next_level": 100 - (stats.total_xp % 100),
        "badges": badges,
        "badge_count": len(badges),
    }


@router.post("/check-badges", summary="Check and award new badges")
async def check_badges(db: AsyncSession = Depends(get_db)) -> dict[str, List[dict[str, str | int]] | str]:
    """Check for new badges and award them."""
    try:
        new_badges = await GamificationService.check_badges(db)
        return {
            "new_badges": new_badges,
            "message": f"Awarded {len(new_badges)} new badge(s)!" if new_badges else "No new badges"
        }
    except Exception as e:
        import traceback
        error_msg = str(e)
        print(f"Error in check_badges endpoint: {error_msg}")
        print(traceback.format_exc())
        # Return error but don't crash
        return {
            "new_badges": [],
            "message": f"Error checking badges: {error_msg}"
        }

