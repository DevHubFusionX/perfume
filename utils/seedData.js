const mongoose = require('mongoose');
const Product = require('../models/Product');

const seedProducts = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected, skipping seeding');
      return;
    }
    const count = await Product.countDocuments();
    if (count === 0) {
      const initialProducts = [
        {
          name: "Tom Ford Black Orchid",
          price: "₦85,000",
          category: "Unisex",
          description: "A luxurious and sensual fragrance with rich, dark accords of ylang ylang, bergamot, and black truffle.",
          brand: "Tom Ford",
          size: "100ml",
          fragranceType: "Eau de Parfum",
          notes: {
            top: ["Bergamot", "Black Truffle", "Ylang Ylang"],
            middle: ["Black Orchid", "Spices", "Fruity Notes"],
            base: ["Patchouli", "Vanilla", "Incense"]
          },
          longevity: "8+ hours",
          sillage: "Very Strong",
          image: "https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=Tom+Ford",
          images: ["https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=Tom+Ford"]
        }
      ];
      await Product.insertMany(initialProducts);
      console.log('Initial products seeded');
    }
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

module.exports = { seedProducts };