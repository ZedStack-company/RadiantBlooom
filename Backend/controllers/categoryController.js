const Category = require('../models/Category');
const { asyncHandler } = require('../utils/asyncHandler');
const { responseHandler } = require('../utils/responseHandler');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .select('-__v');

  responseHandler(res, 200, true, { count: categories.length, data: categories }, 'Categories retrieved successfully');
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Category not found'
      }
    });
  }

  responseHandler(res, 200, true, { data: category }, 'Category retrieved successfully');
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);

  responseHandler(res, 201, true, { data: category }, 'Category created successfully');
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!category) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Category not found'
      }
    });
  }

  responseHandler(res, 200, true, { data: category }, 'Category updated successfully');
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Category not found'
      }
    });
  }

  responseHandler(res, 200, true, null, 'Category deleted successfully');
});

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
