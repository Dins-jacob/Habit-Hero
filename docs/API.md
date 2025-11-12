# Habit Hero API Documentation

## Base URL

- **Development**: `http://127.0.0.1:8000`
- **Production**: `https://your-backend-url.com`

## Authentication

Currently, the API does not require authentication. Future versions may include user authentication.

## Response Format

All API responses are in JSON format.

### Success Response
```json
{
  "data": {...}
}
```

### Error Response
```json
{
  "detail": "Error message"
}
```

## Endpoints

### Health Check

#### GET /api/health
Check if the API is running.

**Response:**
```json
{
  "status": "ok"
}
```

---

### Habits

#### GET /api/habits/
Get all habits.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Morning Exercise",
    "frequency": "daily",
    "category": "fitness",
    "start_date": "2024-01-01",
    "description": "30 minutes of exercise",
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00"
  }
]
```

#### GET /api/habits/{id}
Get a specific habit by ID.

**Parameters:**
- `id` (path): Habit ID

**Response:**
```json
{
  "id": 1,
  "name": "Morning Exercise",
  "frequency": "daily",
  "category": "fitness",
  "start_date": "2024-01-01",
  "description": "30 minutes of exercise",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

#### POST /api/habits/
Create a new habit.

**Request Body:**
```json
{
  "name": "Morning Exercise",
  "frequency": "daily",
  "category": "fitness",
  "start_date": "2024-01-01",
  "description": "30 minutes of exercise"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Morning Exercise",
  "frequency": "daily",
  "category": "fitness",
  "start_date": "2024-01-01",
  "description": "30 minutes of exercise",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

#### PUT /api/habits/{id}
Update an existing habit.

**Parameters:**
- `id` (path): Habit ID

**Request Body:**
```json
{
  "name": "Evening Exercise",
  "frequency": "daily",
  "category": "fitness",
  "start_date": "2024-01-01",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Evening Exercise",
  "frequency": "daily",
  "category": "fitness",
  "start_date": "2024-01-01",
  "description": "Updated description",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T01:00:00"
}
```

#### DELETE /api/habits/{id}
Delete a habit.

**Parameters:**
- `id` (path): Habit ID

**Response:** `204 No Content`

---

### Habit Logs

#### GET /api/habit-logs/
Get all habit logs.

**Query Parameters:**
- `habit_id` (optional): Filter by habit ID

**Response:**
```json
[
  {
    "id": 1,
    "habit_id": 1,
    "log_date": "2024-01-01",
    "notes": "Great workout!",
    "created_at": "2024-01-01T00:00:00"
  }
]
```

#### POST /api/habit-logs/
Create a new habit log (check-in).

**Request Body:**
```json
{
  "habit_id": 1,
  "log_date": "2024-01-01",
  "notes": "Great workout!"
}
```

**Response:**
```json
{
  "id": 1,
  "habit_id": 1,
  "log_date": "2024-01-01",
  "notes": "Great workout!",
  "created_at": "2024-01-01T00:00:00"
}
```

#### GET /api/habit-logs/streak/{habit_id}
Get the current streak for a habit.

**Parameters:**
- `habit_id` (path): Habit ID

**Response:**
```json
{
  "habit_id": 1,
  "streak": 5
}
```

#### GET /api/habit-logs/success-rate/{habit_id}
Get the success rate for a habit.

**Parameters:**
- `habit_id` (path): Habit ID

**Response:**
```json
{
  "habit_id": 1,
  "success_rate": 85.5
}
```

---

### Analytics

#### GET /api/analytics/overall
Get overall statistics across all habits.

**Response:**
```json
{
  "total_habits": 5,
  "total_checkins": 50,
  "average_success_rate": 75.5,
  "longest_streak": 10
}
```

#### GET /api/analytics/best-days
Get check-in counts by day of week.

**Query Parameters:**
- `habit_id` (optional): Filter by habit ID

**Response:**
```json
{
  "best_days": {
    "Monday": 10,
    "Tuesday": 8,
    "Wednesday": 12,
    "Thursday": 9,
    "Friday": 11,
    "Saturday": 7,
    "Sunday": 6
  }
}
```

#### GET /api/analytics/checkins-by-date
Get check-in counts by date.

**Query Parameters:**
- `habit_id` (optional): Filter by habit ID
- `days` (optional): Number of days to look back (default: 30)

**Response:**
```json
{
  "checkins_by_date": {
    "2024-01-01": 3,
    "2024-01-02": 2,
    "2024-01-03": 4
  }
}
```

#### GET /api/analytics/category-stats
Get statistics grouped by category.

**Response:**
```json
{
  "category_stats": {
    "fitness": {
      "total_habits": 2,
      "total_checkins": 20,
      "average_success_rate": 80.0
    },
    "health": {
      "total_habits": 1,
      "total_checkins": 15,
      "average_success_rate": 90.0
    }
  }
}
```

---

### AI Features

#### GET /api/ai/suggest-habits
Get AI-powered habit suggestions based on existing habits.

**Response:**
```json
{
  "suggestions": [
    {
      "name": "Drink 8 glasses of water",
      "category": "health",
      "frequency": "daily",
      "description": "Stay hydrated throughout the day"
    }
  ]
}
```

#### POST /api/ai/analyze-mood
Analyze mood/sentiment from notes.

**Request Body:**
```json
{
  "notes": "Feeling great today! Very motivated and energetic."
}
```

**Response:**
```json
{
  "analysis": {
    "sentiment": "positive",
    "confidence": 0.85,
    "keywords": ["great", "motivated", "energetic"]
  }
}
```

#### GET /api/ai/motivational-quote
Get a random motivational quote.

**Response:**
```json
{
  "quote": {
    "quote": "The secret of getting ahead is getting started.",
    "author": "Mark Twain"
  }
}
```

#### GET /api/ai/progress-insights
Get AI-generated progress insights and recommendations.

**Response:**
```json
{
  "insights": [
    {
      "type": "success",
      "title": "Streak Champion!",
      "message": "Amazing! You're maintaining a 7-day streak with 'Morning Exercise'.",
      "icon": "🔥"
    }
  ],
  "recommendations": [
    {
      "action": "Adjust habit difficulty",
      "habit": "Evening Meditation",
      "suggestion": "Try reducing frequency or making the habit smaller."
    }
  ]
}
```

---

### Gamification

#### GET /api/gamification/stats
Get user gamification statistics.

**Response:**
```json
{
  "total_xp": 250,
  "level": 3,
  "xp_to_next_level": 50,
  "badges": [
    {
      "id": "first_checkin",
      "name": "First Steps",
      "description": "Completed your first check-in",
      "icon": "🎯"
    }
  ],
  "badge_count": 1
}
```

#### POST /api/gamification/check-badges
Check for and award new badges.

**Response:**
```json
{
  "new_badges": [
    {
      "id": "week_warrior",
      "name": "Week Warrior",
      "description": "Maintained a 7-day streak",
      "icon": "🔥"
    }
  ],
  "message": "Awarded 1 new badge(s)!"
}
```

---

### Export

#### GET /api/export/pdf
Get progress report data for PDF export.

**Response:**
```json
{
  "generated_at": "2024-01-01T00:00:00",
  "overall_stats": {
    "total_habits": 5,
    "total_checkins": 50,
    "average_success_rate": 75.5
  },
  "gamification": {
    "total_xp": 250,
    "level": 3,
    "badges": [...]
  },
  "habits": [
    {
      "id": 1,
      "name": "Morning Exercise",
      "category": "fitness",
      "frequency": "daily",
      "start_date": "2024-01-01",
      "streak": 5,
      "success_rate": 85.0,
      "recent_checkins": 10
    }
  ]
}
```

---

## Error Codes

- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Rate Limiting

Currently, there is no rate limiting. Future versions may include rate limiting for production use.

## CORS

CORS is enabled for the following origins:
- `http://localhost:5173`
- `http://127.0.0.1:5173`

For production, update CORS settings in `backend/app/main.py`.

