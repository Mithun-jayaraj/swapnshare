import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';
import swapRoutes from './routes/swap.js';
import bookmarkRoutes from './routes/bookmarks.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/swap', swapRoutes);
app.use('/api', bookmarkRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'SwapnShare API is running!' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
