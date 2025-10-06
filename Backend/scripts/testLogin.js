#!/usr/bin/env node

// Using built-in fetch (Node.js 18+)

const testLogin = async () => {
  try {
    console.log('🧪 Testing login endpoint...');
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@radiantbloom.com',
        password: 'admin123'
      })
    });

    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Login successful!');
    } else {
      console.log('❌ Login failed:', data.error?.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testLogin();
