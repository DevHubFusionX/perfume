const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { authenticateToken } = require('../middleware/auth');
const { cloudinary, upload } = require('../config/cloudinary');

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.json([]);
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Add new product (protected)
router.post('/', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    const { name, price, category, description, brand, size, fragranceType, notes, longevity, sillage } = req.body;
    
    const images = req.files && req.files.length > 0 
      ? req.files.map(file => file.path)
      : ['https://via.placeholder.com/400x400'];
    
    const cloudinaryIds = req.files && req.files.length > 0
      ? req.files.map(file => file.public_id)
      : [];
    
    const newProduct = new Product({
      name,
      price,
      category,
      description,
      brand,
      size,
      fragranceType,
      notes: notes ? JSON.parse(notes) : undefined,
      longevity,
      sillage,
      image: images[0],
      images,
      cloudinaryId: cloudinaryIds[0] || null,
      cloudinaryIds
    });
    
    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (protected)
router.put('/:id', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, description, brand, size, fragranceType, notes, longevity, sillage } = req.body;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    let updateData = {
      name: name || product.name,
      price: price || product.price,
      category: category || product.category,
      description: description || product.description,
      brand: brand || product.brand,
      size: size || product.size,
      fragranceType: fragranceType || product.fragranceType,
      longevity: longevity || product.longevity,
      sillage: sillage || product.sillage
    };
    
    // Handle notes parsing
    if (notes) {
      try {
        updateData.notes = typeof notes === 'string' ? JSON.parse(notes) : notes;
      } catch (e) {
        updateData.notes = product.notes;
      }
    } else {
      updateData.notes = product.notes;
    }
    
    if (req.files && req.files.length > 0) {
      if (product.cloudinaryIds && product.cloudinaryIds.length > 0) {
        for (const cloudId of product.cloudinaryIds) {
          try {
            await cloudinary.uploader.destroy(cloudId);
          } catch (e) {
            console.log('Cloudinary delete error:', e);
          }
        }
      }
      
      const newImages = req.files.map(file => file.path);
      const newCloudinaryIds = req.files.map(file => file.public_id);
      
      updateData.image = newImages[0];
      updateData.images = newImages;
      updateData.cloudinaryId = newCloudinaryIds[0];
      updateData.cloudinaryIds = newCloudinaryIds;
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
});

// Delete product (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    try {
      if (product.cloudinaryIds && product.cloudinaryIds.length > 0) {
        for (const cloudinaryId of product.cloudinaryIds) {
          if (cloudinaryId) {
            await cloudinary.uploader.destroy(cloudinaryId);
          }
        }
      } else if (product.cloudinaryId) {
        await cloudinary.uploader.destroy(product.cloudinaryId);
      }
    } catch (cloudinaryError) {
      console.log('Cloudinary deletion error (ignored):', cloudinaryError);
    }
    
    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;