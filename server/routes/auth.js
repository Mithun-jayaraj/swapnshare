import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// 🔑 Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ================= REGISTER =================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, latitude, longitude } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      latitude: latitude || null,
      longitude: longitude || null,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        latitude: user.latitude,
        longitude: user.longitude,
        savedItems: user.savedItems,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= LOGIN =================
router.post('/login', async (req, res) => {
  try {
    const { email, password, latitude, longitude } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Update location
    if (latitude && longitude) {
      user.latitude = latitude;
      user.longitude = longitude;
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        latitude: user.latitude,
        longitude: user.longitude,
        savedItems: user.savedItems,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= GET PROFILE =================
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('savedItems');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= UPDATE LOCATION =================
router.put('/me', protect, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { latitude, longitude },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
