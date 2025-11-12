from datetime import datetime, timedelta
from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.habit import Habit
from app.models.habit_log import HabitLog
from app.models.gamification import UserStats


class BadgeType:
    FIRST_HABIT = "first_habit"
    STREAK_7 = "streak_7"
    STREAK_30 = "streak_30"
    STREAK_100 = "streak_100"
    CHECKIN_10 = "checkin_10"
    CHECKIN_50 = "checkin_50"
    CHECKIN_100 = "checkin_100"
    PERFECT_WEEK = "perfect_week"
    CATEGORY_MASTER = "category_master"


BADGE_DEFINITIONS = {
    BadgeType.FIRST_HABIT: {"name": "Getting Started", "description": "Created your first habit", "xp": 10},
    BadgeType.STREAK_7: {"name": "Week Warrior", "description": "7-day streak", "xp": 25},
    BadgeType.STREAK_30: {"name": "Monthly Champion", "description": "30-day streak", "xp": 50},
    BadgeType.STREAK_100: {"name": "Century Streak", "description": "100-day streak", "xp": 100},
    BadgeType.CHECKIN_10: {"name": "Consistent", "description": "10 check-ins", "xp": 15},
    BadgeType.CHECKIN_50: {"name": "Dedicated", "description": "50 check-ins", "xp": 40},
    BadgeType.CHECKIN_100: {"name": "Habit Master", "description": "100 check-ins", "xp": 75},
    BadgeType.PERFECT_WEEK: {"name": "Perfect Week", "description": "7 check-ins in 7 days", "xp": 30},
    BadgeType.CATEGORY_MASTER: {"name": "Category Master", "description": "Habits in all categories", "xp": 60},
}


