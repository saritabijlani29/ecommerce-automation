@echo off
REM Amazon Automation - Docker Quick Start Script (Windows)
REM This script helps you quickly run tests using Docker on Windows

echo.
echo 🚀 Amazon Automation - Docker Test Runner
echo ==========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Docker is not installed
    echo Please install Docker Desktop from https://docs.docker.com/desktop/install/windows-install/
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Docker Compose is not installed
    echo Please install Docker Compose from https://docs.docker.com/compose/install/
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo ⚠️  Warning: .env file not found
    echo Creating .env from .env.example...
    copy .env.example .env
    echo ✅ Created .env file
    echo ⚠️  Please edit .env and add your credentials before running tests
    echo.
    pause
)

REM Create artifact directories if they don't exist
echo 📁 Creating artifact directories...
if not exist test-results mkdir test-results
if not exist playwright-report mkdir playwright-report
if not exist screenshots mkdir screenshots
if not exist videos mkdir videos
echo ✅ Directories created
echo.

REM Build Docker image
echo 🔨 Building Docker image...
docker-compose build
if %errorlevel% neq 0 (
    echo ❌ Failed to build Docker image
    exit /b 1
)
echo ✅ Docker image built successfully
echo.

REM Run tests
echo 🧪 Running tests...
docker-compose up --abort-on-container-exit
echo.

REM Check exit code
if %errorlevel% equ 0 (
    echo ✅ Tests completed successfully!
) else (
    echo ❌ Tests failed. Check the logs above for details.
)

echo.
echo 📊 Test artifacts are available in:
echo    - test-results\     (screenshots, videos, traces)
echo    - playwright-report\ (HTML report)
echo.
echo To view the HTML report, run:
echo    npx playwright show-report
echo.
echo Or start the report server:
echo    docker-compose --profile reports up report-server
echo    Then open http://localhost:8080 in your browser
echo.
pause
