# GitHub Hosting & Deployment Setup

This guide will help you set up GitHub Actions for automated testing and deployment of both backend and frontend.

## 📦 What's Included

This repository includes:

1. **CI/CD Workflows** - Automated testing and deployment
2. **Multiple Deployment Options** - Vercel, Railway, Render, GitHub Pages
3. **Environment Variable Templates** - Secure configuration

---

## 🚀 Quick Start

### Step 1: Push Code to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Aelvynor platform with CI/CD"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/your-username/aelvynor.git

# Push to main branch
git push -u origin main
```

### Step 2: Configure GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

#### Required Secrets for Deployment:

| Secret | Description | How to Get |
|--------|-------------|------------|
| `NEXT_PUBLIC_API_URL` | Your backend API URL | `https://your-backend.railway.app` or `https://your-backend.onrender.com` |
| `SECRET_KEY` | JWT secret key | Generate: `python -c "import secrets; print(secrets.token_urlsafe(32))"` |
| `DATABASE_URL` | PostgreSQL connection string | Provided by hosting platform |
| `VERCEL_TOKEN` | Vercel API token (if using Vercel) | [Vercel Settings](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel organization ID (if using Vercel) | Vercel dashboard |
| `VERCEL_PROJECT_ID` | Vercel project ID (if using Vercel) | Vercel project settings |
| `RENDER_API_KEY` | Render API key (if using Render) | [Render Dashboard](https://dashboard.render.com/account/api-keys) |
| `RENDER_BACKEND_SERVICE_ID` | Render service ID (if using Render) | Render service URL |
| `RAILWAY_TOKEN` | Railway API token (if using Railway) | [Railway Dashboard](https://railway.app/account/tokens) |

---

## 🔄 Automated Workflows

### 1. Backend CI (`.github/workflows/backend-ci.yml`)

**Runs on:** Every push/PR to `main` or `develop` branches

**What it does:**
- ✅ Runs tests on Python 3.11 and 3.12
- ✅ Checks code formatting (Black)
- ✅ Lints code (Flake8)
- ✅ Type checking (MyPy)

**No secrets required** - Only runs tests locally

### 2. Frontend CI (`.github/workflows/frontend-ci.yml`)

**Runs on:** Every push/PR to `main` or `develop` branches

**What it does:**
- ✅ Installs dependencies
- ✅ Runs linter
- ✅ Type checks TypeScript
- ✅ Builds Next.js application
- ✅ Uploads build artifacts

**Secrets needed:**
- `NEXT_PUBLIC_API_URL` (optional, uses default if not set)

### 3. Deploy Backend to Render (`.github/workflows/deploy-backend-render.yml`)

**Runs on:** Push to `main` branch (only backend changes)

**What it does:**
- 🚀 Triggers Render deployment automatically

**Secrets needed:**
- `RENDER_API_KEY`
- `RENDER_BACKEND_SERVICE_ID`

### 4. Deploy Frontend to Vercel (`.github/workflows/deploy-frontend-vercel.yml`)

**Runs on:** Push to `main` branch (only frontend changes)

**What it does:**
- 🚀 Deploys to Vercel production

**Secrets needed:**
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### 5. Deploy to Railway (`.github/workflows/deploy-railway.yml`)

**Runs on:** Push to `main` branch or manual trigger

**What it does:**
- 🚀 Deploys both backend and frontend to Railway

**Secrets needed:**
- `RAILWAY_TOKEN`

### 6. Deploy to GitHub Pages (`.github/workflows/deploy-gh-pages.yml`)

**Runs on:** Push to `main` branch (only frontend changes)

**What it does:**
- 🚀 Builds static site and deploys to GitHub Pages

**Secrets needed:**
- `NEXT_PUBLIC_API_URL`

**Note:** Requires enabling GitHub Pages in repository settings:
1. Go to **Settings** → **Pages**
2. Source: **"GitHub Actions"**

---

## 📝 Setting Up Each Platform

### Option A: Vercel (Frontend) + Railway (Backend) ⭐ Recommended

#### Frontend on Vercel:

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import GitHub repository
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: Next.js (auto-detected)
   - **Build Command**: `npm run build`
5. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.railway.app`
6. Deploy!

#### Backend on Railway:

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select repository → Select **"backend"** directory
4. Railway auto-detects Python and sets up
5. Add PostgreSQL database:
   - **New** → **Database** → **Add PostgreSQL**
6. Set environment variables:
   - `SECRET_KEY` (generate a strong key)
   - `CORS_ORIGINS` (your Vercel frontend URL)
   - `ENVIRONMENT=production`
7. Run migrations: Create a one-time service with command: `cd backend && alembic upgrade head`
8. Deploy!

### Option B: Render (Both Frontend & Backend)

1. Go to [render.com](https://render.com)
2. Create **Web Service** for backend:
   - Connect GitHub repo
   - Root Directory: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Create **Web Service** for frontend:
   - Connect GitHub repo
   - Root Directory: `frontend`
   - Build: `npm install && npm run build`
   - Start: `npm start`
4. Add PostgreSQL database
5. Set environment variables
6. Deploy!

### Option C: GitHub Pages (Frontend) + Render (Backend)

#### Frontend on GitHub Pages:

1. Enable GitHub Pages in repository settings:
   - **Settings** → **Pages** → Source: **"GitHub Actions"**
2. Uncomment static export in `next.config.mjs`:
   ```javascript
   output: 'export',
   ```
3. Push to `main` branch - workflow will auto-deploy
4. Your site will be at: `https://your-username.github.io/aelvynor`

#### Backend on Render:

Follow Option B backend setup above.

---

## 🧪 Testing the Setup

### 1. Test CI Workflows

Create a test commit:

```bash
git checkout -b test-ci
# Make a small change (e.g., add a comment)
git commit -m "test: CI workflows"
git push origin test-ci
```

Go to GitHub → **Actions** tab to see workflows running.

### 2. Test Deployment

Merge to `main`:

```bash
git checkout main
git merge test-ci
git push origin main
```

Check deployment status in:
- **GitHub Actions** tab
- Your hosting platform dashboard

### 3. Verify Deployment

- **Backend**: Visit `https://your-backend-url.com/api/health`
- **Frontend**: Visit your frontend URL
- **API Docs**: Visit `https://your-backend-url.com/docs`

---

## 🔍 Monitoring Workflows

### View Workflow Runs

1. Go to GitHub repository
2. Click **Actions** tab
3. See all workflow runs, their status, and logs

### Workflow Status Badge

Add to your README.md:

```markdown
![CI](https://github.com/your-username/aelvynor/workflows/Backend%20CI/badge.svg)
![CI](https://github.com/your-username/aelvynor/workflows/Frontend%20CI/badge.svg)
```

---

## 🐛 Troubleshooting

### Workflow Fails on Tests

- Check test logs in GitHub Actions
- Run tests locally: `cd backend && pytest tests/`
- Fix failing tests

### Deployment Fails

- Check deployment logs in hosting platform
- Verify all secrets are set correctly
- Check environment variables
- Ensure database is accessible

### Frontend Can't Connect to Backend

- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS settings in backend
- Ensure backend is running and accessible
- Check browser console for errors

---

## 📚 Next Steps

1. ✅ Push code to GitHub
2. ✅ Set up GitHub secrets
3. ✅ Connect to hosting platform (Vercel/Railway/Render)
4. ✅ Enable GitHub Pages (if using)
5. ✅ Test CI/CD workflows
6. ✅ Deploy and verify

---

## 🆘 Need Help?

- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment guides
- Review GitHub Actions logs for errors
- Check hosting platform documentation
- Verify all environment variables are set

---

**Happy Deploying! 🚀**

