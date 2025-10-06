const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  try {
    console.log('=== AUTH MIDDLEWARE ===');
    console.log('Request URL:', req.originalUrl);
    console.log('Authorization header:', req.headers.authorization);
    console.log('Cookies:', req.cookies);
    
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token from header:', token ? 'Present' : 'Missing');
    }
    // Get token from cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
      console.log('Token from cookies:', token ? 'Present' : 'Missing');
    }

    // Check if token exists
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        error: {
          message: 'Access denied. No token provided.',
          code: 'NO_TOKEN'
        }
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Token is valid but user no longer exists.',
            code: 'USER_NOT_FOUND'
          }
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Account has been deactivated.',
            code: 'ACCOUNT_DEACTIVATED'
          }
        });
      }

      // Check if user changed password after token was issued
      if (user.changedPasswordAfter(decoded.iat)) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'User recently changed password. Please log in again.',
            code: 'PASSWORD_CHANGED'
          }
        });
      }

      // Grant access to protected route
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Invalid token.',
            code: 'INVALID_TOKEN'
          }
        });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Token has expired.',
            code: 'TOKEN_EXPIRED'
          }
        });
      }
      throw error;
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        message: 'Authentication error.',
        code: 'AUTH_ERROR',
        details: error.message
      }
    });
  }
};

// Restrict to certain roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'You do not have permission to perform this action.',
          code: 'INSUFFICIENT_PERMISSIONS'
        }
      });
    }
    next();
  };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Get token from cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user && user.isActive && !user.changedPasswordAfter(decoded.iat)) {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but we don't fail the request
        req.user = null;
      }
    }

    next();
  } catch (error) {
    next();
  }
};

// Check if user owns resource
const checkOwnership = (Model, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramName];
      const resource = await Model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Resource not found.',
            code: 'RESOURCE_NOT_FOUND'
          }
        });
      }

      // Check if user owns the resource or is admin
      if (resource.user && resource.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: {
            message: 'You can only access your own resources.',
            code: 'OWNERSHIP_REQUIRED'
          }
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: {
          message: 'Error checking resource ownership.',
          code: 'OWNERSHIP_CHECK_ERROR',
          details: error.message
        }
      });
    }
  };
};

// Generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Send token response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Cookie options
  const cookieOptions = {
    expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  };

  // Set cookie
  res.cookie('token', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    data: {
      user,
      token
    },
    message: 'Authentication successful'
  });
};

module.exports = {
  protect,
  restrictTo,
  optionalAuth,
  checkOwnership,
  signToken,
  createSendToken
};
