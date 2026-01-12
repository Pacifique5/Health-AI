@echo off
echo 🌐 Starting SymptomAI Frontend...
echo ===============================

cd ai-web
echo 📦 Installing Node.js dependencies...
npm install

echo 🔧 Starting Next.js development server...
echo Server will be available at: http://localhost:3001
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause