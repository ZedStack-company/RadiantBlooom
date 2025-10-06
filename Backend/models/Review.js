const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
      },
      message: 'Invalid image URL format'
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  helpful: {
    type: Number,
    default: 0,
    min: [0, 'Helpful count cannot be negative']
  },
  helpfulUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to ensure one review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Indexes for performance
reviewSchema.index({ product: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isApproved: 1 });
reviewSchema.index({ createdAt: -1 });

// Virtual for user info
reviewSchema.virtual('userInfo', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true,
  select: 'firstName lastName avatar'
});

// Virtual for product info
reviewSchema.virtual('productInfo', {
  ref: 'Product',
  localField: 'product',
  foreignField: '_id',
  justOne: true,
  select: 'name brand images'
});

// Pre-save middleware to update product rating
reviewSchema.post('save', async function() {
  await this.constructor.updateProductRating(this.product);
});

// Pre-remove middleware to update product rating
reviewSchema.post('remove', async function() {
  await this.constructor.updateProductRating(this.product);
});

// Static method to update product rating and review count
reviewSchema.statics.updateProductRating = async function(productId) {
  const Product = mongoose.model('Product');
  
  const stats = await this.aggregate([
    { $match: { product: productId, isApproved: true } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].reviewCount
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      reviewCount: 0
    });
  }
};

// Static method to find reviews by product
reviewSchema.statics.findByProduct = function(productId, options = {}) {
  const { 
    rating, 
    isApproved = true, 
    sortBy = 'createdAt', 
    sortOrder = 'desc',
    page = 1,
    limit = 10 
  } = options;

  let filter = { product: productId, isApproved };
  if (rating) {
    filter.rating = rating;
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  return this.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'firstName lastName avatar')
    .populate('product', 'name brand');
};

// Static method to find reviews by user
reviewSchema.statics.findByUser = function(userId, options = {}) {
  const { 
    isApproved = true, 
    sortBy = 'createdAt', 
    sortOrder = 'desc',
    page = 1,
    limit = 10 
  } = options;

  const filter = { user: userId, isApproved };

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  return this.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('product', 'name brand images');
};

// Static method to get rating distribution
reviewSchema.statics.getRatingDistribution = function(productId) {
  return this.aggregate([
    { $match: { product: productId, isApproved: true } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } }
  ]);
};

// Static method to get average rating
reviewSchema.statics.getAverageRating = function(productId) {
  return this.aggregate([
    { $match: { product: productId, isApproved: true } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);
};

// Instance method to mark as helpful
reviewSchema.methods.markHelpful = async function(userId) {
  if (!this.helpfulUsers.includes(userId)) {
    this.helpfulUsers.push(userId);
    this.helpful += 1;
    await this.save();
  }
  return this;
};

// Instance method to unmark as helpful
reviewSchema.methods.unmarkHelpful = async function(userId) {
  const index = this.helpfulUsers.indexOf(userId);
  if (index > -1) {
    this.helpfulUsers.splice(index, 1);
    this.helpful = Math.max(0, this.helpful - 1);
    await this.save();
  }
  return this;
};

// Instance method to check if user can review
reviewSchema.statics.canUserReview = async function(userId, productId) {
  const Order = mongoose.model('Order');
  
  // Check if user has purchased the product
  const order = await Order.findOne({
    user: userId,
    'items.product': productId,
    status: { $in: ['delivered', 'shipped'] }
  });

  if (!order) {
    return { canReview: false, reason: 'User has not purchased this product' };
  }

  // Check if user has already reviewed this product
  const existingReview = await this.findOne({ user: userId, product: productId });
  if (existingReview) {
    return { canReview: false, reason: 'User has already reviewed this product' };
  }

  return { canReview: true };
};

module.exports = mongoose.model('Review', reviewSchema);
