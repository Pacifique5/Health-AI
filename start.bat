@echo off
echo ========================================
echo    SymptomAI - Starting Application
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start "SymptomAI Backend" cmd /k "cd backend && python api_server.py"

timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend Server...
start "SymptomAI Frontend" cmd /k "cd ai-web && npm run dev"

echo.
echo ========================================
echo    SymptomAI Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause > nul
