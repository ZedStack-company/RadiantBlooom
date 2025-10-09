# 🚨 URGENT: Backend HTTPS Setup Required

## 🎯 **Current Status**

✅ **Frontend**: Now correctly using HTTPS (`✅ Using HTTPS: true`)  
❌ **Backend**: Still running HTTP only (causing `ERR_SSL_PROTOCOL_ERROR`)

## 🔧 **Quick Fix: Set Up HTTPS Backend**

### **Step 1: SSH into Your Digital Ocean Server**

```bash
ssh root@143.110.253.120
```

### **Step 2: Navigate to Backend Directory**

```bash
cd /path/to/your/backend
# or wherever your backend files are located
```

### **Step 3: Run the Quick Setup Script**

```bash
# Make the script executable
chmod +x quick-https-setup.sh

# Run the setup script
sudo ./quick-https-setup.sh
```

### **Step 4: Alternative - Manual Setup**

If the script doesn't work, run these commands manually:

```bash
# Create SSL directories
sudo mkdir -p /etc/ssl/certs
sudo mkdir -p /etc/ssl/private

# Generate self-signed certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/nginx-selfsigned.key \
    -out /etc/ssl/certs/nginx-selfsigned.crt \
    -subj "/C=US/ST=State/L=City/O=RadiantBloom/CN=143.110.253.120"

# Set proper permissions
sudo chmod 600 /etc/ssl/private/nginx-selfsigned.key
sudo chmod 644 /etc/ssl/certs/nginx-selfsigned.crt

# Update environment variables
echo "" >> production.env
echo "SSL_CERT_PATH=/etc/ssl/certs/nginx-selfsigned.crt" >> production.env
echo "SSL_KEY_PATH=/etc/ssl/private/nginx-selfsigned.key" >> production.env

# Stop existing backend
pm2 stop radiant-bloom-backend

# Start with HTTPS server
pm2 start server-https.js --name "radiant-bloom-backend-https"
```

### **Step 5: Test HTTPS Backend**

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

## 🧪 **Expected Results After Setup**

### **Backend Test:**
```bash
curl -k https://143.110.253.120:5000/api/health
# Should return JSON with "protocol": "https", "secure": true
```

### **Frontend Console:**
```
🔧 API Configuration Debug:
API_BASE_URL: https://143.110.253.120:5000/api
✅ Using HTTPS: true
```

### **Network Tab:**
- All API calls will show `https://143.110.253.120:5000/api`
- No more `ERR_SSL_PROTOCOL_ERROR`
- API calls will succeed with 200 status

## ⚠️ **Important Notes**

### **Self-Signed Certificate:**
- Your backend will use a self-signed certificate
- Browsers will show a security warning initially
- Users need to accept the certificate for the first visit
- This is normal for self-signed certificates

### **Firewall:**
Make sure port 5000 is open:
```bash
sudo ufw allow 5000
sudo ufw status
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

# Check if backend is running
pm2 status
```

### **If you get permission errors:**
```bash
# Make sure you're running as root
sudo su

# Check file permissions
ls -la /etc/ssl/private/nginx-selfsigned.key
ls -la /etc/ssl/certs/nginx-selfsigned.crt
```

## 🎯 **Why This Fixes the Issue**

1. **Frontend**: Already correctly configured to use HTTPS
2. **Backend**: Needs SSL certificates to support HTTPS
3. **Self-signed certificate**: Provides HTTPS support immediately
4. **No Mixed Content**: Both frontend and backend use HTTPS

## ✅ **Verification Checklist**

After setup, verify:
- [ ] Backend responds to `https://143.110.253.120:5000/api/health`
- [ ] SSL certificate is present (self-signed)
- [ ] Frontend console shows HTTPS API URL
- [ ] No `ERR_SSL_PROTOCOL_ERROR`
- [ ] API calls return 200 status
- [ ] Login/Register works
- [ ] Products load
- [ ] Cart functions
- [ ] Admin dashboard works

## 🚀 **Next Steps**

1. **Run the HTTPS setup** on your Digital Ocean server
2. **Test the backend** with curl
3. **Refresh your frontend** - it should work immediately
4. **No need to redeploy frontend** - it's already configured correctly

**Your frontend is ready! Just set up HTTPS on the backend and everything will work!** 🎉
