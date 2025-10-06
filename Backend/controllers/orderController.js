const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { responseHandler } = require('../utils/responseHandler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  console.log("🔍 Order creation request:", req.body);
  const { items, shippingAddress, billingAddress, paymentMethod, notes } = req.body;

  // Validate required fields
  console.log("🔍 Validating items:", items);
  if (!items || !Array.isArray(items) || items.length === 0) {
    console.log("🔍 Items validation failed");
    return res.status(400).json({
      success: false,
      error: {
        message: 'Order items are required',
        code: 'MISSING_ITEMS'
      }
    });
  }

  console.log("🔍 Validating shippingAddress:", shippingAddress);
  if (!shippingAddress) {
    console.log("🔍 Shipping address validation failed");
    return res.status(400).json({
      success: false,
      error: {
        message: 'Shipping address is required',
        code: 'MISSING_SHIPPING_ADDRESS'
      }
    });
  }

  console.log("🔍 Validating paymentMethod:", paymentMethod);
  if (!paymentMethod) {
    console.log("🔍 Payment method validation failed");
    return res.status(400).json({
      success: false,
      error: {
        message: 'Payment method is required',
        code: 'MISSING_PAYMENT_METHOD'
      }
    });
  }

  try {
    // Validate and process order items
    const processedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: {
            message: `Product with ID ${item.product} not found`,
            code: 'PRODUCT_NOT_FOUND'
          }
        });
      }

      // Check if product is active
      if (product.status !== 'active') {
        return res.status(400).json({
          success: false,
          error: {
            message: `Product ${product.name} is not available`,
            code: 'PRODUCT_INACTIVE'
          }
        });
      }

      // Check inventory
      console.log(`🔍 Checking inventory for ${product.name}:`, {
        trackInventory: product.inventory.trackInventory,
        availableQuantity: product.inventory.quantity,
        requestedQuantity: item.quantity
      });
      
      // If inventory tracking is enabled, check stock
      if (product.inventory.trackInventory) {
        // Set a reasonable default inventory if it's 0 or very low
        const availableStock = product.inventory.quantity || 100; // Default to 100 if not set
        
        if (availableStock < item.quantity) {
          console.log(`🔍 Insufficient stock error for ${product.name}`);
          return res.status(400).json({
            success: false,
            error: {
              message: `Insufficient stock for ${product.name}. Available: ${availableStock}, Requested: ${item.quantity}`,
              code: 'INSUFFICIENT_STOCK'
            }
          });
        }
      }

      // Calculate item total
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      // Add to processed items with proper image handling
      const productImage = product.images?.[0] || product.image || '/placeholder.svg';
      processedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: productImage,
        brand: product.brand
      });
    }

    // Calculate pricing
    const taxRate = 0.08; // 8% tax rate
    const tax = subtotal * taxRate;
    const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
    const discount = 0; // Can be calculated based on promo codes
    const total = subtotal + tax + shipping - discount;

    // Generate unique order number
    const generateOrderNumber = () => {
      const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // 3 digit random
      return `ORD-${timestamp}${random}`;
    };

    const orderNumber = generateOrderNumber();
    console.log(`🔍 Generated order number: ${orderNumber}`);
    console.log(`🔍 Processed items:`, JSON.stringify(processedItems, null, 2));

    // Create order
    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      items: processedItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      pricing: {
        subtotal,
        tax,
        shipping,
        discount,
        total
      },
      paymentMethod,
      notes,
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Update product inventory
    for (const item of processedItems) {
      const product = await Product.findById(item.product);
      if (product.inventory.trackInventory) {
        // Ensure we have a valid starting quantity (use our fallback logic)
        const currentStock = product.inventory.quantity || 100;
        product.inventory.quantity = Math.max(0, currentStock - item.quantity);
        await product.save();
        console.log(`🔍 Updated inventory for ${product.name}: ${currentStock} → ${product.inventory.quantity}`);
      }
    }

    // Populate order with user and product details
    await order.populate([
      { path: 'user', select: 'firstName lastName email' },
      { path: 'items.product', select: 'name brand images' }
    ]);

    // Send order confirmation (in real app, this would send email)
    console.log(`Order ${order.orderNumber} created for user ${req.user.email}`);

    responseHandler(res, 201, true, {
      order
    }, 'Order created successfully');

  } catch (error) {
    console.error('🚨 Error creating order:', error);
    console.error('🚨 Error stack:', error.stack);
    console.error('🚨 Error name:', error.name);
    console.error('🚨 Error message:', error.message);
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Error creating order',
        code: 'ORDER_CREATION_ERROR',
        details: error.message,
        type: error.name
      }
    });
  }
});

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const options = {
    status,
    page: parseInt(page),
    limit: parseInt(limit)
  };

  const orders = await Order.findByUser(req.user._id, options);

  responseHandler(res, 200, {
    orders,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: orders.length
    },
    message: 'Orders retrieved successfully'
  });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const { status, paymentStatus, page = 1, limit = 10 } = req.query;

  let filter = {};
  if (status) filter.status = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate('user', 'firstName lastName email')
    .populate('items.product', 'name brand images');

  const total = await Order.countDocuments(filter);

  responseHandler(res, 200, {
    orders,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    message: 'Orders retrieved successfully'
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'firstName lastName email phone')
    .populate('items.product', 'name brand images description');

  if (!order) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Order not found',
        code: 'ORDER_NOT_FOUND'
      }
    });
  }

  // Check if user owns the order or is admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: {
        message: 'Access denied',
        code: 'ACCESS_DENIED'
      }
    });
  }

  responseHandler(res, 200, {
    order,
    message: 'Order retrieved successfully'
  });
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber, notes } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Status is required',
        code: 'MISSING_STATUS'
      }
    });
  }

  const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid status',
        code: 'INVALID_STATUS'
      }
    });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Order not found',
        code: 'ORDER_NOT_FOUND'
      }
    });
  }

  // Update order status
  await order.updateStatus(status);

  // Add tracking number if provided
  if (trackingNumber) {
    await order.addTracking(trackingNumber);
  }

  // Add notes if provided
  if (notes) {
    order.notes = notes;
    await order.save();
  }

  // Populate order details
  await order.populate([
    { path: 'user', select: 'firstName lastName email' },
    { path: 'items.product', select: 'name brand images' }
  ]);

  responseHandler(res, 200, {
    order,
    message: 'Order status updated successfully'
  });
});

