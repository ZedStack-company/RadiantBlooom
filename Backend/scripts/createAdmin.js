#!/usr/bin/env node

const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/radiant_bloom');
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@radiantbloom.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists!');
      console.log('📧 Email: admin@radiantbloom.com');
      console.log('🔑 Password: admin123');
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@radiantbloom.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
      emailVerified: true
    });

    await adminUser.save();

    console.log('🎉 Admin user created successfully!');
    console.log('📧 Email: admin@radiantbloom.com');
    console.log('🔑 Password: admin123');
    console.log('🚀 You can now login and access admin features');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

createAdmin();
