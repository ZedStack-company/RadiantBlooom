# 🚀 Radiant Bloom Backend Deployment Guide for Digital Ocean

This guide will help you deploy your Radiant Bloom backend API to Digital Ocean using various methods.

## 📋 Prerequisites

- Digital Ocean account
- MongoDB Atlas account (already configured)
- Cloudinary account (for image storage)
- Domain name (optional, for production)

## 🔧 Environment Configuration

### MongoDB Atlas Setup ✅
Your MongoDB Atlas URI is already configured:
```
mongodb+srv://falak:dxsHJSsjJUtZLs6Z@cluster0.psvhihm.mongodb.net/RadiantBloom?retryWrites=true&w=majority&appName=Cluster0
```

### Required Environment Variables
Create a `.env` file in the Backend directory with the following variables:

```env
# Environment
NODE_ENV=production

# Server Configuration
PORT=5000
HOST=0.0.0.0

# MongoDB Atlas (Already configured)
MONGODB_URI=mongodb+srv://falak:dxsHJSsjJUtZLs6Z@cluster0.psvhihm.mongodb.net/RadiantBloom?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration (CHANGE THESE!)
JWT_SECRET=your-super-secure-jwt-secret-key-change-this-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-change-this-in-production
JWT_REFRESH_EXPIRE=30d

# Cloudinary Configuration (UPDATE THESE!)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# CORS Origins (UPDATE WITH YOUR FRONTEND URL)
FRONTEND_URL=https://your-frontend-domain.com
ALLOWED_ORIGINS=https://your-frontend-domain.com,http://localhost:3000,http://localhost:8080

# Security (CHANGE THESE!)
BCRYPT_ROUNDS=12
COOKIE_SECRET=your-super-secure-cookie-secret-change-this-in-production

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🌊 Digital Ocean Deployment Options

### Option 1: Digital Ocean App Platform (Recommended)

#### Step 1: Prepare Your Repository
1. Push your code to GitHub/GitLab
2. Make sure the Backend folder is in the root of your repository

#### Step 2: Create App on Digital Ocean
1. Go to [Digital Ocean App Platform](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect your GitHub repository
4. Select the Backend folder as the source directory

#### Step 3: Configure App Settings
1. **Name**: `radiant-bloom-api`
2. **Region**: Choose closest to your users
3. **Plan**: Basic ($5/month) or Professional
4. **Source Directory**: `Backend`
5. **Build Command**: `npm ci --only=production`
6. **Run Command**: `node server.js`

#### Step 4: Environment Variables
Add all the environment variables from the `.env` file in the App Platform interface.

#### Step 5: Deploy
Click "Create Resources" and wait for deployment.

### Option 2: Digital Ocean Droplet (VPS)

#### Step 1: Create a Droplet
1. Go to [Digital Ocean Droplets](https://cloud.digitalocean.com/droplets)
2. Click "Create Droplet"
3. Choose Ubuntu 22.04 LTS
4. Select Basic plan ($6/month minimum)
5. Add SSH key for secure access
6. Create droplet

#### Step 2: Connect to Your Droplet
```bash
ssh root@your-droplet-ip
```

#### Step 3: Install Required Software
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Install Git
apt install git -y

# Install Nginx (for reverse proxy)
apt install nginx -y

# Install UFW (firewall)
apt install ufw -y
```

#### Step 4: Deploy Your Application
```bash
# Clone your repository
git clone https://github.com/yourusername/your-repo.git
cd your-repo/Backend

# Install dependencies
npm ci --only=production

# Create .env file
nano .env
# Add all environment variables here

# Start application with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### Step 5: Configure Nginx (Reverse Proxy)
```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/radiant-bloom-api

# Add the following configuration:
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable the site
ln -s /etc/nginx/sites-available/radiant-bloom-api /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### Step 6: Configure Firewall
```bash
# Configure UFW
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 5000
ufw --force enable
```

### Option 3: Docker Deployment

#### Step 1: Install Docker on Droplet
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y
```

#### Step 2: Deploy with Docker
```bash
# Clone repository
git clone https://github.com/yourusername/your-repo.git
cd your-repo/Backend

# Create .env file
nano .env

# Build and run with Docker Compose
docker-compose up -d --build
```

## 🔒 Security Configuration

### 1. Update JWT Secrets
Generate strong secrets:
```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate cookie secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Configure Cloudinary
1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copy your Cloud Name, API Key, and API Secret
3. Update the environment variables

### 3. SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d your-domain.com

# Auto-renewal
crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring and Maintenance

### PM2 Commands
```bash
# Check status
pm2 status

# View logs
pm2 logs radiant-bloom-api

# Restart application
pm2 restart radiant-bloom-api

# Stop application
pm2 stop radiant-bloom-api

# Monitor resources
pm2 monit
```

### Health Check
Test your API:
```bash
curl http://your-domain.com/api/health
```

Expected response:
```json
{
  "status": "success",
  "message": "Radiant Bloom API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "production"
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port 5000
   lsof -i :5000
   # Kill the process
   kill -9 PID
   ```

2. **MongoDB Connection Failed**
   - Check if MongoDB Atlas IP whitelist includes your server IP
   - Verify connection string is correct
   - Check network connectivity

3. **CORS Issues**
   - Update `ALLOWED_ORIGINS` in environment variables
   - Ensure frontend URL is included

4. **PM2 Not Starting**
   ```bash
   # Check PM2 logs
   pm2 logs
   # Reset PM2
   pm2 kill
   pm2 start ecosystem.config.js --env production
   ```

## 📈 Performance Optimization

### 1. Enable Gzip Compression
Already configured in server.js

### 2. Rate Limiting
Already configured with 100 requests per 15 minutes

### 3. Database Indexing
Ensure MongoDB indexes are created for frequently queried fields

### 4. Caching
Consider implementing Redis for session storage and caching

## 🔄 Updates and Maintenance

### Updating Your Application
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm ci --only=production

# Restart application
pm2 restart radiant-bloom-api
```

### Backup Strategy
1. **Database**: MongoDB Atlas provides automatic backups
2. **Code**: Use Git for version control
3. **Environment**: Keep `.env` file backed up securely

## 📞 Support

If you encounter any issues:
1. Check the logs: `pm2 logs radiant-bloom-api`
2. Verify environment variables
3. Test database connectivity
4. Check firewall settings

## 🎉 Success!

Once deployed, your API will be available at:
- **App Platform**: `https://your-app-name.ondigitalocean.app`
- **Droplet**: `http://your-domain.com` or `http://your-droplet-ip:5000`

Your MongoDB Atlas database is already configured and ready to use! 🚀
