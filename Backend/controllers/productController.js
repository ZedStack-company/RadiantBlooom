const Product = require('../models/Product');
const { asyncHandler } = require('../utils/asyncHandler');
const { responseHandler } = require('../utils/responseHandler');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Function to upload base64 image to Cloudinary
const uploadBase64ToCloudinary = async (base64String, folder = 'radiant-bloom') => {
  try {
    console.log('🔄 Uploading base64 image to Cloudinary...');
    console.log('Base64 preview:', base64String.substring(0, 100) + '...');
    
    const result = await cloudinary.uploader.upload(base64String, {
      folder: folder,
      transformation: [
        { width: 1200, height: 1200, crop: 'limit', quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    
    console.log('✅ Image uploaded to Cloudinary:', result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error('❌ Failed to upload image to Cloudinary:', error);
    throw error;
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    brand,
    isBestseller,
    isNew,
    isFeatured,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10
  } = req.query;

  const options = {
    category,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    brand,
    isBestseller: isBestseller === 'true',
    isNew: isNew === 'true',
    isFeatured: isFeatured === 'true',
    sortBy,
    sortOrder,
    page: parseInt(page),
    limit: parseInt(limit)
  };

  const products = await Product.search(search, options);
  const total = await Product.countDocuments({ status: 'active' });

  responseHandler(res, 200, true, {
    products,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  }, 'Products retrieved successfully');
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug');

  if (!product) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      }
    });
  }

  responseHandler(res, 200, true, { product }, 'Product retrieved successfully');
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  console.log('=== PRODUCT CREATION REQUEST ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('User:', req.user ? req.user.email : 'No user');
  console.log('Files uploaded:', req.files ? req.files.length : 'No files');
  console.log('File details:', req.files ? req.files.map(f => ({ fieldname: f.fieldname, originalname: f.originalname, size: f.size, url: f.path })) : 'No files');
  
  try {
    // Check Cloudinary configuration
    console.log('🔧 Cloudinary Configuration Check:');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : '❌ Not set');
    console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Set' : '❌ Not set');
    console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : '❌ Not set');
    
    let productData = { ...req.body };
    
    // Check if images are provided as base64 data URLs
    console.log('🔍 Checking for images in request...');
    console.log('req.body keys:', Object.keys(req.body));
    
    let images = [];
    
    // Check if images are in req.body.images array
    if (req.body.images && Array.isArray(req.body.images)) {
      images = req.body.images;
      console.log('📸 Images found in req.body.images array:', images.length);
    }
    // Check if images are in req.body.image array (singular)
    else if (req.body.image && Array.isArray(req.body.image)) {
      images = req.body.image;
      console.log('📸 Images found in req.body.image array:', images.length);
    }
    // Check if there's a single image field
    else if (req.body.image && typeof req.body.image === 'string' && req.body.image.startsWith('data:image/')) {
      images = [req.body.image];
      console.log('📸 Single image found in req.body.image string');
    }
    // Check all fields for base64 data URLs
    else {
      console.log('🔍 Searching all fields for base64 images...');
      for (const [key, value] of Object.entries(req.body)) {
        if (typeof value === 'string' && value.startsWith('data:image/')) {
          images.push(value);
          console.log(`📸 Found base64 image in field: ${key}`);
        }
      }
    }
    
    if (images.length > 0) {
      console.log('📸 Total images found:', images.length);
      console.log('First image preview:', images[0] ? images[0].substring(0, 100) + '...' : 'No images');
      
      // Upload base64 images to Cloudinary
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        console.log('🔄 Uploading images to Cloudinary...');
        const cloudinaryUrls = [];
        
        for (let i = 0; i < images.length; i++) {
          const base64Image = images[i];
          try {
            const cloudinaryUrl = await uploadBase64ToCloudinary(base64Image, 'radiant-bloom/products');
            cloudinaryUrls.push(cloudinaryUrl);
          } catch (error) {
            console.error(`❌ Failed to upload image ${i + 1}:`, error.message);
            // Fallback to base64 if Cloudinary fails
            cloudinaryUrls.push(base64Image);
          }
        }
        
        productData.images = cloudinaryUrls;
        console.log('✅ Images uploaded to Cloudinary:', cloudinaryUrls);
      } else {
        console.log('⚠️ Cloudinary not configured, storing base64 images');
        productData.images = images;
      }
    } else {
      console.log('❌ No images found in request');
    }
    
    const product = await Product.create(productData);
    console.log('✅ Product created successfully:', product._id);
    console.log('Product images:', product.images);
    
    responseHandler(res, 201, true, { product }, 'Product created successfully');
  } catch (error) {
    console.error('❌ Product creation failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error details:', error);
    
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
    }
    
    throw error; // Re-throw to be handled by errorHandler
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      }
    });
  }

  responseHandler(res, 200, true, { product }, 'Product updated successfully');
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      }
    });
  }

  responseHandler(res, 200, true, null, 'Product deleted successfully');
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.findFeatured();

  responseHandler(res, 200, true, { products }, 'Featured products retrieved successfully');
});

// @desc    Get bestseller products
// @route   GET /api/products/bestsellers
// @access  Public
const getBestsellerProducts = asyncHandler(async (req, res) => {
  const products = await Product.findBestsellers();

  responseHandler(res, 200, true, { products }, 'Bestseller products retrieved successfully');
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getBestsellerProducts
};
