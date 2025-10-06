const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { responseHandler } = require('../utils/responseHandler');
const { createSendToken } = require('../middleware/auth');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'User already exists with this email',
        code: 'USER_EXISTS'
      }
    });
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone
  });

  createSendToken(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Please provide email and password',
        code: 'MISSING_CREDENTIALS'
      }
    });
  }

  // Check for user and include password
  const user = await User.findByEmail(email).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      }
    });
  }

  // Check if password is correct
  const isPasswordCorrect = await user.correctPassword(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      }
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  createSendToken(user, 200, res);
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  responseHandler(res, 200, null, 'Logged out successfully');
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  console.log("🔍 getMe: req.user", req.user);
  console.log("🔍 getMe: req.user type", typeof req.user);
  console.log("🔍 getMe: req.user exists", !!req.user);
  
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'User not authenticated',
        code: 'USER_NOT_AUTHENTICATED'
      }
    });
  }
  
  responseHandler(res, 200, {
    user: req.user
  }, 'User profile retrieved successfully');
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone } = req.body;

  // Find user by ID
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      }
    });
  }

  // Update fields if provided
  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (phone !== undefined) user.phone = phone;

  // Save updated user
  await user.save();

  responseHandler(res, 200, {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }, 'Profile updated successfully');
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile
};
