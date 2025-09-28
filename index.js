require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDatabase = require('./config/database');
const { seedProducts } = require('./utils/seedData');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Keep-alive service for free tier
if (process.env.NODE_ENV === 'production') {
  require('./keepAlive');
}

// Connect to database
connectDatabase().then(() => {
  seedProducts();
});

app.use(cors({
  origin: ['https://essence-boutique.vercel.app', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}));
app.use(express.json());

// Health check endpoints
app.get('/', (req, res) => {
  res.json({ 
    message: 'Essence Boutique API is running',
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/admin', authRoutes);
app.use('/api/admin/products', productRoutes);

// Combos routes
app.get('/api/combos', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    const Combo = require('./models/Combo');
    const combos = await Combo.find().populate('products').sort({ createdAt: -1 });
    res.json(combos);
  } catch (error) {
    console.error('Error fetching combos:', error);
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});