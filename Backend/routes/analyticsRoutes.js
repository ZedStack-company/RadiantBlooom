const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(restrictTo('admin'));

router.get('/dashboard', (req, res) => {
  res.json({ message: 'Get dashboard analytics - to be implemented' });
});

router.get('/sales', (req, res) => {
  res.json({ message: 'Get sales analytics - to be implemented' });
});

router.get('/products', (req, res) => {
  res.json({ message: 'Get product analytics - to be implemented' });
});

router.get('/customers', (req, res) => {
  res.json({ message: 'Get customer analytics - to be implemented' });
});

module.exports = router;
