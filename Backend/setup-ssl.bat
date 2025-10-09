@echo off
REM SSL Setup Script for Radiant Bloom Backend (Windows)
REM This script sets up SSL certificates for HTTPS support

echo 🔒 Setting up SSL certificates for Radiant Bloom Backend...

REM Create SSL directory
if not exist "ssl" mkdir ssl
if not exist "ssl\certs" mkdir ssl\certs
if not exist "ssl\private" mkdir ssl\private

REM Generate self-signed certificate using OpenSSL
echo 📜 Generating self-signed SSL certificate...

REM Check if OpenSSL is available
where openssl >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ OpenSSL not found. Please install OpenSSL first.
    echo 💡 Download from: https://slproweb.com/products/Win32OpenSSL.html
    pause
    exit /b 1
)

REM Generate certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 ^
    -keyout ssl\private\nginx-selfsigned.key ^
    -out ssl\certs\nginx-selfsigned.crt ^
    -subj "/C=US/ST=State/L=City/O=Organization/CN=143.110.253.120"

if %errorlevel% neq 0 (
    echo ❌ Failed to generate SSL certificate
    pause
    exit /b 1
)

echo ✅ SSL certificate generated successfully!
echo 📁 Certificate: ssl\certs\nginx-selfsigned.crt
echo 🔑 Private Key: ssl\private\nginx-selfsigned.key

REM Update environment variables
echo 🔧 Updating environment variables...

REM Add SSL paths to production.env
echo. >> production.env
echo # SSL Configuration >> production.env
echo SSL_CERT_PATH=ssl\certs\nginx-selfsigned.crt >> production.env
echo SSL_KEY_PATH=ssl\private\nginx-selfsigned.key >> production.env

echo ✅ Environment variables updated!

REM Restart the application
echo 🔄 Restarting application with HTTPS support...

REM Stop existing PM2 process
pm2 stop radiant-bloom-backend 2>nul

REM Start with HTTPS server
pm2 start server-https.js --name "radiant-bloom-backend-https"

echo 🚀 Backend is now running with HTTPS support!
echo 🔗 API URL: https://143.110.253.120:5000/api
echo 🧪 Test with: curl -k https://143.110.253.120:5000/api/health

echo.
echo ⚠️  Note: This is a self-signed certificate.
echo    For production, use Let's Encrypt or a trusted CA certificate.
echo.
echo 🔧 To get a trusted certificate, run:
echo    sudo certbot certonly --standalone -d your-domain.com
echo.
echo ✅ Setup complete! Your backend now supports HTTPS! 🎉

pause
