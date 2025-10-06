# CORS Error Fix

## Problem
```
Access to fetch at 'http://localhost:5000/api/auth/login' from origin 'http://localhost:8080' has been blocked by CORS policy
```

## Solution
The backend CORS configuration has been updated to support both ports 3000 and 8080.

### Quick Fix Steps:

1. **Restart the Backend Server:**
   ```bash
   cd Backend
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. **If you don't have a .env file:**
   ```bash
   cd Backend
   npm run setup
   # This will create .env from env.example
   ```

3. **Verify CORS Configuration:**
   The server now accepts requests from:
   - `http://localhost:3000` (Vite default)
   - `http://localhost:8080` (Your current frontend port)
   - `http://127.0.0.1:3000`
   - `http://127.0.0.1:8080`

### What Was Changed:

1. **Updated CORS configuration** in `server.js` to accept multiple origins
2. **Updated env.example** to use port 8080 as default
3. **Added setup script** for easy environment configuration

### Test the Fix:

1. Start backend: `cd Backend && npm run dev`
2. Start frontend: `cd Frontend/radiant_bloom_frontend-main && npm run dev`
3. Try to register/login - the CORS error should be gone!

### If Still Having Issues:

1. **Clear browser cache** and localStorage
2. **Check browser console** for any remaining errors
3. **Verify both servers are running** on correct ports
4. **Check .env file** has correct CORS_ORIGIN setting

The CORS error should now be resolved! 🎉
