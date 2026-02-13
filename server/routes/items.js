import express from 'express';
import Item from '../models/Item.js';
import protect from '../middleware/auth.js';
import { getDistanceKm } from '../utils/distance.js';

const router = express.Router();

// GET /api/items  – fetch items within 10km of requesting user
router.get('/', protect, async (req, res) => {
  try {
    const { search, category } = req.query;
    const currentUser = req.user;

    // Build MongoDB query
    const query = { isAvailable: true };
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    // Fetch all available items with owner info
    const allItems = await Item.find(query).populate(
      'owner',
      'name email latitude longitude avatar'
    );

    let items = allItems;

    // Filter by 10km radius if user has location
    if (currentUser.latitude && currentUser.longitude) {
      items = allItems.filter((item) => {
        // Include user's own items regardless of distance
        if (item.owner._id.toString() === currentUser._id.toString()) return true;

        // Skip items from owners without location
        if (!item.owner.latitude || !item.owner.longitude) return false;

        const dist = getDistanceKm(
          currentUser.latitude,
          currentUser.longitude,
          item.owner.latitude,
          item.owner.longitude
        );

        return dist <= 10; // 10km radius
      });

      // Attach distance to each item
      items = items.map((item) => {
        const itemObj = item.toObject();
        if (item.owner.latitude && item.owner.longitude) {
          itemObj.distance = parseFloat(
            getDistanceKm(
              currentUser.latitude,
              currentUser.longitude,
              item.owner.latitude,
              item.owner.longitude
            ).toFixed(1)
          );
        } else {
          itemObj.distance = null;
        }
        return itemObj;
      });
    }

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/items/mine  – get current user's items
router.get('/mine', protect, async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/items/:id  – get single item
router.get('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      'owner',
      'name email latitude longitude avatar'
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/items  – create new item
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, imageUrl, category } = req.body;

    const item = await Item.create({
      title,
      description,
      imageUrl,
      category,
      owner: req.user._id,
    });

    await item.populate('owner', 'name email avatar');
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/items/:id  – delete item (owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Only the owner can delete
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await item.deleteOne();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
