@echo off
REM Radiant Bloom Frontend - Vercel Deployment Script
REM This script helps you deploy to Vercel with proper configuration

echo 🚀 Radiant Bloom Frontend - Vercel Deployment
echo ============================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] Please run this script from the frontend directory
    pause
    exit /b 1
)

echo [INFO] Building application...
call npm run build

if errorlevel 1 (
    echo [ERROR] Build failed. Please fix errors before deploying.
    pause
    exit /b 1
)

echo [SUCCESS] Build completed successfully!

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo [INFO] Installing Vercel CLI...
    call npm install -g vercel
)

echo [INFO] Deploying to Vercel...
echo [INFO] Make sure you're logged in to Vercel: vercel login
echo.

REM Deploy to Vercel
vercel --prod

if errorlevel 1 (
    echo [ERROR] Deployment failed. Check the error messages above.
    echo [INFO] Try running: vercel login
    echo [INFO] Then run: vercel
) else (
    echo [SUCCESS] Deployment completed successfully!
    echo [INFO] Your app should be live at the URL shown above.
)

echo.
echo [INFO] Environment Variables to set in Vercel Dashboard:
echo VITE_API_URL = https://143.110.253.120:5000/api
echo REACT_APP_API_URL = https://143.110.253.120:5000/api
echo VITE_NODE_ENV = production
echo VITE_APP_NAME = Radiant Bloom
echo VITE_CLOUDINARY_CLOUD_NAME = dkhb7gks0
echo VITE_CLOUDINARY_API_KEY = 435162914895178

pause
