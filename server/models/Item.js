import mongoose from 'mongoose';

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Furniture',
  'Sports',
  'Toys',
  'Kitchen',
  'Music',
  'Garden',
  'Other',
];

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
    imageUrl: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, 'Category is required'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export { CATEGORIES };
export default mongoose.model('Item', itemSchema);