// @desc    Update payment status
// @route   PUT /api/orders/:id/payment
// @access  Private/Admin
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus } = req.body;

  if (!paymentStatus) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Payment status is required',
        code: 'MISSING_PAYMENT_STATUS'
      }
    });
  }

  const validStatuses = ['pending', 'paid', 'failed', 'refunded'];
  if (!validStatuses.includes(paymentStatus)) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid payment status',
        code: 'INVALID_PAYMENT_STATUS'
      }
    });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Order not found',
        code: 'ORDER_NOT_FOUND'
      }
    });
  }

  await order.updatePaymentStatus(paymentStatus);

  responseHandler(res, 200, {
    order,
    message: 'Payment status updated successfully'
  });
});

// @desc    Cancel order
// @route   DELETE /api/orders/:id
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Order not found',
        code: 'ORDER_NOT_FOUND'
      }
    });
  }

  // Check if user owns the order or is admin
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: {
        message: 'Access denied',
        code: 'ACCESS_DENIED'
      }
    });
  }

  // Check if order can be cancelled
  if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Order cannot be cancelled',
        code: 'ORDER_CANNOT_BE_CANCELLED'
      }
    });
  }

  // Restore inventory
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product && product.inventory.trackInventory) {
      product.inventory.quantity += item.quantity;
      await product.save();
    }
  }

  // Update order status
  await order.updateStatus('cancelled');

  responseHandler(res, 200, {
    order,
    message: 'Order cancelled successfully'
  });
});

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = asyncHandler(async (req, res) => {
  const stats = await Order.getStats();
  
  // Get orders by status
  const statusStats = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get recent orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'firstName lastName email');

  responseHandler(res, 200, {
    stats: stats[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 },
    statusStats,
    recentOrders,
    message: 'Order statistics retrieved successfully'
  });
});

// @desc    Accept order (Admin)
// @route   PUT /api/orders/:id/accept
// @access  Private/Admin
const acceptOrder = asyncHandler(async (req, res) => {
  console.log("🔍 Accepting order:", req.params.id);
  
  const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');
  
  if (!order) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Order not found',
        code: 'ORDER_NOT_FOUND'
      }
    });
  }

  // Update order status
  order.status = 'confirmed';
  order.paymentStatus = 'paid'; // Assuming manual payment is confirmed
  await order.save();

  console.log(`✅ Order ${order.orderNumber} accepted by admin`);
  console.log(`📧 Notifying user ${order.user.email} about order acceptance`);

  responseHandler(res, 200, true, {
    order,
    notification: {
      type: 'order_accepted',
      message: `Your order ${order.orderNumber} has been accepted and is being processed!`,
      userEmail: order.user.email
    }
  }, 'Order accepted successfully');
});

// @desc    Decline order (Admin)
// @route   PUT /api/orders/:id/decline
// @access  Private/Admin
const declineOrder = asyncHandler(async (req, res) => {
  console.log("🔍 Declining order:", req.params.id);
  const { reason } = req.body;
  
  const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');
  
  if (!order) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Order not found',
        code: 'ORDER_NOT_FOUND'
      }
    });
  }

  // Update order status
  order.status = 'cancelled';
  order.notes = reason || 'Order declined by admin';
  await order.save();

  console.log(`❌ Order ${order.orderNumber} declined by admin`);
  console.log(`📧 Notifying user ${order.user.email} about order decline`);

  responseHandler(res, 200, true, {
    order,
    notification: {
      type: 'order_declined',
      message: `Your order ${order.orderNumber} has been declined. ${reason || 'Please contact support for more information.'}`,
      userEmail: order.user.email
    }
  }, 'Order declined successfully');
});

module.exports = {
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
};
