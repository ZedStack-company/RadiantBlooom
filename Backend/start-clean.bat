@echo off
echo 🧹 Cleaning up any existing processes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo 🚀 Starting Radiant Bloom Backend Server...
cd /d "%~dp0"
npm run dev
pause
