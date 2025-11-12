# Habit Hero

A habit tracker to build better routines and stay consistent.

## Project Structure

- ackend/ â€“ FastAPI service
- rontend/ â€“ React client
- docs/ â€“ Project documentation (coming soon)

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm 9+

### Stage 0 â€“ Scaffolding
1. Create and activate a virtual environment:
   `powershell
   python -m venv .venv
   .\.venv\Scripts\activate
   `
2. Install backend dependencies:
   `powershell
   pip install -r backend\requirements.txt
   `
3. Install frontend dependencies:
   `powershell
   cd frontend
   npm install
   `

### Stage 1 â€“ Backend Skeleton
1. From the project root, ensure the virtual environment is active.
2. Run the FastAPI app:
   `powershell
   cd backend
   uvicorn app.main:app --reload
   `
3. Verify endpoints:
   - Root: http://127.0.0.1:8000/
   - Health: http://127.0.0.1:8000/api/health

## Roadmap

1. Backend configuration & project layout âœ…
2. Frontend baseline UI
3. Habit CRUD features
4. Progress tracking experience
5. Analytics & insights
6. Optional AI enhancements
7. Optional extras (PDF export, gamification, integrations)
8. Documentation & deployment polish

## License

TBD
