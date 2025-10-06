#!/usr/bin/env node

const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const makeUserAdmin = async (email) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/radiant_bloom');
    console.log('✅ Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log(`❌ User with email ${email} not found`);
      console.log('💡 Please register the user first, then run this script');
      process.exit(1);
    }

    // Update user role to admin
    user.role = 'admin';
    await user.save();

    console.log(`✅ User ${email} is now an admin!`);
    console.log('🎉 You can now access admin features like adding products');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.log('📝 Usage: node scripts/makeAdmin.js <email>');
  console.log('📝 Example: node scripts/makeAdmin.js admin@example.com');
  process.exit(1);
}

makeUserAdmin(email);
