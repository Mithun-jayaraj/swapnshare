const SwapRequest = require('../models/SwapRequest');
const Item = require('../models/Item');

// POST /api/swap — send a swap request
const sendSwapRequest = async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: 'Item ID is required' });
    }

    // Find the item
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Can't request your own item
    if (item.owner.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You can't request your own item" });
    }

    // Check if a pending request already exists
    const existing = await SwapRequest.findOne({
      fromUser: req.user._id,
      itemId,
      status: 'pending',
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: 'You already have a pending request for this item' });
    }

    // Create swap request
    const swapRequest = await SwapRequest.create({
      fromUser: req.user._id,
      toUser: item.owner,
      itemId,
    });

    res.status(201).json({ message: 'Swap request sent!', swapRequest });
  } catch (error) {
    console.error('Send swap error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/swap/my — get sent + received requests
const getMyRequests = async (req, res) => {
  try {
    // Requests I sent
    const sent = await SwapRequest.find({ fromUser: req.user._id })
      .populate('toUser', 'name email')
      .populate('itemId', 'title description')
      .sort({ createdAt: -1 });

    // Requests I received
    const received = await SwapRequest.find({ toUser: req.user._id })
      .populate('fromUser', 'name email')
      .populate('itemId', 'title description')
      .sort({ createdAt: -1 });

    res.json({ sent, received });
  } catch (error) {
    console.error('Get requests error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/swap/:id — accept or reject a swap request
const updateSwapStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res
        .status(400)
        .json({ message: 'Status must be "accepted" or "rejected"' });
    }

    const swapRequest = await SwapRequest.findById(req.params.id);
    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Only the item owner (toUser) can accept/reject
    if (swapRequest.toUser.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this request' });
    }

    // Can only update pending requests
    if (swapRequest.status !== 'pending') {
      return res
        .status(400)
        .json({ message: 'This request has already been responded to' });
    }

    swapRequest.status = status;
    await swapRequest.save();

    res.json({ message: `Request ${status}`, swapRequest });
  } catch (error) {
    console.error('Update swap error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { sendSwapRequest, getMyRequests, updateSwapStatus };
