# Start Local Development Servers (Windows PowerShell)
# Starts both backend and frontend servers for local development

$ErrorActionPreference = "Stop"

# Colors for output (PowerShell)
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$BackendDir = Join-Path $ProjectRoot "backend"
$FrontendDir = Join-Path $ProjectRoot "frontend"

Write-ColorOutput Green "🚀 Starting Aelvynor Local Development Servers"
Write-Output ""

# Check directories
if (-not (Test-Path $BackendDir)) {
    Write-ColorOutput Red "❌ Backend directory not found: $BackendDir"
    exit 1
}

if (-not (Test-Path $FrontendDir)) {
    Write-ColorOutput Red "❌ Frontend directory not found: $FrontendDir"
    exit 1
}

# Check virtual environment
if (-not (Test-Path (Join-Path $BackendDir "venv"))) {
    Write-ColorOutput Yellow "⚠️  Backend virtual environment not found."
    Write-Output "   Run: cd backend && make install (or create manually)"
    exit 1
}

# Check node_modules
if (-not (Test-Path (Join-Path $FrontendDir "node_modules"))) {
    Write-ColorOutput Yellow "⚠️  Frontend dependencies not installed."
    Write-Output "   Run: cd frontend && npm install"
    exit 1
}

# Function to cleanup
function Cleanup {
    Write-Output ""
    Write-ColorOutput Yellow "🛑 Shutting down servers..."
    
    if ($BackendJob) {
        Stop-Job $BackendJob -ErrorAction SilentlyContinue
        Remove-Job $BackendJob -ErrorAction SilentlyContinue
    }
    
    if ($FrontendJob) {
        Stop-Job $FrontendJob -ErrorAction SilentlyContinue
        Remove-Job $FrontendJob -ErrorAction SilentlyContinue
    }
    
    # Kill processes on ports
    Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | 
        ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
    
    Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | 
        ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
    
    Write-ColorOutput Green "✅ Servers stopped"
}

# Register cleanup on exit
Register-EngineEvent PowerShell.Exiting -Action { Cleanup } | Out-Null

# Check ports
$Port8000 = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($Port8000) {
    Write-ColorOutput Yellow "⚠️  Port 8000 is already in use"
    $response = Read-Host "   Kill existing process? (y/N)"
    if ($response -eq "y" -or $response -eq "Y") {
        $Port8000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
        Start-Sleep -Seconds 1
    } else {
        Write-ColorOutput Red "❌ Cannot start backend. Port 8000 is in use."
        exit 1
    }
}

$Port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($Port3000) {
    Write-ColorOutput Yellow "⚠️  Port 3000 is already in use"
    $response = Read-Host "   Kill existing process? (y/N)"
    if ($response -eq "y" -or $response -eq "Y") {
        $Port3000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
        Start-Sleep -Seconds 1
    } else {
        Write-ColorOutput Red "❌ Cannot start frontend. Port 3000 is in use."
        exit 1
    }
}

# Start Backend
Write-ColorOutput Green "📦 Starting Backend Server..."
Set-Location $BackendDir

$VenvPython = Join-Path $BackendDir "venv\Scripts\python.exe"
if (-not (Test-Path $VenvPython)) {
    Write-ColorOutput Red "❌ Python executable not found in venv"
    exit 1
}

Write-Output "   Backend: http://localhost:8000"
Write-Output "   API Docs: http://localhost:8000/docs"

$BackendJob = Start-Job -ScriptBlock {
    param($PythonPath, $BackendDir)
    Set-Location $BackendDir
    & $PythonPath -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
} -ArgumentList $VenvPython, $BackendDir

Start-Sleep -Seconds 3

if ($BackendJob.State -eq "Failed") {
    Write-ColorOutput Red "❌ Backend failed to start"
    Receive-Job $BackendJob
    exit 1
}

Write-ColorOutput Green "✅ Backend started (Job ID: $($BackendJob.Id))"
Write-Output ""

# Start Frontend
Write-ColorOutput Green "🎨 Starting Frontend Server..."
Set-Location $FrontendDir

# Check for .env.local
$EnvLocal = Join-Path $FrontendDir ".env.local"
if (-not (Test-Path $EnvLocal)) {
    Write-ColorOutput Yellow "⚠️  .env.local not found. Creating..."
    "NEXT_PUBLIC_API_URL=http://localhost:8000" | Out-File -FilePath $EnvLocal -Encoding utf8
}

Write-Output "   Frontend: http://localhost:3000"

$FrontendJob = Start-Job -ScriptBlock {
    param($FrontendDir)
    Set-Location $FrontendDir
    npm run dev
} -ArgumentList $FrontendDir

Start-Sleep -Seconds 5

if ($FrontendJob.State -eq "Failed") {
    Write-ColorOutput Red "❌ Frontend failed to start"
    Receive-Job $FrontendJob
    Stop-Job $BackendJob -ErrorAction SilentlyContinue
    Remove-Job $BackendJob -ErrorAction SilentlyContinue
    exit 1
}

Write-ColorOutput Green "✅ Frontend started (Job ID: $($FrontendJob.Id))"
Write-Output ""

# Display status
Write-Output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-ColorOutput Green "✅ Both servers are running!"
Write-Output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Output ""
Write-Output "📍 Access Points:"
Write-Output "   Frontend:  http://localhost:3000"
Write-Output "   Backend:   http://localhost:8000"
Write-Output "   API Docs:  http://localhost:8000/docs"
Write-Output "   Health:    http://localhost:8000/health"
Write-Output ""
Write-Output "📋 View Logs:"
Write-Output "   Backend:  Receive-Job $($BackendJob.Id)"
Write-Output "   Frontend: Receive-Job $($FrontendJob.Id)"
Write-Output ""
Write-ColorOutput Yellow "Press Ctrl+C to stop both servers"
Write-Output ""

# Wait for user interrupt
try {
    while ($true) {
        Start-Sleep -Seconds 1
        # Check if jobs are still running
        if ($BackendJob.State -eq "Failed" -or $FrontendJob.State -eq "Failed") {
            Write-ColorOutput Red "❌ One or more servers stopped unexpectedly"
            if ($BackendJob.State -eq "Failed") {
                Write-Output "Backend error:"
                Receive-Job $BackendJob
            }
            if ($FrontendJob.State -eq "Failed") {
                Write-Output "Frontend error:"
                Receive-Job $FrontendJob
            }
            break
        }
    }
} finally {
    Cleanup
}

