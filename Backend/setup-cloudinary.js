#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Radiant Bloom - Cloudinary Setup');
console.log('=====================================');
console.log('');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
  console.log('Current Cloudinary configuration:');
  
  // Read and display current config
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    if (line.startsWith('CLOUDINARY_')) {
      const [key, value] = line.split('=');
      if (value && value !== 'your_cloudinary_cloud_name' && value !== 'your_cloudinary_api_key' && value !== 'your_cloudinary_api_secret') {
        console.log(`  ${key}: ${value.substring(0, 10)}...`);
      } else {
        console.log(`  ${key}: ❌ Not configured`);
      }
    }
  });
} else {
  console.log('❌ .env file not found');
  console.log('Creating .env file from template...');
  
  // Copy from env.example
  if (fs.existsSync(envExamplePath)) {
    const exampleContent = fs.readFileSync(envExamplePath, 'utf8');
    fs.writeFileSync(envPath, exampleContent);
    console.log('✅ .env file created from template');
  } else {
    console.log('❌ env.example file not found');
    process.exit(1);
  }
}

console.log('');
console.log('📋 Next Steps:');
console.log('1. Open the .env file in your Backend folder');
console.log('2. Replace the following values with your actual Cloudinary credentials:');
console.log('   - CLOUDINARY_CLOUD_NAME=your_actual_cloud_name');
console.log('   - CLOUDINARY_API_KEY=your_actual_api_key');
console.log('   - CLOUDINARY_API_SECRET=your_actual_api_secret');
console.log('');
console.log('3. Get your Cloudinary credentials from: https://cloudinary.com/console');
console.log('');
console.log('4. Restart your backend server after updating the .env file');
console.log('');
console.log('🔍 To test Cloudinary configuration, try creating a product with images');
console.log('   The server will log detailed information about the upload process');
