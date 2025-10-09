@echo off
REM Quick HTTPS Setup for Radiant Bloom Backend (Windows)
REM Run this on your Windows development machine

echo 🔒 Setting up HTTPS for Radiant Bloom Backend...

REM Check if OpenSSL is available
where openssl >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ OpenSSL not found. Please install OpenSSL first.
    echo 💡 Download from: https://slproweb.com/products/Win32OpenSSL.html
    echo 💡 Or use WSL/Linux subsystem
    pause
    exit /b 1
)

REM Create SSL directories
echo 📁 Creating SSL directories...
if not exist "ssl" mkdir ssl
if not exist "ssl\certs" mkdir ssl\certs
if not exist "ssl\private" mkdir ssl\private

REM Generate self-signed certificate
echo 📜 Generating self-signed SSL certificate...
openssl req -x509 -nodes -days 365 -newkey rsa:2048 ^
    -keyout ssl\private\nginx-selfsigned.key ^
    -out ssl\certs\nginx-selfsigned.crt ^
    -subj "/C=US/ST=State/L=City/O=RadiantBloom/CN=143.110.253.120"

if %errorlevel% neq 0 (
    echo ❌ Failed to generate SSL certificate
    pause
    exit /b 1
)

echo ✅ SSL certificate generated!

REM Update environment variables
echo 🔧 Updating environment variables...
if exist "production.env" (
    REM Remove existing SSL lines
    findstr /v "SSL_CERT_PATH" production.env > temp.env
    findstr /v "SSL_KEY_PATH" temp.env > production.env
    del temp.env
    
    REM Add SSL configuration
    echo. >> production.env
    echo # SSL Configuration >> production.env
    echo SSL_CERT_PATH=ssl\certs\nginx-selfsigned.crt >> production.env
    echo SSL_KEY_PATH=ssl\private\nginx-selfsigned.key >> production.env
    
    echo ✅ Environment variables updated!
) else (
    echo ⚠️  production.env not found, creating it...
    echo # SSL Configuration > production.env
    echo SSL_CERT_PATH=ssl\certs\nginx-selfsigned.crt >> production.env
    echo SSL_KEY_PATH=ssl\private\nginx-selfsigned.key >> production.env
)

REM Stop existing backend
echo 🛑 Stopping existing backend...
pm2 stop radiant-bloom-backend 2>nul
pm2 stop radiant-bloom-backend-https 2>nul

REM Start with HTTPS server
echo 🚀 Starting backend with HTTPS support...
if exist "server-https.js" (
    pm2 start server-https.js --name "radiant-bloom-backend-https"
) else (
    echo ❌ server-https.js not found!
    echo 💡 Please make sure you have the HTTPS server file
    pause
    exit /b 1
)

REM Test HTTPS endpoint
echo 🧪 Testing HTTPS endpoint...
timeout /t 3 /nobreak >nul

REM Test with curl
where curl >nul 2>nul
if %errorlevel% equ 0 (
    echo Testing with curl...
    curl -k https://143.110.253.120:5000/api/health
    echo.
) else (
    echo ⚠️  curl not available, skipping test
)

echo.
echo 🎉 HTTPS setup complete!
echo 🔗 Your backend is now running at: https://143.110.253.120:5000/api
echo 🧪 Test it: curl -k https://143.110.253.120:5000/api/health
echo.
echo ⚠️  Note: This uses a self-signed certificate.
echo    Browsers will show a security warning initially.
echo    Users need to accept the certificate for the first visit.
echo.
echo ✅ Your frontend should now be able to connect to HTTPS backend!

pause
