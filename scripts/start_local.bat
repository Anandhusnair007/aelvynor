@echo off
setlocal

echo 🚀 Starting Aelvynor Local Development Environment...

:: Backend Setup
echo 📦 Setting up Backend...
cd backend
if not exist venv (
    python -m venv venv
)
call venv\Scripts\activate
pip install -r requirements.txt

:: Database Setup
echo 🗄️  Checking Database...
if not exist aelvynor.db (
    echo Creating and seeding database...
    python scripts\seed.py
    python scripts\create_admin.py --username admin --password admin123
)

:: Start Backend
echo 🐍 Starting FastAPI Backend...
start "Aelvynor Backend" cmd /k "venv\Scripts\activate && uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

:: Frontend Setup
echo 🎨 Starting Frontend...
cd ..\frontend
if not exist node_modules (
    call npm install
)
start "Aelvynor Frontend" cmd /k "npm run dev"

echo ✅ All services started!
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000/docs
echo.
echo Close the new terminal windows to stop the servers.
pause
