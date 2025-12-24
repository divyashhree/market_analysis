@echo off
REM Macro Market Analyzer - Setup Script for Windows
REM This script automates the initial setup process

echo ===============================================
echo    Macro Market Analyzer - Setup Script
echo ===============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [X] Node.js is not installed. Please install Node.js 18+ first.
    echo     Download from: https://nodejs.org
    exit /b 1
)

echo [OK] Node.js detected
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [X] npm is not installed. Please install npm first.
    exit /b 1
)

echo [OK] npm detected
echo.

REM Setup Backend
echo [*] Setting up backend...
cd backend

if not exist ".env" (
    echo     Creating .env file from template...
    copy .env.example .env >nul
    echo     [OK] .env file created
) else (
    echo     [i] .env file already exists
)

echo     Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo     [X] Failed to install backend dependencies
    exit /b 1
)
echo     [OK] Backend dependencies installed

cd ..
echo.

REM Setup Frontend
echo [*] Setting up frontend...
cd frontend

if not exist ".env.local" (
    echo     Creating .env.local file from template...
    copy .env.example .env.local >nul
    echo     [OK] .env.local file created
) else (
    echo     [i] .env.local file already exists
)

echo     Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo     [X] Failed to install frontend dependencies
    exit /b 1
)
echo     [OK] Frontend dependencies installed

cd ..
echo.

REM Summary
echo ===============================================
echo    Setup Complete! 🎉
echo ===============================================
echo.
echo To start the application:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   npm start
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo Then open http://localhost:3000 in your browser
echo.
echo For more information, see:
echo   - QUICKSTART.md for detailed instructions
echo   - README.md for full documentation
echo   - API_DOCUMENTATION.md for API reference
echo.
pause
