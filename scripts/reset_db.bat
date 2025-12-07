@echo off
REM Reset Database Script (Windows Batch)
REM Deletes the database file, recreates tables, and seeds with sample data

setlocal enabledelayedexpansion

set SCRIPT_DIR=%~dp0
set PROJECT_ROOT=%SCRIPT_DIR%..
set BACKEND_DIR=%PROJECT_ROOT%\backend

echo 🔄 Resetting Database...
echo.

REM Check if backend directory exists
if not exist "%BACKEND_DIR%" (
    echo ❌ Backend directory not found: %BACKEND_DIR%
    exit /b 1
)

cd /d "%BACKEND_DIR%"

REM Check if virtual environment exists
if not exist "venv" (
    echo ❌ Virtual environment not found.
    echo    Run: make install or create manually
    exit /b 1
)

REM Database file path
set DB_FILE=aelvynor.db

REM Confirm deletion
if exist "%DB_FILE%" (
    echo ⚠️  Database file exists: %DB_FILE%
    set /p CONFIRM="   Delete and recreate? (y/N): "
    if /i not "!CONFIRM!"=="y" (
        echo ❌ Cancelled
        exit /b 0
    )
)

REM Step 1: Delete database file
echo 📝 Step 1: Deleting database file...
if exist "%DB_FILE%" (
    del /f "%DB_FILE%"
    echo    ✅ Database file deleted
) else (
    echo    ℹ️  Database file does not exist (first time setup)
)
echo.

REM Step 2: Recreate tables
echo 📝 Step 2: Creating database tables...
call venv\Scripts\activate.bat
python -c "from app.models import create_db_and_tables; from app.deps import engine; create_db_and_tables(engine)"
if errorlevel 1 (
    echo ❌ Failed to create tables
    exit /b 1
)
echo    ✅ Database tables created
echo.

REM Step 3: Seed database
echo 📝 Step 3: Seeding database with sample data...
if exist "scripts\seed.py" (
    python scripts\seed.py
    if errorlevel 1 (
        echo ⚠️  Seeding completed with warnings
    ) else (
        echo    ✅ Database seeded successfully
    )
) else (
    echo ⚠️  Seed script not found: scripts\seed.py
    echo    Skipping seed step
)
echo.

REM Step 4: Create admin user
echo 📝 Step 4: Ensuring admin user exists...
if exist "scripts\create_admin.py" (
    python scripts\create_admin.py --username admin --password admin123
    echo    ✅ Admin user check complete
) else (
    echo ⚠️  Admin creation script not found
)
echo.

REM Summary
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ✅ Database reset complete!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📋 Database Info:
echo    Location: %BACKEND_DIR%\%DB_FILE%
if exist "%DB_FILE%" (
    for %%A in ("%DB_FILE%") do echo    Size: %%~zA bytes
)
echo.
echo 🔐 Admin Credentials:
echo    Username: admin
echo    Password: admin123
echo.
echo 🧪 Test the database:
echo    curl http://localhost:8000/api/public/projects
echo.

endlocal

