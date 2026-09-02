import express from 'express';
import User from '../models/User.js';
import Item from '../models/Item.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// POST /api/bookmark/:itemId  – toggle bookmark
router.post('/bookmark/:itemId', protect, async (req, res) => {
  try {
    const { itemId } = req.params;

    // Verify item exists
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const user = await User.findById(req.user._id);
    const isBookmarked = user.savedItems.includes(itemId);

    if (isBookmarked) {
      // Remove bookmark
      user.savedItems = user.savedItems.filter((id) => id.toString() !== itemId);
      await user.save();
      res.json({ message: 'Bookmark removed', bookmarked: false });
    } else {
      // Add bookmark
      user.savedItems.push(itemId);
      await user.save();
      res.json({ message: 'Item bookmarked', bookmarked: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/bookmarks  – get all bookmarked items
router.get('/bookmarks', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedItems',
      populate: { path: 'owner', select: 'name email avatar' },
    });
    res.json(user.savedItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
