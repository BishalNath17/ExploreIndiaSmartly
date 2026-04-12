const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Create a Multer upload instance backed by Cloudinary.
 * @param {string} folder — Cloudinary folder name (e.g. 'states', 'destinations')
 */
const createUploader = (folder) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `explore-india/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }]
    }
  });
  return multer({ storage });
};

// Pre-built uploaders for each content type
const uploadState = createUploader('states');
const uploadDestination = createUploader('destinations');
const uploadHiddenGem = createUploader('hidden-gems');
const uploadHero = createUploader('heroes');
const uploadBlog = createUploader('blogs');

module.exports = {
  cloudinary,
  createUploader,
  uploadState,
  uploadDestination,
  uploadHiddenGem,
  uploadHero,
  uploadBlog
};