class GamificationService:
    @staticmethod
    async def calculate_xp_for_checkin() -> int:
        """Calculate XP earned for a single check-in."""
        return 5

    @staticmethod
    async def calculate_xp_for_streak(streak_days: int) -> int:
        """Calculate bonus XP for maintaining a streak."""
        if streak_days >= 100:
            return 20
        elif streak_days >= 30:
            return 10
        elif streak_days >= 7:
            return 5
        return 0

    @staticmethod
    async def get_user_stats(db: AsyncSession) -> UserStats:
        """Get or create user stats."""
        try:
            result = await db.execute(select(UserStats).limit(1))
            stats = result.scalar_one_or_none()

            if not stats:
                stats = UserStats(total_xp=0, level=1, badges_earned=None)
                db.add(stats)
                await db.commit()
                await db.refresh(stats)

            return stats
        except Exception as e:
            # If table doesn't exist, create a new stats record
            stats = UserStats(total_xp=0, level=1, badges_earned=None)
            db.add(stats)
            await db.commit()
            await db.refresh(stats)
            return stats

    @staticmethod
    async def add_xp(db: AsyncSession, xp_amount: int) -> UserStats:
        """Add XP and update level."""
        stats = await GamificationService.get_user_stats(db)
        stats.total_xp += xp_amount

        # Calculate level (100 XP per level)
        new_level = (stats.total_xp // 100) + 1
        if new_level > stats.level:
            stats.level = new_level

        stats.updated_at = datetime.utcnow()
        await db.commit()
        await db.refresh(stats)
        return stats

    @staticmethod
    async def check_badges(db: AsyncSession) -> List[dict[str, str | int]]:
        """Check and award badges based on user progress."""
        try:
            stats = await GamificationService.get_user_stats(db)
            earned_badges = []

            # Get existing badges
            existing_badges = set()
            if stats.badges_earned:
                try:
                    import json
                    existing_badges = set(json.loads(stats.badges_earned))
                except (json.JSONDecodeError, TypeError):
                    existing_badges = set()

            # Check habit count
            try:
                habits_result = await db.execute(select(Habit))
                habits = habits_result.scalars().all()
                if len(habits) >= 1 and BadgeType.FIRST_HABIT not in existing_badges:
                    earned_badges.append(BadgeType.FIRST_HABIT)
            except Exception as e:
                print(f"Error checking habits: {e}")
                habits = []

            # Check total check-ins
            try:
                logs_result = await db.execute(select(HabitLog))
                total_checkins = len(logs_result.scalars().all())
                if total_checkins >= 100 and BadgeType.CHECKIN_100 not in existing_badges:
                    earned_badges.append(BadgeType.CHECKIN_100)
                elif total_checkins >= 50 and BadgeType.CHECKIN_50 not in existing_badges:
                    earned_badges.append(BadgeType.CHECKIN_50)
                elif total_checkins >= 10 and BadgeType.CHECKIN_10 not in existing_badges:
                    earned_badges.append(BadgeType.CHECKIN_10)
            except Exception as e:
                print(f"Error checking check-ins: {e}")

            # Check streaks (get max streak from all habits)
            max_streak = 0
            try:
                from app.services.habit_log_service import HabitLogService
                for habit in habits:
                    try:
                        streak = await HabitLogService.get_streak(db, habit.id)
                        max_streak = max(max_streak, streak)
                    except Exception as e:
                        print(f"Error checking streak for habit {habit.id}: {e}")
                        continue

                if max_streak >= 100 and BadgeType.STREAK_100 not in existing_badges:
                    earned_badges.append(BadgeType.STREAK_100)
                elif max_streak >= 30 and BadgeType.STREAK_30 not in existing_badges:
                    earned_badges.append(BadgeType.STREAK_30)
                elif max_streak >= 7 and BadgeType.STREAK_7 not in existing_badges:
                    earned_badges.append(BadgeType.STREAK_7)
            except Exception as e:
                print(f"Error checking streaks: {e}")

            # Check perfect week
            try:
                week_start = datetime.now() - timedelta(days=datetime.now().weekday())
                week_logs = await db.execute(
                    select(HabitLog).where(HabitLog.log_date >= week_start)
                )
                week_checkins = len(week_logs.scalars().all())
                if week_checkins >= 7 and BadgeType.PERFECT_WEEK not in existing_badges:
                    earned_badges.append(BadgeType.PERFECT_WEEK)
            except Exception as e:
                print(f"Error checking perfect week: {e}")

            # Check category master
            try:
                categories = {habit.category for habit in habits}
                if len(categories) >= 6 and BadgeType.CATEGORY_MASTER not in existing_badges:
                    earned_badges.append(BadgeType.CATEGORY_MASTER)
            except Exception as e:
                print(f"Error checking categories: {e}")

            # Award new badges
            if earned_badges:
                import json
                all_badges = existing_badges.union(set(earned_badges))
                stats.badges_earned = json.dumps(list(all_badges))
                stats.updated_at = datetime.utcnow()
                await db.commit()
                await db.refresh(stats)

                # Award XP for new badges
                try:
                    total_xp = sum(BADGE_DEFINITIONS[badge]["xp"] for badge in earned_badges if badge in BADGE_DEFINITIONS)
                    if total_xp > 0:
                        await GamificationService.add_xp(db, total_xp)
                except Exception as e:
                    print(f"Error awarding XP: {e}")

            # Return badge details
            return [
                {
                    "id": badge_id,
                    **BADGE_DEFINITIONS[badge_id],
                }
                for badge_id in earned_badges if badge_id in BADGE_DEFINITIONS
            ]
        except Exception as e:
            import traceback
            print(f"Error in check_badges: {e}")
            print(traceback.format_exc())
            return []

    @staticmethod
    async def get_all_badges(db: AsyncSession) -> List[dict[str, str | int]]:
        """Get all earned badges."""
        stats = await GamificationService.get_user_stats(db)
        if not stats.badges_earned:
            return []

        try:
            import json
            earned_badge_ids = json.loads(stats.badges_earned)
            return [
                {
                    "id": badge_id,
                    **BADGE_DEFINITIONS[badge_id],
                }
                for badge_id in earned_badge_ids if badge_id in BADGE_DEFINITIONS
            ]
        except (json.JSONDecodeError, TypeError):
            return []

