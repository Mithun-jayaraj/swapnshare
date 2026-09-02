const Item = require('../models/Item');

// GET /api/items — get all items (public)
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error('Get items error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/items — add new item (protected)
const addItem = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: 'Title and description are required' });
    }

    const item = await Item.create({
      title,
      description,
      owner: req.user._id,
    });

    // Populate owner info before sending back
    const populatedItem = await item.populate('owner', 'name email');

    res.status(201).json(populatedItem);
  } catch (error) {
    console.error('Add item error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/items/:id — delete item (owner only)
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Only the owner can delete
    if (item.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this item' });
    }

    await item.deleteOne();

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllItems, addItem, deleteItem };
