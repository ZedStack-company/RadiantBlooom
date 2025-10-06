@echo off
REM Radiant Bloom Backend Deployment Script for Digital Ocean (Windows)
REM Make sure to run this script from the Backend directory

echo 🚀 Starting Radiant Bloom Backend Deployment...

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] Please run this script from the Backend directory
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo [SUCCESS] Node.js version check passed
node --version

REM Install dependencies
echo [INFO] Installing dependencies...
call npm ci --only=production

if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)

echo [SUCCESS] Dependencies installed successfully

REM Create logs directory
echo [INFO] Creating logs directory...
if not exist "logs" mkdir logs

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo [INFO] Creating .env file...
    (
        echo NODE_ENV=production
        echo PORT=5000
        echo HOST=0.0.0.0
        echo MONGODB_URI=mongodb+srv://falak:dxsHJSsjJUtZLs6Z@cluster0.psvhihm.mongodb.net/RadiantBloom?retryWrites=true^&w=majority^&appName=Cluster0
        echo JWT_SECRET=your-super-secure-jwt-secret-key-change-this-in-production
        echo JWT_EXPIRE=7d
        echo CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
        echo CLOUDINARY_API_KEY=your-cloudinary-api-key
        echo CLOUDINARY_API_SECRET=your-cloudinary-api-secret
    ) > .env
    echo [WARNING] Please update the .env file with your actual configuration values
)

REM Install PM2 globally if not already installed
pm2 --version >nul 2>&1
if errorlevel 1 (
    echo [INFO] Installing PM2...
    call npm install -g pm2
)

REM Stop existing PM2 processes
echo [INFO] Stopping existing PM2 processes...
pm2 stop radiant-bloom-api 2>nul
pm2 delete radiant-bloom-api 2>nul

REM Start the application with PM2
echo [INFO] Starting application with PM2...
pm2 start ecosystem.config.js --env production

if errorlevel 1 (
    echo [ERROR] Failed to start application with PM2
    exit /b 1
)

REM Save PM2 configuration
pm2 save

echo [SUCCESS] Application started successfully!

REM Show application status
echo [INFO] Application Status:
pm2 status

echo [SUCCESS] Deployment completed successfully!
echo [INFO] Your API should be running on port 5000
echo [INFO] Health check: curl http://localhost:5000/api/health
echo [WARNING] Don't forget to:
echo [WARNING] 1. Update your .env file with actual configuration values
echo [WARNING] 2. Configure your firewall to allow port 5000
echo [WARNING] 3. Set up a reverse proxy (nginx) for production
echo [WARNING] 4. Configure SSL certificates

pause
