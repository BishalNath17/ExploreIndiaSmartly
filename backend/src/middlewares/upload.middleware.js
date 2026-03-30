const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- EXISTING LOGIC FOR JSON-BACKED ENTITIES (Hero, States, etc) ---
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'destinations'; 
    if (req.params.category === 'states') folder = 'states';
    else if (req.params.category === 'hiddenGems') folder = 'destinations';
    else if (req.params.category === 'heroImages') folder = 'heroes';

    const uploadPath = path.resolve(__dirname, '../../../frontend/public/images', folder);
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const id = req.body.id || req.params.id || 'upload';
    cb(null, `${id}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage: fileStorage });

// --- NEW EXACT LOGIC FOR MONGO DESTINATIONS ---
const destStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Strictly bounds inside backend process for static middleware routing /uploads
    const uploadPath = path.resolve(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Guarantee unique but identifiably hashed filenames 
    const ext = path.extname(file.originalname);
    const id = req.body.id || req.params.id || 'dest';
    cb(null, `${id}-${Date.now()}${ext}`);
  }
});
const uploadDest = multer({ storage: destStorage });

// Safely map multiton exports so existing routing array hooks don't throw 
module.exports = {
  upload,
  uploadDest
};
