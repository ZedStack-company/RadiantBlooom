const mongoose = require('mongoose');

const specificationsSchema = new mongoose.Schema({
  weight: String,
  dimensions: String,
  ingredients: [String],
  skinType: [String],
  ageRange: String
});

const inventorySchema = new mongoose.Schema({
  quantity: {
    type: Number,
    default: 0,
    min: [0, 'Quantity cannot be negative']
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: [0, 'Low stock threshold cannot be negative']
  },
  trackInventory: {
    type: Boolean,
    default: true
  }
});

const seoSchema = new mongoose.Schema({
  title: String,
  description: String,
  keywords: [String]
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
    maxlength: [100, 'Brand name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative'],
    default: 0,
    validate: {
      validator: function(value) {
        // Allow 0, undefined, or null (no original price)
        if (!value || value === 0) return true;
        // If original price is set, it must be >= current price
        return value >= this.price;
      },
      message: 'Original price must be greater than or equal to current price'
    }
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  subcategory: {
    type: String,
    trim: true,
    maxlength: [100, 'Subcategory cannot exceed 100 characters']
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        // Accept both HTTP/HTTPS URLs and base64 data URLs
        return /^(https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$|data:image\/(jpg|jpeg|png|webp|gif);base64,)/i.test(v);
      },
      message: 'Invalid image URL format. Must be HTTP/HTTPS URL or base64 data URL'
    }
  }],
  features: [{
    type: String,
    trim: true,
    maxlength: [200, 'Feature cannot exceed 200 characters']
  }],
  specifications: specificationsSchema,
  inventory: inventorySchema,
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isBestseller: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: [0, 'Review count cannot be negative']
  },
  seo: seoSchema
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ isBestseller: 1 });
productSchema.index({ isNew: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for in stock status
productSchema.virtual('inStock').get(function() {
  if (!this.inventory || !this.inventory.trackInventory) return true;
  return this.inventory.quantity > 0;
});

// Virtual for low stock status
productSchema.virtual('lowStock').get(function() {
  if (!this.inventory || !this.inventory.trackInventory) return false;
  return this.inventory.quantity <= this.inventory.lowStockThreshold;
});

// Pre-save middleware to update rating and review count
productSchema.pre('save', async function(next) {
  if (this.isModified('rating') || this.isModified('reviewCount')) {
    // This will be updated by the review system
  }
  next();
});

// Static method to find products by category
productSchema.statics.findByCategory = function(categoryId) {
  return this.find({ category: categoryId, status: 'active' });
};

// Static method to find featured products
productSchema.statics.findFeatured = function() {
  return this.find({ isFeatured: true, status: 'active' });
};

// Static method to find bestseller products
productSchema.statics.findBestsellers = function() {
  return this.find({ isBestseller: true, status: 'active' });
};

// Static method to find new products
productSchema.statics.findNew = function() {
  return this.find({ isNew: true, status: 'active' });
};

// Static method to search products
productSchema.statics.search = function(query, options = {}) {
  const {
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
  } = options;

  let filter = { status: 'active' };

  if (query) {
    filter.$text = { $search: query };
  }

  if (category) {
    filter.category = category;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  if (brand) {
    filter.brand = new RegExp(brand, 'i');
  }

  if (isBestseller !== undefined) {
    filter.isBestseller = isBestseller;
  }

  if (isNew !== undefined) {
    filter.isNew = isNew;
  }

  if (isFeatured !== undefined) {
    filter.isFeatured = isFeatured;
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  return this.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('category', 'name slug');
};

// Ensure virtual fields are included in JSON output
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
