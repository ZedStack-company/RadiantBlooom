# HTTPS Backend Setup for Digital Ocean

## 🎯 **Solution: Nginx Reverse Proxy with SSL**

We'll set up Nginx as a reverse proxy to handle HTTPS termination and forward requests to your Node.js backend.

## 📋 **Step 1: Install Nginx and Certbot**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Nginx
sudo apt install nginx -y

# Install Certbot for Let's Encrypt SSL certificates
sudo apt install certbot python3-certbot-nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 🔧 **Step 2: Configure Nginx**

Create the Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/radiant-bloom
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name 143.110.253.120;  # Your Digital Ocean IP
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name 143.110.253.120;  # Your Digital Ocean IP
    
    # SSL Configuration (will be updated by Certbot)
    ssl_certificate /etc/letsencrypt/live/143.110.253.120/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/143.110.253.120/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # CORS Headers
    add_header Access-Control-Allow-Origin "https://radiant-blooom.vercel.app" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, PATCH, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization, x-requested-with" always;
    add_header Access-Control-Allow-Credentials "true" always;
    
    # Handle preflight requests
    location / {
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "https://radiant-blooom.vercel.app";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, PATCH, OPTIONS";
            add_header Access-Control-Allow-Headers "Content-Type, Authorization, x-requested-with";
            add_header Access-Control-Allow-Credentials "true";
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type 'text/plain charset=UTF-8';
            add_header Content-Length 0;
            return 204;
        }
        
        # Proxy to Node.js backend
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

## 🔗 **Step 3: Enable the Site**

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/radiant-bloom /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## 🔒 **Step 4: Get SSL Certificate**

```bash
# Get SSL certificate from Let's Encrypt
sudo certbot --nginx -d 143.110.253.120

# Test certificate renewal
sudo certbot renew --dry-run
```

## 🚀 **Step 5: Update Backend Configuration**

Update your backend to work with the reverse proxy:

```bash
# Update production.env
nano production.env
```

Add these settings:

```env
# Trust proxy for Nginx
TRUST_PROXY=1

# Update CORS origins to include HTTPS
FRONTEND_URL=https://radiant-blooom.vercel.app
ALLOWED_ORIGINS=https://radiant-blooom.vercel.app,https://www.radiant-blooom.vercel.app,http://localhost:3000,http://localhost:8080
```

## 🔄 **Step 6: Restart Services**

```bash
# Restart your Node.js backend
pm2 restart radiant-bloom-backend

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx
pm2 status
```

## 🧪 **Step 7: Test HTTPS**

```bash
# Test HTTPS endpoint
curl -k https://143.110.253.120/api/health

# Test from frontend
# Your frontend should now be able to connect to https://143.110.253.120/api
```

## 📝 **Alternative: Self-Signed Certificate (Quick Test)**

If you want to test quickly without Let's Encrypt:

```bash
# Generate self-signed certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/nginx-selfsigned.key \
    -out /etc/ssl/certs/nginx-selfsigned.crt

# Update Nginx config to use self-signed cert
sudo nano /etc/nginx/sites-available/radiant-bloom
```

Update SSL paths:
```nginx
ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;
```

## ✅ **Expected Results**

After setup:
- ✅ Backend accessible at `https://143.110.253.120/api`
- ✅ SSL certificate valid
- ✅ No Mixed Content errors
- ✅ Frontend can connect securely

## 🔧 **Troubleshooting**

```bash
# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Check backend logs
pm2 logs radiant-bloom-backend

# Test SSL
openssl s_client -connect 143.110.253.120:443

# Check firewall
sudo ufw status
sudo ufw allow 'Nginx Full'
```

## 🎯 **Next Steps**

1. Run the setup commands on your Digital Ocean server
2. Update frontend to use `https://143.110.253.120/api`
3. Test the connection
4. Deploy updated frontend to Vercel

This will give you a fully HTTPS-enabled backend! 🚀
