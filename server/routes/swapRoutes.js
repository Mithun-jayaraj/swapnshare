const express = require('express');
const router = express.Router();
const {
  sendSwapRequest,
  getMyRequests,
  updateSwapStatus,
} = require('../controllers/swapController');
const { protect } = require('../middleware/authMiddleware');

// All swap routes are protected
router.post('/', protect, sendSwapRequest);
router.get('/my', protect, getMyRequests);
router.put('/:id', protect, updateSwapStatus);

module.exports = router;
