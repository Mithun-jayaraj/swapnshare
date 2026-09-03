const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      default: 'Other',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
      city: { type: String }
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
