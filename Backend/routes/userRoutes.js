const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Placeholder routes - to be implemented
router.get('/', restrictTo('admin'), (req, res) => {
  res.json({ message: 'Get all users - to be implemented' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get user by ID - to be implemented' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Update user - to be implemented' });
});

router.delete('/:id', restrictTo('admin'), (req, res) => {
  res.json({ message: 'Delete user - to be implemented' });
});

module.exports = router;
