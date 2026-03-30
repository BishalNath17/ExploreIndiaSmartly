const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'destinations'; // default
    
    // Using req.params or req.body to figure out the target folder
    if (req.params.category === 'states') {
      folder = 'states';
    } else if (req.params.category === 'hiddenGems') {
      folder = 'destinations'; // For now, hidden gems use destination images
    } else if (req.params.category === 'heroImages') {
      folder = 'heroes';
    }

    const uploadPath = path.resolve(__dirname, '../../../frontend/public/images', folder);
    
    // Ensure the folder exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const id = req.body.id || req.params.id || 'upload';
    // Append timestamp to prevent caching issues if overwriting
    cb(null, `${id}-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });
module.exports = upload;
