const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Men', 'Women', 'Unisex', 'Gift Sets']
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  colors: [{
    name: String,
    images: [String]
  }],
  brand: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: String,
    required: true,
    trim: true
  },
  fragranceType: {
    type: String,
    required: true,
    enum: ['Eau de Parfum', 'Eau de Toilette', 'Parfum', 'Cologne']
  },
  notes: {
    top: [String],
    middle: [String],
    base: [String]
  },
  longevity: {
    type: String,
    enum: ['2-4 hours', '4-6 hours', '6-8 hours', '8+ hours']
  },
  sillage: {
    type: String,
    enum: ['Light', 'Moderate', 'Strong', 'Very Strong']
  },
  cloudinaryId: {
    type: String
  },
  cloudinaryIds: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);