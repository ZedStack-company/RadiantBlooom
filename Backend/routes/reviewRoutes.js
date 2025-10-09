const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', (req, res) => {
  res.json({ message: 'Get all reviews - to be implemented' });
});

router.get('/product/:productId', (req, res) => {
  res.json({ message: 'Get reviews for product - to be implemented' });
});

// Protected routes
router.use(protect);
//this is not only post request

router.post('/', (req, res) => {
  res.json({ message: 'Create review - to be implemented' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Update review - to be implemented' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete review - to be implemented' });
});

router.post('/:id/helpful', (req, res) => {
  res.json({ message: 'Mark review as helpful - to be implemented' });
});

module.exports = router;
