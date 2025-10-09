#!/bin/bash

# Quick HTTPS Setup for Radiant Bloom Backend
# Run this on your Digital Ocean server

echo "🔒 Setting up HTTPS for Radiant Bloom Backend..."

# Check if we're running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root: sudo ./quick-https-setup.sh"
    exit 1
fi

# Create SSL directories
echo "📁 Creating SSL directories..."
mkdir -p /etc/ssl/certs
mkdir -p /etc/ssl/private

# Generate self-signed certificate
echo "📜 Generating self-signed SSL certificate..."
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/nginx-selfsigned.key \
    -out /etc/ssl/certs/nginx-selfsigned.crt \
    -subj "/C=US/ST=State/L=City/O=RadiantBloom/CN=143.110.253.120"

# Set proper permissions
chmod 600 /etc/ssl/private/nginx-selfsigned.key
chmod 644 /etc/ssl/certs/nginx-selfsigned.crt

echo "✅ SSL certificate generated!"

# Update environment variables
echo "🔧 Updating environment variables..."
if [ -f "production.env" ]; then
    # Remove existing SSL lines
    sed -i '/SSL_CERT_PATH/d' production.env
    sed -i '/SSL_KEY_PATH/d' production.env
    
    # Add SSL configuration
    echo "" >> production.env
    echo "# SSL Configuration" >> production.env
    echo "SSL_CERT_PATH=/etc/ssl/certs/nginx-selfsigned.crt" >> production.env
    echo "SSL_KEY_PATH=/etc/ssl/private/nginx-selfsigned.key" >> production.env
    
    echo "✅ Environment variables updated!"
else
    echo "⚠️  production.env not found, creating it..."
    cat > production.env << EOF
# SSL Configuration
SSL_CERT_PATH=/etc/ssl/certs/nginx-selfsigned.crt
SSL_KEY_PATH=/etc/ssl/private/nginx-selfsigned.key
EOF
fi

# Stop existing backend
echo "🛑 Stopping existing backend..."
pm2 stop radiant-bloom-backend 2>/dev/null || true
pm2 stop radiant-bloom-backend-https 2>/dev/null || true

# Start with HTTPS server
echo "🚀 Starting backend with HTTPS support..."
if [ -f "server-https.js" ]; then
    pm2 start server-https.js --name "radiant-bloom-backend-https"
else
    echo "❌ server-https.js not found!"
    echo "💡 Please make sure you have the HTTPS server file"
    exit 1
fi

# Test HTTPS endpoint
echo "🧪 Testing HTTPS endpoint..."
sleep 3

# Test with curl
if command -v curl &> /dev/null; then
    echo "Testing with curl..."
    curl -k https://143.110.253.120:5000/api/health
    echo ""
else
    echo "⚠️  curl not available, skipping test"
fi

echo ""
echo "🎉 HTTPS setup complete!"
echo "🔗 Your backend is now running at: https://143.110.253.120:5000/api"
echo "🧪 Test it: curl -k https://143.110.253.120:5000/api/health"
echo ""
echo "⚠️  Note: This uses a self-signed certificate."
echo "   Browsers will show a security warning initially."
echo "   Users need to accept the certificate for the first visit."
echo ""
echo "✅ Your frontend should now be able to connect to HTTPS backend!"
