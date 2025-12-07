# Deployment Guide

This guide explains how to deploy the Aelvynor backend and frontend to various hosting platforms.

## 🚀 Quick Start

### Option 1: Vercel (Frontend) + Railway/Render (Backend) ⭐ Recommended

**Why?** 
- Vercel is optimized for Next.js with zero-config deployment
- Railway/Render provides easy backend hosting with PostgreSQL

### Option 2: GitHub Pages (Frontend) + Render (Backend)

Good for static sites and cost-effective hosting.

### Option 3: Full Stack on Render

Deploy both frontend and backend on Render (requires `.render.yaml`).

---

## 📋 Prerequisites

1. **GitHub Repository** - Push your code to GitHub
2. **Account on hosting platform** (Vercel, Railway, Render, etc.)
3. **Environment variables** ready

---

## 🌐 Deployment Options

### 1. Frontend: Vercel (Recommended for Next.js)

#### Step 1: Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

#### Step 2: Set Environment Variables

In Vercel dashboard → Project Settings → Environment Variables:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NODE_ENV=production
```

#### Step 3: Deploy

- **Automatic**: Every push to `main` branch triggers deployment
- **Manual**: Click "Deploy" button in Vercel dashboard

#### Step 4: GitHub Actions (Optional)

Use the provided workflow `.github/workflows/deploy-frontend-vercel.yml`

**Required Secrets:**
- `VERCEL_TOKEN` - Get from [Vercel Settings → Tokens](https://vercel.com/account/tokens)
- `VERCEL_ORG_ID` - Get from Vercel dashboard URL or API
- `VERCEL_PROJECT_ID` - Get from Vercel project settings

---

### 2. Backend: Railway

#### Step 1: Connect Repository

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Select **"backend"** directory

#### Step 2: Configure Build Settings

Railway auto-detects Python projects. Verify:

- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Build Command**: `pip install -r requirements.txt`

#### Step 3: Set Environment Variables

In Railway dashboard → Variables:

```bash
DATABASE_URL=postgresql://user:pass@host:port/db  # Railway provides this automatically
SECRET_KEY=your-super-secret-key-here
CORS_ORIGINS=https://your-frontend-url.vercel.app,https://your-frontend-url.com
ENVIRONMENT=production
DEBUG=false
```

#### Step 4: Add PostgreSQL Database

1. In Railway project → **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway automatically sets `DATABASE_URL` environment variable

#### Step 5: Run Migrations

In Railway dashboard → Deployments → Click on deployment → **"View Logs"**

Or create a one-time service to run migrations:

```bash
# Add a new service with command:
cd backend && alembic upgrade head
```

---

### 3. Backend: Render

#### Step 1: Create Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `aelvynor-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

#### Step 2: Set Environment Variables

In Render dashboard → Environment:

```bash
DATABASE_URL=postgresql://user:pass@host:port/db
SECRET_KEY=your-super-secret-key-here
CORS_ORIGINS=https://your-frontend-url.vercel.app
ENVIRONMENT=production
DEBUG=false
```

#### Step 3: Add PostgreSQL Database

1. Click **"New +"** → **"PostgreSQL"**
2. Copy the **Internal Database URL** to `DATABASE_URL` environment variable

#### Step 4: Auto-Deploy

Render auto-deploys on every push to `main` branch.

#### Step 5: GitHub Actions (Optional)

Use `.github/workflows/deploy-backend-render.yml`

**Required Secrets:**
- `RENDER_API_KEY` - Get from [Render Dashboard → Account Settings → API Keys](https://dashboard.render.com/account/api-keys)
- `RENDER_BACKEND_SERVICE_ID` - Get from Render service URL: `https://dashboard.render.com/web/[SERVICE_ID]`

---

### 4. Frontend: GitHub Pages (Static Export)

**Note**: Next.js requires static export for GitHub Pages.

#### Step 1: Update `next.config.mjs`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',  // Enable static export
    images: {
        unoptimized: true,  // Required for static export
    },
    reactStrictMode: true,
};

export default nextConfig;
```

#### Step 2: Create GitHub Actions Workflow

Use `.github/workflows/deploy-gh-pages.yml` (create if needed):

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        working-directory: ./frontend
        
      - name: Build
        run: npm run build
        working-directory: ./frontend
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
          
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/out
```

#### Step 3: Enable GitHub Pages

1. Go to GitHub repository → **Settings** → **Pages**
2. Source: **"GitHub Actions"**
3. Your site will be available at: `https://your-username.github.io/aelvynor`

---

## 🔐 Setting Up GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

### Required Secrets:

| Secret Name | Description | Where to Get |
|------------|-------------|--------------|
| `VERCEL_TOKEN` | Vercel API token | [Vercel Settings → Tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel organization ID | Vercel dashboard URL or API |
| `VERCEL_PROJECT_ID` | Vercel project ID | Vercel project settings |
| `RENDER_API_KEY` | Render API key | [Render Dashboard → API Keys](https://dashboard.render.com/account/api-keys) |
| `RENDER_BACKEND_SERVICE_ID` | Render backend service ID | Render service URL |
| `RAILWAY_TOKEN` | Railway API token | [Railway Dashboard → Settings → Tokens](https://railway.app/account/tokens) |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Your deployed backend URL |
| `DATABASE_URL` | PostgreSQL connection string | Provided by hosting platform |
| `SECRET_KEY` | JWT secret key | Generate with: `python -c "import secrets; print(secrets.token_urlsafe(32))"` |

---

## 🔄 Post-Deployment Checklist

### Backend:

- [ ] Verify API is accessible: `https://your-backend-url.com/api/health`
- [ ] Check API docs: `https://your-backend-url.com/docs`
- [ ] Run database migrations: `alembic upgrade head`
- [ ] Create admin user: `python scripts/create_admin.py`
- [ ] Test admin login at: `https://your-backend-url.com/api/admin/login`
- [ ] Verify CORS allows frontend origin
- [ ] Test file uploads work correctly

### Frontend:

- [ ] Verify site loads: `https://your-frontend-url.com`
- [ ] Check API connection (open browser console, check for errors)
- [ ] Test admin login flow
- [ ] Verify all pages load correctly
- [ ] Check images and assets load
- [ ] Test form submissions
- [ ] Verify file uploads work

---

## 🐛 Troubleshooting

### Backend Issues:

**Port Error:**
```bash
# Make sure your start command uses $PORT environment variable
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Database Connection Error:**
- Verify `DATABASE_URL` is set correctly
- Check if PostgreSQL is running
- Ensure migrations are run: `alembic upgrade head`

**CORS Error:**
- Add frontend URL to `CORS_ORIGINS` environment variable
- Format: `https://frontend-url.com,https://another-url.com`

### Frontend Issues:

**API Connection Error:**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check browser console for CORS errors
- Ensure backend is running and accessible

**Build Errors:**
- Check `next.config.mjs` configuration
- Verify all environment variables are set
- Check build logs in deployment platform

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)

---

## 🆘 Need Help?

If you encounter issues:

1. Check deployment logs in your hosting platform
2. Verify all environment variables are set
3. Ensure database migrations are run
4. Check GitHub Actions logs if using CI/CD

---

**Last Updated:** December 2025

