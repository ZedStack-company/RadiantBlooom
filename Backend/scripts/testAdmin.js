#!/usr/bin/env node

const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const testAdminLogin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/radiant_bloom');
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@radiantbloom.com' }).select('+password');
    
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('👤 Admin user found:');
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.role);
    console.log('   Is Active:', admin.isActive);
    console.log('   Password Hash:', admin.password ? 'Set' : 'Not set');

    // Test password
    const isPasswordCorrect = await admin.correctPassword('admin123', admin.password);
    console.log('🔑 Password test:', isPasswordCorrect ? '✅ Correct' : '❌ Incorrect');

    if (!isPasswordCorrect) {
      console.log('🔧 Fixing password...');
      admin.password = 'admin123'; // This will be hashed by the pre-save middleware
      await admin.save();
      console.log('✅ Password updated');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

testAdminLogin();
