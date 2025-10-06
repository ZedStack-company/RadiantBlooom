#!/usr/bin/env node

/**
 * Production Setup Script for Radiant Bloom Backend
 * This script helps you set up the production environment
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Radiant Bloom Backend Production Setup');
console.log('==========================================\n');

// Generate secure secrets
const generateSecret = (length = 64) => {
  return crypto.randomBytes(length).toString('hex');
};

const secrets = {
  JWT_SECRET: generateSecret(64),
  JWT_REFRESH_SECRET: generateSecret(64),
  COOKIE_SECRET: generateSecret(32)
};

console.log('🔐 Generated secure secrets:');
console.log(`JWT_SECRET: ${secrets.JWT_SECRET}`);
console.log(`JWT_REFRESH_SECRET: ${secrets.JWT_REFRESH_SECRET}`);
console.log(`COOKIE_SECRET: ${secrets.COOKIE_SECRET}\n`);

// Create .env file
const envContent = `# Environment
NODE_ENV=production

# Server Configuration
PORT=5000
HOST=0.0.0.0

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://falak:dxsHJSsjJUtZLs6Z@cluster0.psvhihm.mongodb.net/RadiantBloom?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=${secrets.JWT_SECRET}
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=${secrets.JWT_REFRESH_SECRET}
JWT_REFRESH_EXPIRE=30d

# Cloudinary Configuration (UPDATE THESE!)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Origins (UPDATE WITH YOUR FRONTEND URL)
FRONTEND_URL=https://your-frontend-domain.com
ALLOWED_ORIGINS=https://your-frontend-domain.com,http://localhost:3000,http://localhost:8080

# Security
BCRYPT_ROUNDS=12
COOKIE_SECRET=${secrets.COOKIE_SECRET}

# Email Configuration (if using email features)
EMAIL_FROM=noreply@radiantbloom.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads/

# Logging
LOG_LEVEL=info
`;

try {
  fs.writeFileSync('.env', envContent);
  console.log('✅ Created .env file with secure configuration');
} catch (error) {
  console.error('❌ Failed to create .env file:', error.message);
  process.exit(1);
}

// Create logs directory
try {
  if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
    console.log('✅ Created logs directory');
  }
} catch (error) {
  console.error('❌ Failed to create logs directory:', error.message);
}

// Check if PM2 is installed
const { execSync } = require('child_process');
try {
  execSync('pm2 --version', { stdio: 'ignore' });
  console.log('✅ PM2 is installed');
} catch (error) {
  console.log('⚠️  PM2 is not installed. Installing...');
  try {
    execSync('npm install -g pm2', { stdio: 'inherit' });
    console.log('✅ PM2 installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install PM2:', installError.message);
    console.log('💡 Please install PM2 manually: npm install -g pm2');
  }
}

console.log('\n🎉 Production setup completed!');
console.log('\n📋 Next steps:');
console.log('1. Update Cloudinary credentials in .env file');
console.log('2. Update FRONTEND_URL and ALLOWED_ORIGINS in .env file');
console.log('3. Run: npm ci --only=production');
console.log('4. Run: pm2 start ecosystem.config.js --env production');
console.log('5. Test: curl http://localhost:5000/api/health');
console.log('\n📖 For detailed deployment instructions, see DEPLOYMENT_GUIDE.md');
