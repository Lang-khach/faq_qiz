@echo off
echo.
echo ========================================
echo Quiz System - Quick Setup (Windows)
echo ========================================
echo.

REM Check Node.js
echo Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js 18+ from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js version: %NODE_VERSION%
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [OK] Dependencies installed
echo.

REM Setup .env.local
echo Setting up environment variables...
if not exist .env.local (
    if exist .env.example (
        copy .env.example .env.local >nul
        echo [OK] Created .env.local from .env.example
        echo.
        echo [WARNING] You need to configure:
        echo    1. GOOGLE_CLIENT_ID
        echo    2. GOOGLE_CLIENT_SECRET
        echo    3. NEXTAUTH_SECRET
        echo    4. Database connection strings
        echo.
        echo Edit .env.local file with your credentials
    ) else (
        echo [ERROR] .env.example not found
        pause
        exit /b 1
    )
) else (
    echo [OK] .env.local already exists
)
echo.

REM Generate NEXTAUTH_SECRET
echo Generating NEXTAUTH_SECRET...
echo Use this PowerShell command to generate a secret:
echo [Convert]::ToBase64String((1..32 ^| ForEach-Object { Get-Random -Maximum 256 }))
echo.
echo Or visit: https://generate-secret.vercel.app/32
echo.

REM Next steps
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Configure Google OAuth:
echo    - Go to: https://console.cloud.google.com/
echo    - Create OAuth 2.0 Client ID
echo    - Add redirect URI: http://localhost:3000/api/auth/callback/google
echo    - Copy Client ID and Secret to .env.local
echo.
echo 2. Setup Database:
echo    Option A: Vercel Postgres (recommended)
echo    - Go to: https://vercel.com/storage
echo    - Create Postgres database
echo    - Copy connection strings to .env.local
echo    - Import schema.sql and seed_questions_314.sql
echo.
echo 3. Start Development Server:
echo    npm run dev
echo.
echo 4. Open Browser:
echo    http://localhost:3000
echo.
echo ========================================
echo [OK] Setup complete!
echo.
echo For detailed instructions, see: LOCAL_DEVELOPMENT.md
echo.
pause
