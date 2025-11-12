# Habit Hero

A habit tracker to build better routines and stay consistent.

## Project Structure

- `backend/` – FastAPI service
- `frontend/` – React client with TypeScript
- `docs/` – Project documentation (coming soon)

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm 9+

### Setup

1. **Create and activate a virtual environment:**
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\activate
   ```

2. **Install backend dependencies:**
   ```powershell
   pip install -r backend\requirements.txt
   ```

3. **Install frontend dependencies:**
   ```powershell
   cd frontend
   npm install
   ```

### Running the Application

**Backend (Terminal 1):**
```powershell
cd backend
uvicorn app.main:app --reload
```
- API Root: http://127.0.0.1:8000/
- Health Check: http://127.0.0.1:8000/api/health
- API Docs: http://127.0.0.1:8000/docs

**Frontend (Terminal 2):**
```powershell
cd frontend
npm run dev
```
- Frontend: http://127.0.0.1:5173

## Development Stages

### Stage 0 – Project Scaffolding ✅
- Initial project structure
- Basic FastAPI health endpoint
- Vite + React + TypeScript setup

### Stage 1 – Backend Structure ✅
- Configuration management with Pydantic Settings
- Modular API routing structure
- Database session setup (SQLAlchemy async)
- Organized project layout (core, api, models, schemas, services, db)

### Stage 2 – Frontend Baseline UI ✅
- Component-based architecture
- API service layer
- Clean, modern UI with gradient design
- Backend health status integration

### Stage 3 – Habit CRUD (Next)
- Database models for habits
- Create, read, update, delete habits
- Frontend forms and habit list

### Stage 4 – Progress Tracking
- Log check-ins and notes
- Calendar/weekly view
- Streak calculation

### Stage 5 – Analytics Dashboard
- Success rate metrics
- Best days analysis
- Visual charts and insights

### Stage 6 – Optional AI Features
- Habit suggestions
- Mood analysis from notes
- Motivational quotes

### Stage 7 – Optional Extras
- PDF export
- Gamification (XP, badges)
- Google Calendar sync

### Stage 8 – Documentation & Deployment
- Complete project documentation
- Deployment setup (Vercel + Railway)
- Demo video

## License

TBD
