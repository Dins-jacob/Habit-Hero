# Habit Hero 

A full-stack habit tracking application built with React and FastAPI to help you build better routines and stay consistent.

![Habit Hero](https://img.shields.io/badge/Status-Production%20Ready-success)
![Python](https://img.shields.io/badge/Python-3.11+-blue)
![React](https://img.shields.io/badge/React-19.2-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-green)

##  Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Development Stages](#development-stages)
- [Contributing](#contributing)
- [License](#license)

##  Features

### Core Features
-  **Habit Management**: Create, read, update, and delete habits
-  **Progress Tracking**: Log check-ins with notes and track streaks
-  **Analytics Dashboard**: View success rates, best days, and category statistics
-  **Visual Charts**: Interactive charts for check-ins over time, best days, and category distribution

### AI Features
-  **AI Progress Insights**: Personalized insights based on your habit data
-  **Habit Suggestions**: AI-powered suggestions for new habits
-  **Mood Analysis**: Analyze sentiment from your check-in notes
-  **Motivational Quotes**: Auto-rotating motivational quotes with slide animations

### Gamification
-  **XP System**: Earn experience points for check-ins and streaks
-  **Badges**: Unlock badges for various achievements
-  **Level System**: Level up as you gain XP
-  **Badge Criteria**: View detailed criteria for all available badges

### Additional Features
-  **PDF Export**: Export your progress report as PDF
-  **Google Calendar Sync**: Add habits to your Google Calendar
-  **Modern UI**: Professional, user-friendly interface with animations
-  **Responsive Design**: Works seamlessly on desktop and mobile devices

##  Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Lightweight database (can be upgraded to PostgreSQL)
- **Pydantic** - Data validation and settings management
- **Uvicorn** - ASGI server

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Recharts** - Chart library for data visualization
- **jsPDF** - PDF generation

##  Project Structure

```
habit-hero/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/        # API endpoints
│   │   ├── core/
│   │   │   └── config.py     # Configuration
│   │   ├── db/
│   │   │   ├── base.py       # Database models base
│   │   │   └── session.py    # Database session
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Business logic
│   │   └── main.py          # FastAPI app
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API services
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   └── App.tsx         # Main app component
│   └── package.json
└── README.md
```

##  Getting Started

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **npm 9+** (or yarn/pnpm)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd habit-hero
   ```

2. **Set up Backend:**
   ```bash
   # Create virtual environment
   python -m venv .venv
   
   # Activate virtual environment
   # Windows:
   .\.venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   
   # Install dependencies
   cd backend
   pip install -r requirements.txt
   ```

3. **Set up Frontend:**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

**Backend (Terminal 1):**
```bash
cd backend
uvicorn app.main:app --reload
```
- API Root: http://127.0.0.1:8000/
- Health Check: http://127.0.0.1:8000/api/health
- API Docs (Swagger): http://127.0.0.1:8000/docs
- Alternative Docs (ReDoc): http://127.0.0.1:8000/redoc

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
- Frontend: http://localhost:5173

The frontend is configured to proxy API requests to the backend automatically.

##  API Documentation

### Habit Endpoints

- `GET /api/habits/` - Get all habits
- `GET /api/habits/{id}` - Get habit by ID
- `POST /api/habits/` - Create new habit
- `PUT /api/habits/{id}` - Update habit
- `DELETE /api/habits/{id}` - Delete habit

### Habit Log Endpoints

- `GET /api/habit-logs/` - Get all habit logs
- `GET /api/habit-logs/{id}` - Get habit log by ID
- `POST /api/habit-logs/` - Create new habit log (check-in)
- `GET /api/habit-logs/streak/{habit_id}` - Get streak for habit
- `GET /api/habit-logs/success-rate/{habit_id}` - Get success rate for habit

### Analytics Endpoints

- `GET /api/analytics/overall` - Get overall statistics
- `GET /api/analytics/best-days` - Get best days for check-ins
- `GET /api/analytics/checkins-by-date` - Get check-ins by date
- `GET /api/analytics/category-stats` - Get statistics by category

### AI Endpoints

- `GET /api/ai/suggest-habits` - Get AI-powered habit suggestions
- `POST /api/ai/analyze-mood` - Analyze mood from notes
- `GET /api/ai/motivational-quote` - Get random motivational quote
- `GET /api/ai/progress-insights` - Get AI-generated progress insights

### Gamification Endpoints

- `GET /api/gamification/stats` - Get user gamification stats
- `POST /api/gamification/check-badges` - Check and award new badges

### Export Endpoints

- `GET /api/export/pdf` - Export progress report as PDF data

For detailed API documentation, visit http://127.0.0.1:8000/docs when the backend is running.

##  Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure Environment Variables:**
   - Set `VITE_API_URL` to your backend API URL

4. **Update Vite Config:**
   Ensure `vite.config.ts` has the correct API proxy settings for production.

### Backend Deployment (Railway)

1. **Create Railway Account:**
   - Sign up at [railway.app](https://railway.app)

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"

3. **Configure Build:**
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. **Set Environment Variables:**
   - `DEBUG=False`
   - `DATABASE_URL` (if using PostgreSQL)

5. **Deploy:**
   - Railway will automatically deploy on push to main branch

### Alternative: Docker Deployment

See `docs/DEPLOYMENT.md` for Docker deployment instructions.

##  Development Stages

###  Stage 0 – Project Scaffolding
- Initial project structure
- Basic FastAPI health endpoint
- Vite + React + TypeScript setup

###  Stage 1 – Backend Structure
- Configuration management with Pydantic Settings
- Modular API routing structure
- Database session setup (SQLAlchemy async)
- Organized project layout

###  Stage 2 – Frontend Baseline UI
- Component-based architecture
- API service layer
- Clean, modern UI with gradient design
- Backend health status integration

###  Stage 3 – Habit CRUD
- Database models for habits
- Create, read, update, delete habits
- Frontend forms and habit list
- UI-based delete confirmation

###  Stage 4 – Progress Tracking
- Log check-ins and notes
- Streak calculation
- Success rate calculation
- Check-in form with mood analysis

###  Stage 5 – Analytics Dashboard
- Success rate metrics
- Best days analysis
- Visual charts (Recharts)
- Category statistics

###  Stage 6 – Optional AI Features
- Habit suggestions
- Mood analysis from notes
- Motivational quotes with auto-rotation
- AI Progress Insights

###  Stage 7 – Optional Extras
- PDF export functionality
- Gamification (XP, badges, levels)
- Google Calendar sync
- Badge criteria modal

###  Stage 8 – Documentation & Deployment
- Complete project documentation
- Deployment setup guides
- API documentation

##  Usage Guide

### Creating a Habit

1. Click "Create New Habit" button
2. Fill in the form:
   - Habit Name (required)
   - Frequency (daily, weekly, etc.)
   - Category (health, fitness, learning, etc.)
   - Start Date (required)
   - Description (optional)
3. Click "Create Habit"

### Tracking Progress

1. Find your habit in the list
2. Click "Check In" button
3. Add notes (optional)
4. Submit to log your progress

### Viewing Analytics

1. Click the "Analytics" tab
2. View overall statistics
3. Explore charts for:
   - Best days for check-ins
   - Category distribution
   - Check-ins over time

### AI Insights

1. View the "AI Progress Insights" section (collapsed by default)
2. Click to expand and see personalized insights
3. View recommendations for improvement

### Gamification

1. Check your XP and level in the Gamification Panel
2. Click "Check Badges" to see if you've earned new badges
3. Click "Badge Criteria" to see requirements for all badges

##  Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the LICENSE file for details.

##  Acknowledgments

- FastAPI for the excellent web framework
- React team for the amazing UI library
- All open-source contributors whose packages made this project possible




