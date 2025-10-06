const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getOrderStats,
  acceptOrder,
  declineOrder
} = require('../controllers/orderController');

const router = express.Router();

// Public routes (none for orders)

// Protected routes
router.use(protect); // All routes below require authentication

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', createOrder);

// @route   GET /api/orders
// @desc    Get user orders
// @access  Private
router.get('/', getUserOrders);

// @route   GET /api/orders/stats
// @desc    Get order statistics
// @access  Private/Admin
router.get('/stats', restrictTo('admin'), getOrderStats);

// @route   GET /api/orders/admin
// @desc    Get all orders (Admin)
// @access  Private/Admin
router.get('/admin', restrictTo('admin'), getAllOrders);

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', getOrder);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', restrictTo('admin'), updateOrderStatus);

// @route   PUT /api/orders/:id/payment
// @desc    Update payment status
// @access  Private/Admin
router.put('/:id/payment', restrictTo('admin'), updatePaymentStatus);

// @route   PUT /api/orders/:id/accept
// @desc    Accept order (Admin)
// @access  Private/Admin
router.put('/:id/accept', restrictTo('admin'), acceptOrder);

// @route   PUT /api/orders/:id/decline
// @desc    Decline order (Admin)
// @access  Private/Admin
router.put('/:id/decline', restrictTo('admin'), declineOrder);

// @route   DELETE /api/orders/:id
// @desc    Cancel order
// @access  Private
router.delete('/:id', cancelOrder);

module.exports = router;
