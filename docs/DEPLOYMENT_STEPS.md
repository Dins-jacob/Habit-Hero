# Step-by-Step Deployment Guide

This guide will walk you through deploying Habit Hero to production, step by step.

## Prerequisites Checklist

Before starting, ensure you have:
- [ ] GitHub account
- [ ] All code committed and pushed to GitHub
- [ ] Vercel account (free tier works) - Sign up at [vercel.com](https://vercel.com)
- [ ] Railway account (free tier works) - Sign up at [railway.app](https://railway.app)

---

## Part 1: Deploy Backend to Railway

### Step 1: Prepare Your Code

1. **Ensure all changes are committed:**
   ```bash
   git status
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 2: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"** or **"Login"**
3. Sign up with GitHub (recommended) or email
4. Verify your email if required

### Step 3: Create New Project on Railway

1. Click **"New Project"** button
2. Select **"Deploy from GitHub repo"**
3. Authorize Railway to access your GitHub if prompted
4. Select your **Habit Hero repository**
5. Click **"Deploy Now"**

### Step 4: Configure Backend Service

1. Railway will create a service automatically
2. Click on the service to open settings
3. Go to **Settings** tab
4. Set the following:

   **Root Directory:**
   - Click **"Change"** next to Root Directory
   - Enter: `backend`
   - Click **"Save"**

   **Start Command:**
   - Scroll to **"Deploy"** section
   - In **"Start Command"**, enter:
     ```
     uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```
   - Click **"Save"**

### Step 5: Add Environment Variables

1. Go to **Variables** tab
2. Click **"New Variable"**
3. Add these variables one by one:

   ```
   Variable: DEBUG
   Value: False
   ```

   ```
   Variable: APP_NAME
   Value: Habit Hero API
   ```

   ```
   Variable: APP_VERSION
   Value: 1.0.0
   ```

4. Click **"Save"** after each variable

### Step 6: Get Your Backend URL

1. Go to **Settings** tab
2. Scroll to **"Domains"** section
3. Click **"Generate Domain"** if not already generated
4. Copy the URL (e.g., `https://your-app-name.up.railway.app`)
5. **Save this URL** - you'll need it for frontend deployment

### Step 7: Verify Backend Deployment

1. Wait for deployment to complete (check **Deployments** tab)
2. Once deployed, click on the domain URL
3. You should see: `{"message": "Habit Hero API"}`
4. Visit `https://your-url.railway.app/docs` to see Swagger UI
5. Test the health endpoint: `https://your-url.railway.app/api/health`

**✅ Backend is now deployed!**

---

## Part 2: Update Backend CORS for Frontend

### Step 8: Update CORS Settings

1. In your local code, open `backend/app/main.py`
2. Find the CORS middleware section
3. Add your Railway URL to `allow_origins`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://your-frontend-url.vercel.app",  # We'll add this after frontend deployment
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

4. For now, you can add a wildcard temporarily (not recommended for production):
```python
allow_origins=["*"],  # Temporary - will update after frontend deployment
```

5. Commit and push:
```bash
git add backend/app/main.py
git commit -m "Update CORS for production"
git push origin main
```

6. Railway will automatically redeploy with the new CORS settings

---

## Part 3: Deploy Frontend to Vercel

### Step 9: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Sign up with GitHub (recommended)
4. Authorize Vercel to access your GitHub

### Step 10: Import Project to Vercel

1. Click **"Add New..."** → **"Project"**
2. Find and select your **Habit Hero repository**
3. Click **"Import"**

### Step 11: Configure Frontend Project

1. **Framework Preset:** Select **"Vite"** (should auto-detect)
2. **Root Directory:** Click **"Edit"** and set to: `frontend`
3. **Build Command:** Should be `npm run build` (auto-filled)
4. **Output Directory:** Should be `dist` (auto-filled)
5. **Install Command:** Should be `npm install` (auto-filled)

### Step 12: Add Environment Variables

1. Before deploying, click **"Environment Variables"**
2. Click **"Add"** and add:

   ```
   Name: VITE_API_URL
   Value: https://your-railway-url.up.railway.app
   ```
   (Use the Railway URL you saved in Step 6)

3. Make sure it's added to **Production**, **Preview**, and **Development**
4. Click **"Save"**

### Step 13: Deploy Frontend

1. Click **"Deploy"** button
2. Wait for deployment to complete (2-3 minutes)
3. Once deployed, you'll see **"Congratulations!"** message
4. Click on the deployment URL (e.g., `https://habit-hero.vercel.app`)
5. **Save this URL** - this is your frontend URL

### Step 14: Update Backend CORS with Frontend URL

1. Go back to `backend/app/main.py`
2. Update CORS with your actual Vercel URL:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://your-actual-vercel-url.vercel.app",  # Your actual Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

3. Remove the wildcard `["*"]` if you added it
4. Commit and push:
```bash
git add backend/app/main.py
git commit -m "Update CORS with production frontend URL"
git push origin main
```

5. Railway will automatically redeploy

**✅ Frontend is now deployed!**

---

## Part 4: Verify Deployment

### Step 15: Test Your Deployed Application

1. **Test Frontend:**
   - Visit your Vercel URL
   - Check if the page loads
   - Try creating a habit
   - Check browser console for errors

2. **Test Backend API:**
   - Visit `https://your-railway-url.railway.app/docs`
   - Test the health endpoint
   - Try creating a habit via API

3. **Test Integration:**
   - In the frontend, try creating a habit
   - Check if it appears in the list
   - Try checking in
   - View analytics

### Step 16: Fix Common Issues

**Issue: Frontend can't connect to backend**
- **Solution:** Check `VITE_API_URL` in Vercel environment variables
- **Solution:** Verify CORS settings in backend
- **Solution:** Check Railway deployment logs

**Issue: CORS errors in browser**
- **Solution:** Ensure frontend URL is in backend CORS `allow_origins`
- **Solution:** Remove wildcard `["*"]` if used temporarily
- **Solution:** Redeploy backend after CORS changes

**Issue: Build fails on Vercel**
- **Solution:** Check build logs in Vercel dashboard
- **Solution:** Ensure `package.json` has correct build script
- **Solution:** Check Node.js version (should be 18+)

**Issue: Backend won't start on Railway**
- **Solution:** Check Railway logs
- **Solution:** Verify start command is correct
- **Solution:** Check environment variables

---

## Part 5: Custom Domains (Optional)

### Step 17: Add Custom Domain to Vercel

1. Go to Vercel project → **Settings** → **Domains**
2. Enter your domain name
3. Follow DNS configuration instructions
4. Wait for DNS propagation

### Step 18: Add Custom Domain to Railway

1. Go to Railway project → **Settings** → **Domains**
2. Click **"Custom Domain"**
3. Enter your domain
4. Follow DNS configuration instructions

---

## Deployment Checklist

After deployment, verify:

- [ ] Backend is accessible at Railway URL
- [ ] Frontend is accessible at Vercel URL
- [ ] API health endpoint works
- [ ] Frontend can create habits
- [ ] Frontend can check in
- [ ] Analytics dashboard loads
- [ ] AI features work
- [ ] No CORS errors in browser console
- [ ] No errors in browser console
- [ ] Mobile responsive design works

---

## Monitoring and Maintenance

### View Logs

**Railway:**
- Go to project → Service → **Logs** tab
- View real-time logs
- Check for errors

**Vercel:**
- Go to project → **Deployments** → Click on deployment
- View build logs and runtime logs

### Update Deployment

Both platforms support automatic deployments:

- **Push to main branch** → Automatic deployment
- **No manual action needed**

### Environment Variables

**To update environment variables:**

**Railway:**
- Go to project → Service → **Variables** tab
- Add/Edit/Delete variables
- Service will automatically redeploy

**Vercel:**
- Go to project → **Settings** → **Environment Variables**
- Add/Edit/Delete variables
- Redeploy manually or push to trigger

---

## Troubleshooting

### Backend Issues

**Problem:** Backend returns 500 errors
- Check Railway logs
- Verify database is working
- Check environment variables

**Problem:** API endpoints not found
- Verify routes are registered in `app/api/router.py`
- Check Railway deployment logs

### Frontend Issues

**Problem:** Blank page
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly
- Check Vercel build logs

**Problem:** API calls fail
- Verify backend URL is correct
- Check CORS settings
- Verify backend is running

---

## Support

If you encounter issues:

1. Check logs in Railway/Vercel dashboards
2. Verify environment variables
3. Test API endpoints manually
4. Check browser console for errors
5. Review deployment documentation

---

## Next Steps

After successful deployment:

1. ✅ Share your deployed application
2. ✅ Create demo video
3. ✅ Update README with live URLs
4. ✅ Monitor usage and performance
5. ✅ Set up custom domains (optional)

**Congratulations! Your Habit Hero app is now live! 🎉**

