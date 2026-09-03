const Item = require('../models/Item');

// Haversine distance helper function (in kilometers)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// GET /api/items — get all items (public)
const getAllItems = async (req, res) => {
  try {
    const { category, lat, lng, radius } = req.query;

    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }

    let items = await Item.find(query)
      .populate('owner', 'name email location')
      .sort({ createdAt: -1 });

    // Distance filtering (if lat, lng, and radius are provided)
    if (lat && lng && radius && radius !== 'any') {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const radiusKm = parseFloat(radius);

      items = items.filter(item => {
        // Use item location if available, otherwise fallback to owner location
        const loc = item.location && item.location.latitude ? item.location : (item.owner && item.owner.location);
        
        if (!loc || !loc.latitude || !loc.longitude) {
           return false; // Skip items without location if distance filter is applied strictly
           // Alternatively, we could include them by returning true, but for a strict distance filter, false is better.
        }

        const distance = getDistanceFromLatLonInKm(userLat, userLng, loc.latitude, loc.longitude);
        item._doc.distance = distance; // Temporarily attach distance for frontend sorting if needed
        return distance <= radiusKm;
      });
    } else if (lat && lng) {
      // Just calculate distance without filtering if lat/lng provided but no strict radius
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      items.forEach(item => {
        const loc = item.location && item.location.latitude ? item.location : (item.owner && item.owner.location);
        if (loc && loc.latitude && loc.longitude) {
           item._doc.distance = getDistanceFromLatLonInKm(userLat, userLng, loc.latitude, loc.longitude);
        }
      });
    }

    res.json(items);
  } catch (error) {
    console.error('Get items error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/items — add new item (protected)
const addItem = async (req, res) => {
  try {
    const { title, description, category, imageUrl, location } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: 'Title and description are required' });
    }

    const item = await Item.create({
      title,
      description,
      owner: req.user._id,
      category: category || 'Other',
      imageUrl: imageUrl || '',
      location: location || undefined
    });

    // Populate owner info before sending back
    const populatedItem = await item.populate('owner', 'name email location');

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
