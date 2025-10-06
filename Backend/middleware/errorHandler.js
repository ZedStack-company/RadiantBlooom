const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Enhanced logging for debugging
  console.error('=== ERROR HANDLER ===');
  console.error('Request URL:', req.originalUrl);
  console.error('Request Method:', req.method);
  console.error('Error Name:', err.name);
  console.error('Error Message:', err.message);
  console.error('Error Code:', err.code);
  console.error('Error Status:', err.status);
  console.error('Full Error:', err);
  console.error('========================');

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      message,
      code: 'RESOURCE_NOT_FOUND',
      statusCode: 404
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error = {
      message,
      code: 'DUPLICATE_FIELD',
      statusCode: 400
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      message,
      code: 'VALIDATION_ERROR',
      statusCode: 400
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = {
      message,
      code: 'INVALID_TOKEN',
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = {
      message,
      code: 'TOKEN_EXPIRED',
      statusCode: 401
    };
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File too large';
    error = {
      message,
      code: 'FILE_TOO_LARGE',
      statusCode: 400
    };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Unexpected field in file upload';
    error = {
      message,
      code: 'UNEXPECTED_FILE_FIELD',
      statusCode: 400
    };
  }

  // Rate limit errors
  if (err.status === 429) {
    const message = 'Too many requests, please try again later';
    error = {
      message,
      code: 'RATE_LIMIT_EXCEEDED',
      statusCode: 429
    };
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  const code = error.code || 'INTERNAL_ERROR';

  // Don't leak error details in production
  const errorDetails = process.env.NODE_ENV === 'production' 
    ? undefined 
    : {
        stack: err.stack,
        originalError: err
      };

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code,
      ...errorDetails,
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = errorHandler;
