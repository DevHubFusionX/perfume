const mongoose = require('mongoose');

const connectDatabase = async () => {
  let MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://fanyanwu83_db_user:FAXaiMgTVxeKs8aQ@cluster0.uebkoxc.mongodb.net/essence_boutique?retryWrites=true&w=majority&appName=Cluster0';

  if (MONGODB_URI.startsWith('MONGODB_URI=')) {
    MONGODB_URI = MONGODB_URI.replace('MONGODB_URI=', '');
  }

  if (!MONGODB_URI || (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://'))) {
    console.error('Invalid MongoDB URI format');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
};

module.exports = connectDatabase;