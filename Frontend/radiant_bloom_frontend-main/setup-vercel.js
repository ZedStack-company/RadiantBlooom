#!/usr/bin/env node

/**
 * Vercel Deployment Setup Script for Radiant Bloom Frontend
 * This script helps you prepare for Vercel deployment
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🚀 Radiant Bloom Frontend - Vercel Setup');
console.log('========================================\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this script from the frontend directory');
  process.exit(1);
}

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file from production template...');
  try {
    fs.copyFileSync('production.env', '.env');
    console.log('✅ .env file created successfully');
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists');
}

// Check if vercel.json exists
if (!fs.existsSync('vercel.json')) {
  console.error('❌ vercel.json file not found. Please ensure it exists.');
  process.exit(1);
} else {
  console.log('✅ vercel.json configuration found');
}

// Check if API config exists
if (!fs.existsSync('src/config/api.ts')) {
  console.error('❌ API configuration not found. Please ensure src/config/api.ts exists.');
  process.exit(1);
} else {
  console.log('✅ API configuration found');
}

// Test build
console.log('\n🔨 Testing production build...');

try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Production build successful');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.log('\n💡 Please fix build errors before deploying to Vercel');
  process.exit(1);
}

console.log('\n🎉 Vercel setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Install Vercel CLI: npm install -g vercel');
console.log('2. Login to Vercel: vercel login');
console.log('3. Deploy: vercel');
console.log('4. Set environment variables in Vercel dashboard');
console.log('\n📖 For detailed instructions, see VERCEL_DEPLOYMENT_GUIDE.md');

console.log('\n🔧 Environment Variables to set in Vercel:');
console.log('VITE_API_URL = https://143.110.253.120:5000/api');
console.log('REACT_APP_API_URL = https://143.110.253.120:5000/api');
console.log('VITE_NODE_ENV = production');
console.log('VITE_APP_NAME = Radiant Bloom');
console.log('VITE_CLOUDINARY_CLOUD_NAME = dkhb7gks0');
console.log('VITE_CLOUDINARY_API_KEY = 435162914895178');
