const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary from environment variables
const hasCloudinaryAuth = process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_SECRET;

if (hasCloudinaryAuth) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

/**
 * Create a Multer upload instance backed by Cloudinary.
 * @param {string} folder — Cloudinary folder name (e.g. 'states', 'destinations')
 */
const createUploader = (folder) => {
  if (!hasCloudinaryAuth) {
    console.warn(`[WARNING] Cloudinary config missing! Saving uploads locally to public/images/${folder}...`);
    // Fallback: save to local disk if running offline or without API keys.
    const path = require('path');
    const fs = require('fs');
    const localDir = path.resolve(__dirname, `../../public/images/${folder}`);
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    return multer({
      storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, localDir),
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, ''));
        }
      }),
      limits: { fileSize: 5 * 1024 * 1024 } 
    });
  }

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

const uploadHero = createUploader('heroes');
const uploadBlog = createUploader('blogs');

module.exports = {
  cloudinary,
  createUploader,
  uploadState,
  uploadDestination,
  uploadHero,
  uploadBlog
};
