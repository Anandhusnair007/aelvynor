# GitHub Actions CI/CD Workflow

## Overview

This repository includes a comprehensive CI/CD pipeline that:
- Lints and type-checks the frontend
- Builds the frontend application
- Lints the backend code
- Runs backend tests with PostgreSQL
- Optionally deploys to Render (commented out)

## Workflow Jobs

### Frontend Job
- **Node.js Setup**: Uses Node.js 18 with npm caching
- **Install Dependencies**: Runs `npm ci` for reproducible builds
- **Lint**: Runs ESLint to check code quality
- **Type Check**: Runs TypeScript compiler to verify types
- **Build**: Builds the Next.js application

### Backend Job
- **Python Setup**: Uses Python 3.11 with pip caching
- **Install Dependencies**: Installs from `requirements.txt`
- **Lint**: Runs Ruff linter for code quality
- **Tests**: Runs pytest with coverage reporting
- **PostgreSQL Service**: Uses GitHub Actions PostgreSQL service for testing

### Deploy Job (Optional)
- **Condition**: Only runs on pushes to `main` branch
- **Deploy Backend**: Triggers Render backend service deployment
- **Deploy Frontend**: Triggers Render frontend service deployment
- **Status**: Currently commented out - uncomment when ready

## Required GitHub Secrets

Add these secrets in your GitHub repository settings:
**Settings → Secrets and variables → Actions → New repository secret**

### Required Secrets

1. **`JWT_SECRET`** (Optional for CI, Required for production)
   - Description: Secret key for JWT token signing
   - Example: `your-super-secret-jwt-key-change-in-production`
   - Used in: Backend tests and production deployment

2. **`ADMIN_PASSWORD_HASH`** (Optional for CI)
   - Description: Bcrypt hashed password for admin user
   - How to generate:
     ```bash
     cd backend
     python hash_password.py
     ```
   - Used in: Backend tests

### Optional Secrets (for deployment)

3. **`RENDER_API_KEY`** (Required for deployment)
   - Description: Render.com API key for triggering deployments
   - How to get:
     1. Go to https://dashboard.render.com
     2. Navigate to Account Settings → API Keys
     3. Create a new API key
     4. Copy the key
   - Used in: Deploy job

4. **`RENDER_BACKEND_SERVICE_ID`** (Required for deployment)
   - Description: Render service ID for the backend service
   - How to get:
     1. Go to your backend service on Render
     2. The service ID is in the URL: `https://dashboard.render.com/web/[SERVICE_ID]`
     3. Or check the service settings
   - Used in: Deploy job

5. **`RENDER_FRONTEND_SERVICE_ID`** (Required for deployment)
   - Description: Render service ID for the frontend service
   - How to get: Same as backend service ID
   - Used in: Deploy job

6. **`DATABASE_URL`** (Required for production)
   - Description: PostgreSQL connection string for production database
   - Format: `postgresql://user:password@host:port/database`
   - Used in: Production deployment

7. **`NEXT_PUBLIC_API_URL`** (Optional)
   - Description: Public API URL for frontend build
   - Example: `https://api.aelvynor.com`
   - Used in: Frontend build

## How to Add Secrets

### Via GitHub Web Interface

1. Navigate to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**
5. Enter the secret name and value
6. Click **Add secret**

### Via GitHub CLI

```bash
# Install GitHub CLI if not already installed
# https://cli.github.com/

# Authenticate
gh auth login

# Add secrets
gh secret set JWT_SECRET --body "your-secret-key"
gh secret set RENDER_API_KEY --body "your-render-api-key"
gh secret set DATABASE_URL --body "postgresql://user:pass@host:port/db"
```

## Workflow Triggers

The workflow runs on:
- **Push** to `main` or `develop` branches
- **Pull Requests** targeting `main` or `develop` branches

## Local Testing

### Test Frontend Locally

```bash
cd frontend
npm ci
npm run lint
npm run type-check
npm run build
```

### Test Backend Locally

```bash
cd backend
pip install -r requirements.txt
ruff check .
pytest tests/ -v
```

## Enabling Deployment

To enable automatic deployment to Render:

1. **Uncomment the deploy job** in `.github/workflows/ci.yml`
2. **Add required secrets**:
   - `RENDER_API_KEY`
   - `RENDER_BACKEND_SERVICE_ID`
   - `RENDER_FRONTEND_SERVICE_ID`
3. **Configure Render services**:
   - Ensure your Render services are set up
   - Note the service IDs from the dashboard
4. **Test deployment**:
   - Push to `main` branch
   - Check GitHub Actions logs
   - Verify deployment on Render dashboard

## Troubleshooting

### Frontend Build Fails
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Check for TypeScript errors

### Backend Tests Fail
- Verify PostgreSQL service is running in CI
- Check database connection string
- Ensure test database is properly configured

### Deployment Fails
- Verify Render API key is correct
- Check service IDs are correct
- Ensure Render services are active
- Check Render API rate limits

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Render API Documentation](https://render.com/docs/api)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)

