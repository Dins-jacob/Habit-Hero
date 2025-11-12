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

    @staticmethod
    async def generate_progress_insights(db: AsyncSession) -> dict[str, str | List[dict[str, str]]]:
        """Generate AI-powered insights about user's habit progress."""
        try:
            from app.models.habit_log import HabitLog
            from app.services.habit_log_service import HabitLogService
            from app.services.analytics_service import AnalyticsService
            from sqlalchemy import select, func
            from datetime import datetime, timedelta

            # Get all habits
            habits_result = await db.execute(select(Habit))
            habits = habits_result.scalars().all()

            if not habits:
                return {
                    "insights": [
                        {
                            "type": "info",
                            "title": "Get Started",
                            "message": "Create your first habit to start tracking your progress and receive personalized insights!",
                            "icon": "🎯"
                        }
                    ],
                    "recommendations": []
                }

            insights = []
            recommendations = []

            # Analyze streaks
            try:
                max_streak = 0
                best_habit = None
                for habit in habits:
                    try:
                        streak = await HabitLogService.get_streak(db, habit.id)
                        if streak > max_streak:
                            max_streak = streak
                            best_habit = habit
                    except Exception as e:
                        print(f"Error getting streak for habit {habit.id}: {e}")
                        continue

                if max_streak >= 7 and best_habit:
                    insights.append({
                        "type": "success",
                        "title": "Streak Champion!",
                        "message": f"Amazing! You're maintaining a {max_streak}-day streak with '{best_habit.name}'. Keep up the momentum!",
                        "icon": "🔥"
                    })
                elif max_streak >= 3:
                    insights.append({
                        "type": "info",
                        "title": "Building Momentum",
                        "message": f"Great start! You have a {max_streak}-day streak. Aim for 7 days to unlock the 'Week Warrior' badge!",
                        "icon": "📈"
                    })
            except Exception as e:
                print(f"Error analyzing streaks: {e}")

            # Analyze success rates
            try:
                low_success_habits = []
                high_success_habits = []
                for habit in habits:
                    try:
                        success_rate = await HabitLogService.get_success_rate(db, habit.id)
                        if success_rate < 50:
                            low_success_habits.append((habit, success_rate))
                        elif success_rate >= 80:
                            high_success_habits.append((habit, success_rate))
                    except Exception as e:
                        print(f"Error getting success rate for habit {habit.id}: {e}")
                        continue

                if low_success_habits:
                    habit, rate = min(low_success_habits, key=lambda x: x[1])
                    insights.append({
                        "type": "warning",
                        "title": "Room for Improvement",
                        "message": f"'{habit.name}' has a {rate:.0f}% success rate. Consider adjusting the frequency or breaking it into smaller steps.",
                        "icon": "💡"
                    })
                    recommendations.append({
                        "action": "Adjust habit difficulty",
                        "habit": habit.name,
                        "suggestion": "Try reducing frequency or making the habit smaller and more achievable."
                    })

                if high_success_habits:
                    habit, rate = max(high_success_habits, key=lambda x: x[1])
                    insights.append({
                        "type": "success",
                        "title": "Consistency Master",
                        "message": f"'{habit.name}' has an impressive {rate:.0f}% success rate! You're doing great with this habit.",
                        "icon": "⭐"
                    })
            except Exception as e:
                print(f"Error analyzing success rates: {e}")

            # Analyze check-in patterns
            try:
                logs_result = await db.execute(select(HabitLog))
                all_logs = logs_result.scalars().all()
                
                if all_logs:
                    # Get best days
                    try:
                        best_days_data = await AnalyticsService.get_best_days(db)
                        if best_days_data and len(best_days_data) > 0:
                            best_day = max(best_days_data.items(), key=lambda x: x[1])
                            if best_day[1] > 0:
                                insights.append({
                                    "type": "info",
                                    "title": "Best Day Pattern",
                                    "message": f"You're most consistent on {best_day[0]}s with {best_day[1]} check-ins. Schedule important habits on this day!",
                                    "icon": "📅"
                                })
                    except Exception as e:
                        print(f"Error getting best days: {e}")

                # Analyze recent activity
                week_ago = datetime.now() - timedelta(days=7)
                recent_logs = [log for log in all_logs if log.log_date >= week_ago]
                
                if len(recent_logs) >= 7:
                    insights.append({
                        "type": "success",
                        "title": "Perfect Week!",
                        "message": f"You've completed {len(recent_logs)} check-ins this week. You're on track for the 'Perfect Week' badge!",
                        "icon": "🎉"
                    })
                elif len(recent_logs) < 3:
                    insights.append({
                        "type": "warning",
                        "title": "Low Activity",
                        "message": f"Only {len(recent_logs)} check-ins this week. Try to check in more consistently to build momentum!",
                        "icon": "📊"
                    })
                    recommendations.append({
                        "action": "Increase check-ins",
                        "habit": "All habits",
                        "suggestion": "Set reminders or check in at the same time each day to build consistency."
                    })
            except Exception as e:
                print(f"Error analyzing check-in patterns: {e}")

            # Category analysis
            try:
                categories = {}
                for habit in habits:
                    if habit.category not in categories:
                        categories[habit.category] = []
                    categories[habit.category].append(habit)

                if len(categories) >= 4:
                    insights.append({
                        "type": "info",
                        "title": "Well-Rounded",
                        "message": f"You're tracking habits across {len(categories)} different categories. Great balance!",
                        "icon": "⚖️"
                    })
                else:
                    recommendations.append({
                        "action": "Diversify habits",
                        "habit": "New habits",
                        "suggestion": f"Consider adding habits from other categories. You currently have habits in {len(categories)} category/categories."
                    })
            except Exception as e:
                print(f"Error analyzing categories: {e}")

            # Predict success likelihood
            if habits:
                try:
                    success_rates = []
                    for habit in habits:
                        try:
                            rate = await HabitLogService.get_success_rate(db, habit.id)
                            success_rates.append(rate)
                        except Exception as e:
                            print(f"Error getting success rate for habit {habit.id}: {e}")
                            continue
                    
                    if success_rates:
                        avg_success = sum(success_rates) / len(success_rates)
                
                        if avg_success >= 70:
                            insights.append({
                                "type": "success",
                                "title": "High Success Rate",
                                "message": f"Your average success rate is {avg_success:.0f}%. You're maintaining excellent consistency!",
                                "icon": "🏆"
                            })
                        elif avg_success < 40:
                            insights.append({
                                "type": "warning",
                                "title": "Building Consistency",
                                "message": f"Your average success rate is {avg_success:.0f}%. Focus on one habit at a time to build momentum.",
                                "icon": "📈"
                            })
                except Exception as e:
                    print(f"Error calculating average success: {e}")

            # Default insight if none generated
            if not insights:
                insights.append({
                    "type": "info",
                    "title": "Keep Going!",
                    "message": "Continue tracking your habits to unlock personalized insights and recommendations!",
                    "icon": "💪"
                })

            return {
                "insights": insights[:5],  # Limit to 5 insights
                "recommendations": recommendations[:3]  # Limit to 3 recommendations
            }
        except Exception as e:
            import traceback
            print(f"Error in generate_progress_insights: {e}")
            print(traceback.format_exc())
            # Return default insights on error
            return {
                "insights": [
                    {
                        "type": "info",
                        "title": "Insights Unavailable",
                        "message": "Unable to generate insights at this time. Please try again later.",
                        "icon": "⚠️"
                    }
                ],
                "recommendations": []
            }

