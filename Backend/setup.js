#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Radiant Bloom Backend...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📋 Creating .env file from env.example...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created successfully!');
  } else {
    console.log('❌ env.example file not found!');
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📝 Please update the following in your .env file:');
console.log('   - MONGODB_URI: Your MongoDB connection string');
console.log('   - JWT_SECRET: A secure random string for JWT signing');
console.log('   - CLOUDINARY_CLOUD_NAME: Your Cloudinary cloud name');
console.log('   - CLOUDINARY_API_KEY: Your Cloudinary API key');
console.log('   - CLOUDINARY_API_SECRET: Your Cloudinary API secret');

console.log('\n🔧 CORS Configuration:');
console.log('   - Frontend running on port 8080: ✅ Configured');
console.log('   - Frontend running on port 3000: ✅ Also supported');

console.log('\n🚀 To start the backend:');
console.log('   npm install');
console.log('   npm run dev');

console.log('\n📱 To start the frontend:');
console.log('   cd ../Frontend/radiant_bloom_frontend-main');
console.log('   npm install');
console.log('   npm run dev');

console.log('\n✨ Setup complete! Happy coding!');
