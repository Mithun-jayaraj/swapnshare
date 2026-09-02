const express = require('express');
const router = express.Router();
const { getAllItems, addItem, deleteItem } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/items — public
router.get('/', getAllItems);

// POST /api/items — protected
router.post('/', protect, addItem);

// DELETE /api/items/:id — protected
router.delete('/:id', protect, deleteItem);

module.exports = router;
