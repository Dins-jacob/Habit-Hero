from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.habit import Habit, HabitCategory


class AIService:
    """Service for AI-powered features like habit suggestions and mood analysis."""

    @staticmethod
    async def suggest_habits(db: AsyncSession, user_habits: List[Habit]) -> List[dict[str, str]]:
        """Suggest new habits based on existing habits and categories."""
        suggestions = []

        # Get all existing categories
        existing_categories = {habit.category for habit in user_habits}

        # Category-based suggestions
        category_suggestions = {
            HabitCategory.HEALTH: [
                {"name": "Drink 8 glasses of water", "category": "health", "frequency": "daily"},
                {"name": "Take vitamins", "category": "health", "frequency": "daily"},
                {"name": "Get 8 hours of sleep", "category": "health", "frequency": "daily"},
            ],
            HabitCategory.FITNESS: [
                {"name": "30-minute walk", "category": "fitness", "frequency": "daily"},
                {"name": "Stretching routine", "category": "fitness", "frequency": "daily"},
                {"name": "Strength training", "category": "fitness", "frequency": "weekly"},
            ],
            HabitCategory.LEARNING: [
                {"name": "Read for 30 minutes", "category": "learning", "frequency": "daily"},
                {"name": "Practice a new skill", "category": "learning", "frequency": "daily"},
                {"name": "Watch educational content", "category": "learning", "frequency": "weekly"},
            ],
            HabitCategory.MENTAL_HEALTH: [
                {"name": "Meditation", "category": "mental_health", "frequency": "daily"},
                {"name": "Journaling", "category": "mental_health", "frequency": "daily"},
                {"name": "Gratitude practice", "category": "mental_health", "frequency": "daily"},
            ],
            HabitCategory.PRODUCTIVITY: [
                {"name": "Plan your day", "category": "productivity", "frequency": "daily"},
                {"name": "Review weekly goals", "category": "productivity", "frequency": "weekly"},
                {"name": "Organize workspace", "category": "productivity", "frequency": "weekly"},
            ],
            HabitCategory.WORK: [
                {"name": "Take regular breaks", "category": "work", "frequency": "daily"},
                {"name": "Review daily tasks", "category": "work", "frequency": "daily"},
            ],
        }

        # Suggest habits from categories the user doesn't have yet
        for category in HabitCategory:
            if category not in existing_categories and category in category_suggestions:
                suggestions.extend(category_suggestions[category][:2])  # Top 2 from each category

        # Also suggest complementary habits for existing categories
        for habit in user_habits[:3]:  # Look at top 3 habits
            if habit.category in category_suggestions:
                # Get suggestions that aren't already in user's habits
                existing_names = {h.name.lower() for h in user_habits}
                for suggestion in category_suggestions[habit.category]:
                    if suggestion["name"].lower() not in existing_names:
                        suggestions.append(suggestion)
                        break

        # Remove duplicates and limit to 5 suggestions
        seen = set()
        unique_suggestions = []
        for sug in suggestions:
            key = (sug["name"].lower(), sug["category"])
            if key not in seen:
                seen.add(key)
                unique_suggestions.append(sug)
                if len(unique_suggestions) >= 5:
                    break

        return unique_suggestions

    @staticmethod
    def analyze_mood_from_notes(notes: str) -> dict[str, str | float]:
        """Analyze mood from habit log notes using simple keyword analysis."""
        if not notes:
            return {"sentiment": "neutral", "confidence": 0.0, "keywords": []}

        notes_lower = notes.lower()

        # Positive keywords
        positive_keywords = [
            "great", "good", "excellent", "amazing", "wonderful", "happy", "proud", "excited",
            "motivated", "energetic", "grateful", "blessed", "accomplished", "satisfied", "confident"
        ]

        # Negative keywords
        negative_keywords = [
            "bad", "difficult", "hard", "struggled", "tired", "stressed", "anxious", "frustrated",
            "disappointed", "sad", "exhausted", "overwhelmed", "worried", "challenging"
        ]

        # Count matches
        positive_count = sum(1 for word in positive_keywords if word in notes_lower)
        negative_count = sum(1 for word in negative_keywords if word in notes_lower)

        # Determine sentiment
        if positive_count > negative_count:
            sentiment = "positive"
            confidence = min(0.9, 0.5 + (positive_count * 0.1))
        elif negative_count > positive_count:
            sentiment = "negative"
            confidence = min(0.9, 0.5 + (negative_count * 0.1))
        else:
            sentiment = "neutral"
            confidence = 0.5

        # Extract found keywords
        found_keywords = []
        all_keywords = positive_keywords + negative_keywords
        for keyword in all_keywords:
            if keyword in notes_lower:
                found_keywords.append(keyword)

        return {
            "sentiment": sentiment,
            "confidence": round(confidence, 2),
            "keywords": found_keywords[:5],  # Top 5 keywords
        }

    @staticmethod
    def get_motivational_quote() -> dict[str, str]:
        """Get a random motivational quote."""
        quotes = [
            {
                "quote": "The secret of getting ahead is getting started.",
                "author": "Mark Twain"
            },
            {
                "quote": "You don't have to be great to start, but you have to start to be great.",
                "author": "Zig Ziglar"
            },
            {
                "quote": "Small steps every day lead to big results over time.",
                "author": "Unknown"
            },
            {
                "quote": "Consistency is the key to success.",
                "author": "Unknown"
            },
            {
                "quote": "Your habits shape your identity, and your identity shapes your habits.",
                "author": "James Clear"
            },
            {
                "quote": "Progress, not perfection.",
                "author": "Unknown"
            },
            {
                "quote": "The best time to plant a tree was 20 years ago. The second best time is now.",
                "author": "Chinese Proverb"
            },
            {
                "quote": "Success is the sum of small efforts repeated day in and day out.",
                "author": "Robert Collier"
            },
        ]

        import random
        return random.choice(quotes)

