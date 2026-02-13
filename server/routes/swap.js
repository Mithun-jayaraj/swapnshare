import express from 'express';
import SwapRequest from '../models/SwapRequest.js';
import Item from '../models/Item.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// POST /api/swap  – send a swap request
router.post('/', protect, async (req, res) => {
  try {
    const { itemId, message } = req.body;

    // Get item to find the owner
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Can't request your own item
    if (item.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't swap your own item" });
    }

    // Check for duplicate pending request
    const existing = await SwapRequest.findOne({
      fromUser: req.user._id,
      itemId,
      status: 'pending',
    });
    if (existing) {
      return res.status(400).json({ message: 'You already have a pending request for this item' });
    }

    const swapRequest = await SwapRequest.create({
      fromUser: req.user._id,
      toUser: item.owner,
      itemId,
      message: message || '',
    });

    await swapRequest.populate([
      { path: 'fromUser', select: 'name email avatar' },
      { path: 'toUser', select: 'name email avatar' },
      { path: 'itemId', select: 'title imageUrl category' },
    ]);

    res.status(201).json(swapRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/swap/my  – get all requests related to current user
router.get('/my', protect, async (req, res) => {
  try {
    // Requests I sent
    const sent = await SwapRequest.find({ fromUser: req.user._id })
      .populate('toUser', 'name email avatar')
      .populate('itemId', 'title imageUrl category')
      .sort({ createdAt: -1 });

    // Requests I received
    const received = await SwapRequest.find({ toUser: req.user._id })
      .populate('fromUser', 'name email avatar')
      .populate('itemId', 'title imageUrl category')
      .sort({ createdAt: -1 });

    res.json({ sent, received });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/swap/:id  – accept or reject a swap request
router.put('/:id', protect, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or rejected' });
    }

    const swapRequest = await SwapRequest.findById(req.params.id);
    if (!swapRequest) return res.status(404).json({ message: 'Swap request not found' });

    // Only the recipient can update the status
    if (swapRequest.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    swapRequest.status = status;
    await swapRequest.save();

    // If accepted, mark item as unavailable
    if (status === 'accepted') {
      await Item.findByIdAndUpdate(swapRequest.itemId, { isAvailable: false });
    }

    await swapRequest.populate([
      { path: 'fromUser', select: 'name email avatar' },
      { path: 'toUser', select: 'name email avatar' },
      { path: 'itemId', select: 'title imageUrl category' },
    ]);

    res.json(swapRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
