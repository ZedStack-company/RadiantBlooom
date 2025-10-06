#!/usr/bin/env node

const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const seedCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/radiant_bloom');
    console.log('✅ Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️ Cleared existing categories');

    // Create categories
    const categories = [
      {
        name: 'Skincare',
        slug: 'skincare',
        description: 'Face and body skincare products',
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'Makeup',
        slug: 'makeup',
        description: 'Cosmetic and makeup products',
        isActive: true,
        sortOrder: 2
      },
      {
        name: 'Hair Care',
        slug: 'haircare',
        description: 'Hair care and styling products',
        isActive: true,
        sortOrder: 3
      },
      {
        name: 'Fragrance',
        slug: 'fragrance',
        description: 'Perfumes and fragrances',
        isActive: true,
        sortOrder: 4
      },
      {
        name: 'Tools',
        slug: 'tools',
        description: 'Beauty tools and accessories',
        isActive: true,
        sortOrder: 5
      }
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log('✅ Created categories:');
    createdCategories.forEach(cat => {
      console.log(`   - ${cat.name} (ID: ${cat._id})`);
    });

    console.log('\n🎉 Categories seeded successfully!');
    console.log('💡 You can now add products with valid category IDs');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

seedCategories();
