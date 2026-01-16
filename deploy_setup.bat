@echo off
echo ========================================
echo SymptomAI - Deployment Setup Script
echo ========================================
echo.

echo Step 1: Checking Git installation...
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo ✓ Git is installed
echo.

echo Step 2: Initializing Git repository...
if exist .git (
    echo ✓ Git repository already initialized
) else (
    git init
    echo ✓ Git repository initialized
)
echo.

echo Step 3: Adding files to Git...
git add .
echo ✓ Files added
echo.

echo Step 4: Creating initial commit...
git commit -m "Initial commit - SymptomAI ready for deployment" >nul 2>&1
if errorlevel 1 (
    echo ℹ No changes to commit or already committed
) else (
    echo ✓ Initial commit created
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo.
echo 1. Create a GitHub repository:
echo    - Go to: https://github.com/new
echo    - Name: symptom-ai
echo    - Keep it PUBLIC
echo    - DO NOT initialize with README
echo.
echo 2. Push your code (replace YOUR_USERNAME):
echo    git remote add origin https://github.com/YOUR_USERNAME/symptom-ai.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Deploy Backend to Render:
echo    - Go to: https://render.com/dashboard
echo    - Click "New +" → "Web Service"
echo    - Connect your GitHub repo
echo    - Root Directory: backend
echo    - Build Command: pip install -r requirements.txt
echo    - Start Command: gunicorn api_server:app
echo.
echo 4. Deploy Frontend to Vercel:
echo    - Go to: https://vercel.com/dashboard
echo    - Click "Add New..." → "Project"
echo    - Import your GitHub repo
echo    - Root Directory: ai-web
echo    - Add Environment Variable:
echo      NEXT_PUBLIC_API_URL = your-render-backend-url
echo.
echo 5. Read DEPLOYMENT_GUIDE.md for detailed instructions
echo.
echo ========================================
pause
