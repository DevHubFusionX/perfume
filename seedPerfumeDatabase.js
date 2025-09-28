require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Combo = require('./models/Combo');

const MONGODB_URI = 'mongodb+srv://fanyanwu83_db_user:FAXaiMgTVxeKs8aQ@cluster0.uebkoxc.mongodb.net/essence_boutique?retryWrites=true&w=majority&appName=Cluster0';

const perfumeProducts = [
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
  },
  {
    name: "Chanel No. 5",
    price: "₦95,000",
    category: "Women",
    description: "The world's most iconic fragrance. A timeless floral aldehyde with jasmine and rose at its heart.",
    brand: "Chanel",
    size: "100ml",
    fragranceType: "Eau de Parfum",
    notes: {
      top: ["Aldehydes", "Bergamot", "Lemon"],
      middle: ["Jasmine", "Rose", "Lily of the Valley"],
      base: ["Sandalwood", "Vanilla", "Amber"]
    },
    longevity: "6-8 hours",
    sillage: "Strong",
    image: "https://via.placeholder.com/400x400/EC4899/FFFFFF?text=Chanel+No.5",
    images: ["https://via.placeholder.com/400x400/EC4899/FFFFFF?text=Chanel+No.5"]
  },
  {
    name: "Dior Sauvage",
    price: "₦75,000",
    category: "Men",
    description: "A fresh and spicy fragrance inspired by wide-open spaces. Raw and noble all at once.",
    brand: "Dior",
    size: "100ml",
    fragranceType: "Eau de Toilette",
    notes: {
      top: ["Bergamot", "Pepper"],
      middle: ["Sichuan Pepper", "Lavender", "Pink Pepper"],
      base: ["Ambroxan", "Cedar", "Labdanum"]
    },
    longevity: "6-8 hours",
    sillage: "Strong",
    image: "https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=Dior+Sauvage",
    images: ["https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=Dior+Sauvage"]
  },
  {
    name: "Versace Bright Crystal",
    price: "₦45,000",
    category: "Women",
    description: "A fresh, vibrant, and flowery fragrance. A sensual blend of pomegranate and peony.",
    brand: "Versace",
    size: "90ml",
    fragranceType: "Eau de Toilette",
    notes: {
      top: ["Pomegranate", "Yuzu", "Water Notes"],
      middle: ["Peony", "Magnolia", "Lotus Flower"],
      base: ["Musk", "Mahogany", "Amber"]
    },
    longevity: "4-6 hours",
    sillage: "Moderate",
    image: "https://via.placeholder.com/400x400/EC4899/FFFFFF?text=Versace+Crystal",
    images: ["https://via.placeholder.com/400x400/EC4899/FFFFFF?text=Versace+Crystal"]
  },
  {
    name: "Creed Aventus",
    price: "₦120,000",
    category: "Men",
    description: "A sophisticated blend inspired by the dramatic life of a historic emperor. Bold and confident.",
    brand: "Creed",
    size: "100ml",
    fragranceType: "Eau de Parfum",
    notes: {
      top: ["Pineapple", "Bergamot", "Apple", "Blackcurrant"],
      middle: ["Rose", "Dry Birch", "Moroccan Jasmine"],
      base: ["Oak Moss", "Musk", "Ambergris", "Vanilla"]
    },
    longevity: "8+ hours",
    sillage: "Very Strong",
    image: "https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=Creed+Aventus",
    images: ["https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=Creed+Aventus"]
  },
  {
    name: "Yves Saint Laurent Black Opium",
    price: "₦68,000",
    category: "Women",
    description: "A seductive gourmand fragrance with coffee, vanilla, and white flowers. Addictive and mysterious.",
    brand: "Yves Saint Laurent",
    size: "90ml",
    fragranceType: "Eau de Parfum",
    notes: {
      top: ["Pink Pepper", "Orange Blossom", "Pear"],
      middle: ["Coffee", "Jasmine", "Bitter Almond"],
      base: ["Vanilla", "Patchouli", "Cedar"]
    },
    longevity: "6-8 hours",
    sillage: "Strong",
    image: "https://via.placeholder.com/400x400/EC4899/FFFFFF?text=YSL+Black+Opium",
    images: ["https://via.placeholder.com/400x400/EC4899/FFFFFF?text=YSL+Black+Opium"]
  },
  {
    name: "Bleu de Chanel",
    price: "₦78,000",
    category: "Men",
    description: "A woody aromatic fragrance that embodies freedom. Fresh, clean, and profoundly sensual.",
    brand: "Chanel",
    size: "100ml",
    fragranceType: "Eau de Parfum",
    notes: {
      top: ["Grapefruit", "Lemon", "Mint", "Pink Pepper"],
      middle: ["Ginger", "Nutmeg", "Jasmine", "Melon"],
      base: ["Incense", "Amber", "Sandalwood", "Patchouli"]
    },
    longevity: "6-8 hours",
    sillage: "Strong",
    image: "https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=Bleu+de+Chanel",
    images: ["https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=Bleu+de+Chanel"]
  },
  {
    name: "Luxury Gift Set",
    price: "₦65,000",
    category: "Gift Sets",
    description: "Perfect gift set containing 3 mini fragrances (30ml each) in an elegant presentation box.",
    brand: "Essence Boutique",
    size: "3x30ml",
    fragranceType: "Eau de Parfum",
    notes: {
      top: ["Various"],
      middle: ["Various"],
      base: ["Various"]
    },
    longevity: "6-8 hours",
    sillage: "Moderate",
    image: "https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=Gift+Set",
    images: ["https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=Gift+Set"]
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    await Combo.deleteMany({});

    // Insert perfume products
    console.log('Inserting perfume products...');
    const insertedProducts = await Product.insertMany(perfumeProducts);
    console.log(`Inserted ${insertedProducts.length} products`);

    // Create sample gift sets/combos
    const sampleCombos = [
      {
        name: "Luxury Couple's Set",
        description: "Perfect for couples - includes one men's and one women's premium fragrance",
        products: [insertedProducts[2]._id, insertedProducts[1]._id], // Dior Sauvage + Chanel No. 5
        originalPrice: "₦170,000",
        comboPrice: "₦145,000",
        savings: "₦25,000",
        images: ["https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=Couple+Set"],
        popular: true
      },
      {
        name: "Women's Luxury Collection",
        description: "Three premium women's fragrances in travel sizes",
        products: [insertedProducts[1]._id, insertedProducts[3]._id, insertedProducts[5]._id], // Chanel, Versace, YSL
        originalPrice: "₦208,000",
        comboPrice: "₦175,000",
        savings: "₦33,000",
        images: ["https://via.placeholder.com/400x400/EC4899/FFFFFF?text=Women+Collection"],
        popular: false
      }
    ];

    console.log('Inserting combo sets...');
    const insertedCombos = await Combo.insertMany(sampleCombos);
    console.log(`Inserted ${insertedCombos.length} combo sets`);

    console.log('Database seeding completed successfully!');
    console.log('Summary:');
    console.log(`- Products: ${insertedProducts.length}`);
    console.log(`- Combo Sets: ${insertedCombos.length}`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding
seedDatabase();