# 🚀 Quick Deploy Guide - Render Platform

Your code is now on GitHub! Follow these steps to deploy both backend and frontend on Render.

## ✅ Step 1: Deploy on Render

### Option A: Automatic Deployment (Using .render.yaml) ⭐ RECOMMENDED

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Sign up/Login** with your GitHub account
3. **Click "New +"** → **"Blueprint"**
4. **Connect GitHub Repository**: 
   - Select: `Anandhusnair007/aelvynor`
   - Click "Apply"
5. **Render will automatically detect `.render.yaml`** and create both services!

### Option B: Manual Setup (Step by Step)

#### Deploy Backend:

1. **Go to**: https://dashboard.render.com → **"New +"** → **"Web Service"**
2. **Connect GitHub**: Select `Anandhusnair007/aelvynor`
3. **Configure**:
   - **Name**: `aelvynor-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. **Add PostgreSQL Database**:
   - Click **"New +"** → **"PostgreSQL"**
   - Name: `aelvynor-db`
   - Copy the **Internal Database URL**
5. **Set Environment Variables**:
   ```
   DATABASE_URL=[paste the PostgreSQL URL from above]
   SECRET_KEY=[generate with: python -c "import secrets; print(secrets.token_urlsafe(32))"]
   CORS_ORIGINS=https://aelvynor-frontend.onrender.com,http://localhost:3000
   ENVIRONMENT=production
   DEBUG=false
   ```
6. **Click "Create Web Service"**

#### Deploy Frontend:

1. **Go to**: https://dashboard.render.com → **"New +"** → **"Web Service"**
2. **Connect GitHub**: Select `Anandhusnair007/aelvynor`
3. **Configure**:
   - **Name**: `aelvynor-frontend`
   - **Root Directory**: `frontend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. **Set Environment Variables**:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://aelvynor-backend.onrender.com
   ```
5. **Click "Create Web Service"**

---

## ✅ Step 2: Run Database Migrations

After backend is deployed:

1. Go to your backend service on Render
2. Click **"Shell"** tab
3. Run:
   ```bash
   cd backend
   alembic upgrade head
   ```
4. Or add a **One-Off Service**:
   - **New +** → **"Shell Command"**
   - Command: `cd backend && alembic upgrade head`
   - Click "Run"

---

## ✅ Step 3: Create Admin User

After migrations are done:

1. Go to backend service → **"Shell"** tab
2. Run:
   ```bash
   cd backend
   python scripts/create_admin.py --username admin@gmail.com --password cyberdrift
   ```

---

## ✅ Step 4: Update Frontend Backend URL

1. Go to frontend service → **"Environment"** tab
2. Update `NEXT_PUBLIC_API_URL` to your backend URL:
   ```
   NEXT_PUBLIC_API_URL=https://aelvynor-backend.onrender.com
   ```
3. Click **"Save Changes"** → Service will redeploy automatically

---

## ✅ Step 5: Verify Deployment

### Backend:
- ✅ API Health: `https://aelvynor-backend.onrender.com/api/health`
- ✅ API Docs: `https://aelvynor-backend.onrender.com/docs`
- ✅ Admin Login: `https://aelvynor-backend.onrender.com/api/admin/login`

### Frontend:
- ✅ Site: `https://aelvynor-frontend.onrender.com`
- ✅ Admin Panel: `https://aelvynor-frontend.onrender.com/admin/login`

---

## 🔐 Generate Secrets (If Needed)

### Generate SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Generate Password Hash:
```bash
cd backend
python hash_password.py
# Enter password when prompted
```

---

## 📝 Important Notes

1. **Free Tier**: Render free tier spins down after 15 minutes of inactivity. Upgrade to paid plan for 24/7 uptime.

2. **Database**: PostgreSQL database persists data. Free tier has limitations.

3. **CORS**: Make sure `CORS_ORIGINS` includes your frontend URL.

4. **Auto-Deploy**: Every push to `main` branch will auto-deploy (if enabled).

---

## 🆘 Troubleshooting

### Backend not starting:
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure database is running

### Frontend can't connect to backend:
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings in backend
- Check browser console for errors

### Database migration fails:
- Ensure PostgreSQL is running
- Check `DATABASE_URL` is correct
- Verify migrations are in `backend/alembic/versions/`

---

## 🎉 Success!

Once deployed, your application will be live at:
- **Frontend**: `https://aelvynor-frontend.onrender.com`
- **Backend**: `https://aelvynor-backend.onrender.com`
- **API Docs**: `https://aelvynor-backend.onrender.com/docs`

---

**Need Help?** Check `DEPLOYMENT.md` for detailed instructions.

