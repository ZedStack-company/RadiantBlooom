#!/bin/bash

# SSL Setup Script for Radiant Bloom Backend
# This script sets up SSL certificates for HTTPS support

echo "🔒 Setting up SSL certificates for Radiant Bloom Backend..."

# Create SSL directory
sudo mkdir -p /etc/ssl/certs
sudo mkdir -p /etc/ssl/private

# Generate self-signed certificate
echo "📜 Generating self-signed SSL certificate..."

sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/nginx-selfsigned.key \
    -out /etc/ssl/certs/nginx-selfsigned.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=143.110.253.120"

# Set proper permissions
sudo chmod 600 /etc/ssl/private/nginx-selfsigned.key
sudo chmod 644 /etc/ssl/certs/nginx-selfsigned.crt

echo "✅ SSL certificate generated successfully!"
echo "📁 Certificate: /etc/ssl/certs/nginx-selfsigned.crt"
echo "🔑 Private Key: /etc/ssl/private/nginx-selfsigned.key"

# Update environment variables
echo "🔧 Updating environment variables..."

# Add SSL paths to production.env
echo "" >> production.env
echo "# SSL Configuration" >> production.env
echo "SSL_CERT_PATH=/etc/ssl/certs/nginx-selfsigned.crt" >> production.env
echo "SSL_KEY_PATH=/etc/ssl/private/nginx-selfsigned.key" >> production.env

echo "✅ Environment variables updated!"

# Restart the application
echo "🔄 Restarting application with HTTPS support..."

# Stop existing PM2 process
pm2 stop radiant-bloom-backend 2>/dev/null || true

# Start with HTTPS server
pm2 start server-https.js --name "radiant-bloom-backend-https"

echo "🚀 Backend is now running with HTTPS support!"
echo "🔗 API URL: https://143.110.253.120:5000/api"
echo "🧪 Test with: curl -k https://143.110.253.120:5000/api/health"

echo ""
echo "⚠️  Note: This is a self-signed certificate."
echo "   For production, use Let's Encrypt or a trusted CA certificate."
echo ""
echo "🔧 To get a trusted certificate, run:"
echo "   sudo certbot certonly --standalone -d your-domain.com"
echo ""
echo "✅ Setup complete! Your backend now supports HTTPS! 🎉"
