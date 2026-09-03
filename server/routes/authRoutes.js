const express = require('express');
const router = express.Router();
const { register, login, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// PUT /api/auth/profile
router.put('/profile', protect, updateProfile);

// PUT /api/auth/password
router.put('/password', protect, changePassword);

module.exports = router;
