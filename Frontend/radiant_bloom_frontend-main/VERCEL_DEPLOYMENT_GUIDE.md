# 🚀 Vercel Deployment Guide for Radiant Bloom Frontend

## ✅ Production Configuration Complete

Your frontend is now configured for Vercel deployment with your backend API URL: `https://143.110.253.120:5000/api`

## 📁 Files Created/Updated

### ✅ **Configuration Files:**
- `vercel.json` - Vercel deployment configuration
- `production.env` - Production environment variables
- `.env` - Local environment file (copied from production.env)
- `src/config/api.ts` - Centralized API configuration

### ✅ **Updated Service Files:**
- `src/services/authService.ts` - Updated to use centralized API config
- `src/services/productService.ts` - Updated to use centralized API config
- `src/services/categoryService.ts` - Updated to use centralized API config
- `src/services/orderService.ts` - Updated to use centralized API config
- `src/services/analyticsService.ts` - Updated to use centralized API config
- `src/services/profileService.ts` - Updated to use centralized API config

### ✅ **Updated Configuration:**
- `vite.config.ts` - Updated with environment variable handling

## 🔧 Environment Variables

Your frontend is configured with these production environment variables:

```env
# API Configuration
VITE_API_URL=https://143.110.253.120:5000/api
REACT_APP_API_URL=https://143.110.253.120:5000/api

# Environment
NODE_ENV=production
VITE_NODE_ENV=production

# App Configuration
VITE_APP_NAME=Radiant Bloom
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=dkhb7gks0
VITE_CLOUDINARY_API_KEY=435162914895178

# CORS Configuration
VITE_ALLOWED_ORIGINS=https://143.110.253.120:5000,https://your-vercel-domain.vercel.app
```

## 🚀 Vercel Deployment Steps

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory:**
   ```bash
   cd Frontend/radiant_bloom_frontend-main
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? Choose your account
   - Link to existing project? `N` (for first deployment)
   - Project name: `radiant-bloom-frontend`
   - Directory: `./` (current directory)
   - Override settings? `N`

5. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project dashboard
   - Navigate to Settings > Environment Variables
   - Add the following variables:
     ```
     VITE_API_URL = https://143.110.253.120:5000/api
     REACT_APP_API_URL = https://143.110.253.120:5000/api
     VITE_NODE_ENV = production
     VITE_APP_NAME = Radiant Bloom
     VITE_CLOUDINARY_CLOUD_NAME = dkhb7gks0
     VITE_CLOUDINARY_API_KEY = 435162914895178
     ```

### Method 2: GitHub Integration

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `Frontend/radiant_bloom_frontend-main` folder

3. **Configure Build Settings:**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Set Environment Variables:**
   - Add all environment variables from the list above

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete

## 🧪 Testing Your Deployment

### 1. **Test API Connection:**
   ```bash
   # Test your backend API
   curl https://143.110.253.120:5000/api/health
   ```

### 2. **Test Frontend:**
   - Visit your Vercel URL
   - Check browser console for any errors
   - Test login/registration functionality
   - Test product browsing and cart functionality

### 3. **Debug API Issues:**
   - Open browser DevTools
   - Check Network tab for failed requests
   - Look for CORS errors
   - Verify API URL is correct

## 🔒 CORS Configuration

Your backend needs to allow your Vercel domain. Update your backend `.env` file:

```env
# Add your Vercel domain to allowed origins
ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app,https://143.110.253.120:5000,http://localhost:3000,http://localhost:8080
```

## 📊 Monitoring & Debugging

### 1. **Vercel Analytics:**
   - Enable Vercel Analytics in your project settings
   - Monitor performance and errors

### 2. **Console Logging:**
   - Check browser console for errors
   - API configuration is logged in development mode

### 3. **Network Tab:**
   - Monitor API requests
   - Check for failed requests or CORS issues

## 🚨 Troubleshooting

### Common Issues:

1. **API Connection Failed:**
   - Check if backend is running: `curl https://143.110.253.120:5000/api/health`
   - Verify CORS settings in backend
   - Check environment variables in Vercel

2. **Build Errors:**
   - Check Vercel build logs
   - Ensure all dependencies are in package.json
   - Verify TypeScript compilation

3. **Environment Variables Not Working:**
   - Ensure variables start with `VITE_` or `REACT_APP_`
   - Check Vercel environment variable settings
   - Redeploy after adding new variables

4. **CORS Errors:**
   - Update backend ALLOWED_ORIGINS
   - Restart backend server
   - Check browser console for specific CORS errors

## 🔄 Updates & Maintenance

### Updating Your Frontend:
1. Make changes to your code
2. Test locally: `npm run dev`
3. Deploy: `vercel --prod` (or push to GitHub for auto-deploy)

### Updating Environment Variables:
1. Go to Vercel Dashboard > Settings > Environment Variables
2. Update the required variables
3. Redeploy your project

## 📱 Your Live URLs

After deployment, your application will be available at:
- **Frontend**: `https://your-project-name.vercel.app`
- **Backend**: `https://143.110.253.120:5000/api`

## ✅ Success Checklist

- [ ] Backend API is running and accessible
- [ ] Frontend builds successfully locally
- [ ] Environment variables are set in Vercel
- [ ] CORS is configured in backend
- [ ] Frontend connects to backend API
- [ ] All features work in production
- [ ] Analytics and monitoring are set up

## 🎉 You're Ready!

Your Radiant Bloom frontend is now configured for Vercel deployment with your production backend API! 🚀

**Next Steps:**
1. Deploy to Vercel using one of the methods above
2. Test all functionality
3. Update your backend CORS settings if needed
4. Monitor your application performance
