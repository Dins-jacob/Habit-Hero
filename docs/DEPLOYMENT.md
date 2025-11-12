# Deployment Guide

This guide covers deploying Habit Hero to production using Vercel (frontend) and Railway (backend).

## Prerequisites

- GitHub account
- Vercel account ([vercel.com](https://vercel.com))
- Railway account ([railway.app](https://railway.app))
- Git installed locally

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. **Update Vite Config** (if needed):
   ```typescript
   // frontend/vite.config.ts
   export default defineConfig({
     plugins: [react()],
     server: {
       proxy: {
         '/api': {
           target: process.env.VITE_API_URL || 'http://localhost:8000',
           changeOrigin: true,
         },
       },
     },
   })
   ```

2. **Create Environment File** (optional):
   ```bash
   # frontend/.env.production
   VITE_API_URL=https://your-backend-url.railway.app
   ```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No**
   - Project name? **habit-hero-frontend**
   - Directory? **./frontend**
   - Override settings? **No**

5. **Set Environment Variables:**
   ```bash
   vercel env add VITE_API_URL
   # Enter your backend URL: https://your-backend-url.railway.app
   ```

6. **Redeploy:**
   ```bash
   vercel --prod
   ```

#### Option B: Using GitHub Integration

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Import Project on Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add `VITE_API_URL` with your backend URL

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically deploy on every push to main

### Step 3: Update CORS on Backend

After deploying frontend, update backend CORS to include your Vercel URL:

```python
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://your-frontend-url.vercel.app",  # Add this
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Backend Deployment (Railway)

### Step 1: Prepare Backend

1. **Create `Procfile`** (optional, Railway auto-detects):
   ```bash
   # backend/Procfile
   web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

2. **Create `runtime.txt`** (optional, for Python version):
   ```bash
   # backend/runtime.txt
   python-3.11
   ```

### Step 2: Deploy to Railway

#### Option A: Using GitHub Integration (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare backend for deployment"
   git push origin main
   ```

2. **Create Railway Project:**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service:**
   - Railway will auto-detect Python
   - Set **Root Directory**: `backend`
   - Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. **Add Environment Variables:**
   - Go to Variables tab
   - Add:
     ```
     DEBUG=False
     APP_NAME=Habit Hero API
     APP_VERSION=1.0.0
     ```

5. **Deploy:**
   - Railway will automatically deploy
   - Get your deployment URL from the Settings → Domains

#### Option B: Using Railway CLI

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login:**
   ```bash
   railway login
   ```

3. **Initialize Project:**
   ```bash
   cd backend
   railway init
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

5. **Set Environment Variables:**
   ```bash
   railway variables set DEBUG=False
   railway variables set APP_NAME="Habit Hero API"
   ```

### Step 3: Update Database (Optional)

For production, consider using PostgreSQL:

1. **Add PostgreSQL Service on Railway:**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will provide connection string

2. **Update Environment Variables:**
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```

3. **Update `backend/app/db/session.py`** to use PostgreSQL:
   ```python
   from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
   from sqlalchemy.orm import sessionmaker
   import os

   database_url = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./habit_hero.db")
   # Convert postgres:// to postgresql+asyncpg://
   if database_url.startswith("postgres://"):
       database_url = database_url.replace("postgres://", "postgresql+asyncpg://", 1)

   _engine = create_async_engine(database_url, echo=False)
   ```

4. **Add to requirements.txt:**
   ```
   asyncpg==0.29.0
   ```

---

## Docker Deployment (Alternative)

### Step 1: Create Dockerfile for Backend

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Step 2: Create Dockerfile for Frontend

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Step 3: Create docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DEBUG=False
    volumes:
      - ./backend/habit_hero.db:/app/habit_hero.db

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

### Step 4: Deploy

```bash
docker-compose up -d
```

---

## Post-Deployment Checklist

- [ ] Frontend is accessible
- [ ] Backend API is accessible
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] Database is working
- [ ] API endpoints are responding
- [ ] Frontend can communicate with backend
- [ ] SSL certificates are valid (HTTPS)

## Troubleshooting

### Frontend Issues

**Problem**: Frontend can't connect to backend
- **Solution**: Check `VITE_API_URL` environment variable
- **Solution**: Verify CORS settings on backend

**Problem**: Build fails
- **Solution**: Check Node.js version (18+)
- **Solution**: Clear `node_modules` and reinstall

### Backend Issues

**Problem**: Backend won't start
- **Solution**: Check Python version (3.11+)
- **Solution**: Verify all dependencies in `requirements.txt`

**Problem**: Database errors
- **Solution**: Check database connection string
- **Solution**: Verify database permissions

**Problem**: CORS errors
- **Solution**: Update `allow_origins` in `main.py`
- **Solution**: Include both HTTP and HTTPS URLs

## Monitoring

### Railway Monitoring

- View logs: Railway dashboard → Service → Logs
- Monitor metrics: Railway dashboard → Service → Metrics

### Vercel Monitoring

- View deployments: Vercel dashboard → Project → Deployments
- View analytics: Vercel dashboard → Project → Analytics

## Continuous Deployment

Both Vercel and Railway support automatic deployments:

- **Vercel**: Deploys on push to main branch
- **Railway**: Deploys on push to main branch

No additional configuration needed!

---

## Support

For deployment issues:
1. Check logs in Railway/Vercel dashboards
2. Verify environment variables
3. Test API endpoints manually
4. Check CORS configuration

