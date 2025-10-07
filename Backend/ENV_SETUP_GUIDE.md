# 🔧 Environment Setup Guide for Digital Ocean Deployment

## ✅ Your .env File is Ready!

I've created a production-ready `.env` file for your Digital Ocean deployment with your MongoDB Atlas URI already configured.

## 📋 What's Already Configured

### ✅ **MongoDB Atlas** (Ready to Use)
```
MONGODB_URI=mongodb+srv://falak:dxsHJSsjJUtZLs6Z@cluster0.psvhihm.mongodb.net/RadiantBloom?retryWrites=true&w=majority&appName=Cluster0
```

### ✅ **JWT Security** (Auto-Generated)
- JWT_SECRET: Generated secure secret
- JWT_REFRESH_SECRET: Generated secure secret  
- COOKIE_SECRET: Generated secure secret

### ✅ **Server Configuration**
- PORT: 5000
- HOST: 0.0.0.0 (for Digital Ocean)
- NODE_ENV: production

## ⚠️ **Required Updates** (You Need to Do)

### 1. **Cloudinary Configuration** (REQUIRED)
Update these with your actual Cloudinary credentials:
```env
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

**How to get Cloudinary credentials:**
1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Sign in to your account
3. Copy the values from the Dashboard

### 2. **Frontend URL** (REQUIRED)
Update with your actual frontend domain:
```env
FRONTEND_URL=https://your-actual-domain.com
ALLOWED_ORIGINS=https://your-actual-domain.com,https://www.your-actual-domain.com,http://localhost:3000,http://localhost:8080
```

**Examples:**
- If using Digital Ocean App Platform: `https://your-app-name.ondigitalocean.app`
- If using custom domain: `https://yourdomain.com`
- For local testing: `http://localhost:3000`

## 🚀 **Quick Setup Commands**

### For Windows:
```cmd
# Copy the production template to .env
copy production.env .env

# Edit the .env file
notepad .env
```

### For Linux/macOS:
```bash
# Copy the production template to .env
cp production.env .env

# Edit the .env file
nano .env
```

## 📝 **Step-by-Step Setup**

1. **Open the .env file** in your text editor
2. **Find the Cloudinary section** and replace with your actual credentials
3. **Find the FRONTEND_URL** and replace with your domain
4. **Save the file**

## 🧪 **Test Your Configuration**

After updating the .env file, test your setup:

```bash
# Install dependencies
npm ci --only=production

# Start the server
npm start

# Test the API
curl http://localhost:5000/api/health
```

## 🔒 **Security Notes**

- ✅ JWT secrets are already generated and secure
- ✅ MongoDB Atlas is configured with your credentials
- ⚠️ Update Cloudinary credentials before deployment
- ⚠️ Update frontend URL for CORS security

## 📊 **Environment Variables Reference**

| Variable | Status | Description |
|----------|--------|-------------|
| `MONGODB_URI` | ✅ Ready | Your MongoDB Atlas connection |
| `JWT_SECRET` | ✅ Ready | Auto-generated secure secret |
| `CLOUDINARY_CLOUD_NAME` | ⚠️ Update | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ⚠️ Update | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ⚠️ Update | Your Cloudinary API secret |
| `FRONTEND_URL` | ⚠️ Update | Your frontend domain |
| `ALLOWED_ORIGINS` | ⚠️ Update | CORS allowed origins |

## 🎯 **Next Steps**

1. **Update Cloudinary credentials** in .env file
2. **Update frontend URL** in .env file  
3. **Deploy to Digital Ocean** using the deployment guide
4. **Test your API** endpoints
5. **Update your frontend** to use the new API URL

## 🆘 **Need Help?**

- **Cloudinary Setup**: [Cloudinary Documentation](https://cloudinary.com/documentation)
- **Digital Ocean Deployment**: See `DEPLOYMENT_GUIDE.md`
- **API Testing**: Use Postman or curl commands

Your backend is 90% ready for deployment! Just update the Cloudinary credentials and frontend URL, and you're good to go! 🚀
