const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dmeotbtcs',
  api_key: process.env.CLOUDINARY_API_KEY || '853546425432613',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'ZUTI3Z-pJZoNcti34keGu76mYl0'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'essence_boutique_products',   
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };