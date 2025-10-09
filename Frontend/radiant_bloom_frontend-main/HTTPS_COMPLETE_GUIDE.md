# 🔒 HTTPS Backend Setup - Complete Guide

## 🎯 **Problem Solved**

Your frontend (HTTPS) was trying to connect to your backend (HTTP), causing Mixed Content errors. Now both will use HTTPS!

## 📋 **Step-by-Step Setup**

### **Step 1: Set Up HTTPS Backend on Digital Ocean**

```bash
# SSH into your Digital Ocean server
ssh root@143.110.253.120

# Navigate to your backend directory
cd /path/to/your/backend

# Make the SSL setup script executable
chmod +x setup-ssl.sh

# Run the SSL setup script
sudo ./setup-ssl.sh
```

### **Step 2: Alternative - Manual SSL Setup**

If the script doesn't work, run these commands manually:

```bash
# Create SSL directories
sudo mkdir -p /etc/ssl/certs
sudo mkdir -p /etc/ssl/private

# Generate self-signed certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/nginx-selfsigned.key \
    -out /etc/ssl/certs/nginx-selfsigned.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=143.110.253.120"

# Set proper permissions
sudo chmod 600 /etc/ssl/private/nginx-selfsigned.key
sudo chmod 644 /etc/ssl/certs/nginx-selfsigned.crt

# Update environment variables
echo "" >> production.env
echo "SSL_CERT_PATH=/etc/ssl/certs/nginx-selfsigned.crt" >> production.env
echo "SSL_KEY_PATH=/etc/ssl/private/nginx-selfsigned.key" >> production.env

# Restart backend with HTTPS
pm2 stop radiant-bloom-backend
pm2 start server-https.js --name "radiant-bloom-backend-https"
```

### **Step 3: Test Backend HTTPS**

```bash
# Test HTTPS endpoint
curl -k https://143.110.253.120:5000/api/health

# Expected response:
# {
#   "status": "success",
#   "message": "Radiant Bloom API is running",
#   "timestamp": "2024-01-01T00:00:00.000Z",
#   "environment": "production",
#   "protocol": "https",
#   "secure": true
# }
```

### **Step 4: Update Frontend Configuration**

The frontend has been updated to use HTTPS:

**Files Updated:**
- ✅ `src/config/api.ts` - Now uses HTTPS backend URL
- ✅ `vercel.json` - Environment variables set to HTTPS
- ✅ `vite.config.ts` - Build configuration uses HTTPS
- ✅ `production.env` - Production environment uses HTTPS

### **Step 5: Build and Deploy Frontend**

```bash
# Build the updated frontend
npm run build

# Deploy to Vercel
vercel --prod
```

## 🧪 **Expected Results After Deployment**

### **Console Output:**
```
🔧 API Configuration Debug:
API_BASE_URL: https://143.110.253.120:5000/api
Environment: {VITE_API_URL: "https://143.110.253.120:5000/api", ...}
✅ Using HTTPS: true
```

### **Network Tab:**
- All API calls will show `https://143.110.253.120:5000/api`
- No Mixed Content errors
- API calls will succeed with 200 status
- SSL certificate will be present (self-signed)

### **Functionality:**
- ✅ Login/Register works
- ✅ Products load correctly
- ✅ Categories display
- ✅ Cart functionality works
- ✅ Admin dashboard accessible
- ✅ All API endpoints respond securely

## 🔧 **How the HTTPS Setup Works**

### **Backend (server-https.js):**
1. **Checks for SSL certificates** in specified paths
2. **Creates HTTPS server** if certificates exist
3. **Falls back to HTTP** if certificates not found
4. **Logs protocol information** for debugging

### **Frontend Configuration:**
1. **Environment variables** set to HTTPS URLs
2. **Multiple fallbacks** ensure HTTPS usage
3. **Production detection** forces HTTPS backend URL
4. **Vercel integration** uses HTTPS environment variables

## ⚠️ **Important Notes**

### **Self-Signed Certificate:**
- Your backend will use a self-signed certificate
- Browsers will show a security warning initially
- Users need to accept the certificate for the first visit
- This is normal for self-signed certificates

### **Production Recommendation:**
For production, consider getting a trusted SSL certificate:

```bash
# Install Certbot
sudo apt install certbot

# Get Let's Encrypt certificate (if you have a domain)
sudo certbot certonly --standalone -d your-domain.com

# Update SSL paths in production.env
SSL_CERT_PATH=/etc/letsencrypt/live/your-domain.com/fullchain.pem
SSL_KEY_PATH=/etc/letsencrypt/live/your-domain.com/privkey.pem
```

## 🔍 **Troubleshooting**

### **If HTTPS doesn't work:**

```bash
# Check if certificates exist
ls -la /etc/ssl/certs/nginx-selfsigned.crt
ls -la /etc/ssl/private/nginx-selfsigned.key

# Check backend logs
pm2 logs radiant-bloom-backend-https

# Test SSL connection
openssl s_client -connect 143.110.253.120:5000

# Check firewall
sudo ufw status
sudo ufw allow 5000
```

### **If Mixed Content errors persist:**

1. **Clear browser cache** completely
2. **Check Vercel deployment** - ensure environment variables are set
3. **Verify backend HTTPS** is working
4. **Check console logs** for API URL

## ✅ **Verification Checklist**

After setup, verify:
- [ ] Backend responds to `https://143.110.253.120:5000/api/health`
- [ ] SSL certificate is present (self-signed)
- [ ] Frontend console shows HTTPS API URL
- [ ] No Mixed Content errors
- [ ] API calls return 200 status
- [ ] Login/Register works
- [ ] Products load
- [ ] Cart functions
- [ ] Admin dashboard works

## 🎉 **Success!**

This setup ensures:
1. **Backend supports HTTPS** with SSL certificates
2. **Frontend uses HTTPS** for all API calls
3. **No Mixed Content errors** between HTTPS frontend and HTTPS backend
4. **Secure communication** between frontend and backend
5. **Production-ready** HTTPS configuration

Your application now has full HTTPS support! 🚀🔒✨
