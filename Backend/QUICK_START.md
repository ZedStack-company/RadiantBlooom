# 🚀 Radiant Bloom Backend - Quick Start Guide

## ✅ What's Already Configured

- **MongoDB Atlas**: Connected to your cluster
- **Production Environment**: Ready for deployment
- **Security**: JWT secrets generated
- **PM2**: Process manager installed
- **Docker**: Containerization ready

## 🎯 Quick Deployment (3 Steps)

### Step 1: Update Configuration
```bash
# Edit the .env file with your actual values
nano .env
```

**Required Updates:**
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key  
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
- `FRONTEND_URL` - Your frontend domain (e.g., https://yourdomain.com)
- `ALLOWED_ORIGINS` - Add your frontend URL

### Step 2: Install Dependencies
```bash
npm ci --only=production
```

### Step 3: Start the Server
```bash
# Using PM2 (Recommended for production)
pm2 start ecosystem.config.js --env production

# Or using Docker
docker-compose up -d --build

# Or directly with Node.js
npm start
```

## 🧪 Test Your API

```bash
# Health check
curl http://localhost:5000/api/health

# Expected response:
{
  "status": "success",
  "message": "Radiant Bloom API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "production"
}
```

## 📊 Monitor Your Application

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs radiant-bloom-api

# Monitor resources
pm2 monit

# Restart if needed
pm2 restart radiant-bloom-api
```

## 🌐 Your API Endpoints

- **Base URL**: `http://your-domain.com/api`
- **Health Check**: `GET /api/health`
- **Authentication**: `POST /api/auth/login`
- **Products**: `GET /api/products`
- **Categories**: `GET /api/categories`
- **Orders**: `POST /api/orders`

## 🔧 Environment Variables

Your `.env` file contains:
- ✅ MongoDB Atlas URI (configured)
- ✅ JWT secrets (generated)
- ⚠️ Cloudinary credentials (needs your values)
- ⚠️ Frontend URL (needs your domain)

## 📱 Frontend Integration

Update your frontend to use:
```javascript
const API_BASE_URL = 'http://your-domain.com/api';
// or for local testing:
const API_BASE_URL = 'http://localhost:5000/api';
```

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000
# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### PM2 Issues
```bash
# Reset PM2
pm2 kill
pm2 start ecosystem.config.js --env production
```

### Database Connection
- Check MongoDB Atlas IP whitelist
- Verify connection string
- Test network connectivity

## 📖 Full Documentation

For detailed deployment instructions, see:
- `DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `ecosystem.config.js` - PM2 configuration
- `docker-compose.yml` - Docker configuration
- `Dockerfile` - Container configuration

## 🎉 You're Ready!

Your Radiant Bloom backend is now configured for production deployment on Digital Ocean! 🚀

**Next Steps:**
1. Deploy to Digital Ocean (see DEPLOYMENT_GUIDE.md)
2. Update your frontend to use the new API URL
3. Configure your domain and SSL certificates
4. Monitor your application performance
